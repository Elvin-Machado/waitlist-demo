const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { HttpsError } = require("firebase-functions/v2/https");

const { positiveNumber } = require("./currency");
const { promotionError, normaliseCode } = require("./promotions");

function invoiceNumberFor(paymentId) {
  const stamp = new Date();
  const y = stamp.getFullYear();
  const m = String(stamp.getMonth() + 1).padStart(2, "0");
  const seq =
    String(paymentId || "")
      .replace(/^pay_/i, "")
      .slice(-8)
      .toUpperCase() || "0";

  return `INV-${y}${m}-${seq}`;
}

function buildEnrollment(item, domainName) {
  const durationNumber = parseInt(item.duration, 10);
  const canonicalCode = String(item.courseCode || "")
    .trim()
    .toUpperCase();

  return {
    id: canonicalCode,
    code: canonicalCode,
    title: item.title || canonicalCode,
    category: domainName || "Compliance",
    instructor: "KAWS Advisory Board",
    progress: 0,
    totalLessons: durationNumber ? durationNumber * 3 : 8,
    completedLessons: 0,
    thumbnail: item.image
      ? `/${String(item.image).replace(/^\/+/, "")}`
      : "/career.png",
    status: "in-progress",
    duration: item.duration || "4 Hours",
    enrolledAt: new Date().toISOString(),
  };
}

/**
 * Atomically and idempotently finalises a verified, paid order.
 *
 * IMPORTANT:
 * Firestore transactions require all transaction reads to happen
 * before any transaction writes.
 */
async function finalizePaidOrder({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  uid,
}) {
  const db = getFirestore();

  const orderRef = db.collection("paymentOrders").doc(orderId);
  const paymentRef = db.collection("payments").doc(razorpayPaymentId);

  const transactionId = `txn_${razorpayPaymentId}`;
  const invoiceId = `inv_${razorpayPaymentId}`;
  const invoiceNumber = invoiceNumberFor(razorpayPaymentId);

  return db.runTransaction(async (tx) => {
    /*
     * ============================================================
     * 1. ALL TRANSACTION READS
     * ============================================================
     */

    // Read payment order.
    const orderSnap = await tx.get(orderRef);

    if (!orderSnap.exists) {
      throw new HttpsError(
        "not-found",
        "Order not found.",
        {
          code: "ORDER_NOT_FOUND",
        }
      );
    }

    const order = orderSnap.data();

    // Verify that the order belongs to the current user
    // and matches the Razorpay order.
    if (
      order.userId !== uid ||
      order.razorpayOrderId !== razorpayOrderId
    ) {
      throw new HttpsError(
        "permission-denied",
        "This payment does not belong to your order.",
        {
          code: "PAYMENT_ORDER_MISMATCH",
        }
      );
    }

    /*
     * Idempotency:
     * If the order has already been marked paid, simply return
     * the existing result instead of creating duplicate records.
     */
    const alreadyProcessed = {
      status: "success",
      alreadyProcessed: true,
      orderId,
      paymentId: razorpayPaymentId,
      transactionId: order.transactionId || transactionId,
      invoiceNumber: order.invoiceNumber || invoiceNumber,
      courseCodes: order.enrolledCourseCodes || [],
    };

    if (order.status === "paid") {
      return alreadyProcessed;
    }

    /*
     * Read the payment record to make sure this Razorpay payment
     * has not already been used by another order.
     */
    const paymentSnap = await tx.get(paymentRef);

    if (paymentSnap.exists) {
      const existing = paymentSnap.data();

      if (existing.orderId === orderId) {
        return alreadyProcessed;
      }

      throw new HttpsError(
        "failed-precondition",
        "This payment was already used for another order.",
        {
          code: "PAYMENT_ALREADY_USED",
        }
      );
    }

    /*
     * Promotion reads.
     */
    let promotion = null;

    if (order.couponCode && order.promotionId) {
      const promoRef = db
        .collection("promotions")
        .doc(order.promotionId);

      const usageRef = db
        .collection("promotionUsage")
        .doc(`${order.promotionId}_${uid}`);

      // Read promotion.
      const promoSnap = await tx.get(promoRef);

      const promo = promoSnap.exists
        ? {
            id: order.promotionId,
            ...promoSnap.data(),
          }
        : null;

      // Read per-user promotion usage.
      const usageSnap = await tx.get(usageRef);

      const perUserUsedCount = usageSnap.exists
        ? positiveNumber(usageSnap.data().count)
        : 0;

      // Validate promotion.
      const err = promotionError(promo, {
        eligibleAmount: order.subtotal,
        usedCount: promo
          ? positiveNumber(promo.usedCount)
          : 0,
        perUserUsedCount,
      });

      if (err) {
        throw new HttpsError(
          "failed-precondition",
          err.message,
          {
            code: err.code,
          }
        );
      }

      promotion = {
        ref: promoRef,
        data: promo,
        usageRef,
        perUserUsedCount,
      };
    }

    /*
     * IMPORTANT:
     * Read the user BEFORE ANY tx.update()/tx.set().
     */
    const userRef = db.collection("users").doc(uid);
    const userSnap = await tx.get(userRef);

    const alreadyEnrolledCodes = new Set();

    if (userSnap.exists) {
      for (const existing of userSnap.data().enrolledCourses || []) {
        const code = String(
          existing.code || existing.id || ""
        )
          .trim()
          .toUpperCase();

        if (code) {
          alreadyEnrolledCodes.add(code);
        }
      }
    }

    /*
     * ============================================================
     * 2. NON-TRANSACTION DOMAIN LOOKUPS
     * ============================================================
     *
     * These use normal Firestore reads, not tx.get().
     * They happen before the first transaction write.
     */

    const domainNames = {};

    for (const item of order.items || []) {
      const domainId = String(item.domainId || "").trim();

      if (domainId && !domainNames[domainId]) {
        try {
          const domainSnap = await db
            .collection("courses")
            .doc(domainId)
            .get();

          if (domainSnap.exists) {
            domainNames[domainId] =
              domainSnap.data().domainName || domainId;
          } else {
            domainNames[domainId] = domainId;
          }
        } catch (error) {
          domainNames[domainId] = domainId;
        }
      }
    }

    /*
     * Prepare enrollment information before writes.
     */
    const freshEnrollments = [];

    const courseCodes = (order.items || []).map((item) =>
      String(item.courseCode || "")
        .trim()
        .toUpperCase()
    );

    for (const item of order.items || []) {
      const domainId = String(item.domainId || "").trim();

      const enrollment = buildEnrollment(
        item,
        domainNames[domainId] || "Compliance"
      );

      if (!alreadyEnrolledCodes.has(enrollment.code)) {
        freshEnrollments.push(enrollment);
      }
    }

    /*
     * ============================================================
     * 3. ALL TRANSACTION WRITES
     * ============================================================
     *
     * There must be NO tx.get() after this point.
     */

    const now = FieldValue.serverTimestamp();

    /*
     * Update payment order.
     */
    tx.update(orderRef, {
      status: "paid",
      razorpayPaymentId,
      transactionId,
      invoiceId,
      invoiceNumber,
      paidAt: now,
      enrolledCourseCodes: courseCodes,
    });

    /*
     * Create payment record.
     */
    tx.set(
      paymentRef,
      {
        userId: uid,
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        amount: order.finalAmount,
        currency: "INR",
        status: "paid",
        method: "razorpay",
        createdAt: now,
      },
      {
        merge: true,
      }
    );

    /*
     * Create transaction record.
     */
    tx.set(
      db.collection("transactions").doc(transactionId),
      {
        userId: uid,
        orderId,
        paymentId: razorpayPaymentId,
        subtotal: order.subtotal,
        courseDiscount: order.courseDiscount,
        promotionDiscount: order.promotionDiscount,
        amount: order.finalAmount,
        currency: "INR",
        couponCode: order.couponCode || null,
        status: "completed",
        createdAt: now,
      },
      {
        merge: true,
      }
    );

    /*
     * Create invoice.
     */
    tx.set(
      db.collection("invoices").doc(invoiceId),
      {
        userId: uid,
        orderId,
        paymentId: razorpayPaymentId,
        invoiceNumber,
        subtotal: order.subtotal,
        courseDiscount: order.courseDiscount,
        promotionDiscount: order.promotionDiscount,
        total: order.finalAmount,
        currency: "INR",
        status: "paid",
        issuedAt: now,
      },
      {
        merge: true,
      }
    );

    /*
     * Create/update course enrollments.
     */
    for (const item of order.items || []) {
      const domainId = String(item.domainId || "").trim();

      const enrollment = buildEnrollment(
        item,
        domainNames[domainId] || "Compliance"
      );

      tx.set(
        db
          .collection("users")
          .doc(uid)
          .collection("enrollments")
          .doc(enrollment.code),
        {
          ...enrollment,
          orderId,
          paymentId: razorpayPaymentId,
          purchasedAt: now,
        },
        {
          merge: true,
        }
      );
    }

    /*
     * Add newly purchased courses to user's enrolledCourses array.
     */
    if (freshEnrollments.length > 0) {
      tx.set(
        userRef,
        {
          enrolledCourses: FieldValue.arrayUnion(
            ...freshEnrollments
          ),
        },
        {
          merge: true,
        }
      );
    }

    /*
     * Promotion redemption + usage.
     */
    if (promotion) {
      const {
        ref: promoRef,
        data: promo,
        usageRef,
      } = promotion;

      /*
       * Create redemption record.
       */
      tx.set(
        db
          .collection("promotionRedemptions")
          .doc(`${order.promotionId}_${razorpayPaymentId}`),
        {
          promotionId: order.promotionId,
          couponCode: normaliseCode(promo.code),
          userId: uid,
          orderId,
          razorpayPaymentId,
          originalAmount: order.subtotal,
          discountAmount: order.promotionDiscount,
          finalAmount: order.finalAmount,
          redeemedAt: now,
        },
        {
          merge: true,
        }
      );

      /*
       * Increment global promotion usage.
       */
      tx.update(promoRef, {
        usedCount: FieldValue.increment(1),
      });

      /*
       * Increment per-user promotion usage.
       */
      tx.set(
        usageRef,
        {
          count: FieldValue.increment(1),
          lastRedeemedAt: now,
        },
        {
          merge: true,
        }
      );
    }

    /*
     * ============================================================
     * 4. SUCCESS
     * ============================================================
     */

    return {
      status: "success",
      alreadyProcessed: false,
      orderId,
      paymentId: razorpayPaymentId,
      transactionId,
      invoiceNumber,
      courseCodes,
    };
  });
}

module.exports = {
  finalizePaidOrder,
  invoiceNumberFor,
  buildEnrollment,
};