const crypto = require("crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const Razorpay = require("razorpay");

const { REGION, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("./config");
const { rupeesToPaise } = require("./currency");

function razorpayClient() {
  const keyId = RAZORPAY_KEY_ID.value();
  const keySecret = RAZORPAY_KEY_SECRET.value();

  if (!keyId || !keySecret) {
    throw new HttpsError("failed-precondition", "Payment gateway is not configured on the server.", {
      code: "PAYMENT_GATEWAY_NOT_CONFIGURED",
    });
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

const ELIGIBLE_STATUSES = new Set(["paid", "captured", "completed", "authorized"]);

async function verifyAdmin(db, email) {
  if (!email || typeof email !== "string") {
    throw new HttpsError("permission-denied", "Access denied. Admin identity required.", {
      code: "PERMISSION_DENIED",
    });
  }
  const adminSnap = await db.collection("admins").doc(email.trim()).get();
  if (!adminSnap.exists || adminSnap.data().role !== "admin") {
    throw new HttpsError("permission-denied", "Access denied. Admin identity required.", {
      code: "PERMISSION_DENIED",
    });
  }
  return true;
}

function validateRefundEligibility(payment) {
  if (!payment) {
    throw new HttpsError("not-found", "Payment record not found.", {
      code: "PAYMENT_NOT_FOUND",
    });
  }

  const status = String(payment.status || "").trim().toLowerCase();
  if (!ELIGIBLE_STATUSES.has(status)) {
    throw new HttpsError(
      "failed-precondition",
      `Payment status "${status}" is not eligible for refund.`,
      { code: "PAYMENT_NOT_ELIGIBLE" }
    );
  }

  if (payment.refundStatus === "refunded" || payment.refundId) {
    throw new HttpsError("failed-precondition", "This payment has already been refunded.", {
      code: "ALREADY_REFUNDED",
    });
  }

  const amountPaise = rupeesToPaise(payment.amount);
  if (!Number.isInteger(amountPaise) || amountPaise <= 0) {
    throw new HttpsError("failed-precondition", "Invalid payment amount for refund.", {
      code: "INVALID_REFUND_AMOUNT",
    });
  }

  return { amountPaise, status };
}

async function checkDuplicateRefund(db, paymentId) {
  const existingSnap = await db
    .collection("refunds")
    .where("paymentId", "==", paymentId)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    throw new HttpsError("failed-precondition", "A refund record already exists for this payment.", {
      code: "ALREADY_REFUNDED",
    });
  }
}

async function executeRazorpayRefund(rzp, paymentId, amountPaise, adminEmail) {
  try {
    const rzpRefund = await rzp.payments.refund(paymentId, {
      amount: amountPaise,
      notes: {
        requestedBy: adminEmail,
        paymentId,
      },
    });
    return rzpRefund;
  } catch (err) {
    console.error(`[Razorpay Error] Refund failed for payment ${paymentId}:`, err);
    const errorMsg =
      (err && err.error && err.error.description) ||
      (err && err.message) ||
      "Payment gateway refund failed.";
    throw new HttpsError("failed-precondition", `Refund failed: ${errorMsg}`, {
      code: "RAZORPAY_REFUND_FAILED",
    });
  }
}

/**
 * requestRefund - Admin-only callable function for full Razorpay refunds.
 * Input: { paymentId: "<razorpay payment ID>" }
 */
const requestRefund = onCall(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in to continue.", {
        code: "UNAUTHENTICATED",
      });
    }

    const adminEmail = request.auth.token && request.auth.token.email;
    if (!adminEmail) {
      throw new HttpsError("permission-denied", "Access denied. Admin email required.", {
        code: "PERMISSION_DENIED",
      });
    }

    const db = getFirestore();

    await verifyAdmin(db, adminEmail);

    const { paymentId } = request.data || {};
    const cleanPaymentId = String(paymentId || "").trim();
    if (!cleanPaymentId) {
      throw new HttpsError("invalid-argument", "Missing or invalid payment ID.", {
        code: "INVALID_PAYMENT_ID",
      });
    }

    const paymentRef = db.collection("payments").doc(cleanPaymentId);
    const paymentSnap = await paymentRef.get();
    if (!paymentSnap.exists) {
      throw new HttpsError("not-found", "Payment record not found.", {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    const payment = paymentSnap.data();

    const { amountPaise } = validateRefundEligibility(payment);

    await checkDuplicateRefund(db, cleanPaymentId);

    const rzp = razorpayClient();

    const rzpRefund = await executeRazorpayRefund(rzp, cleanPaymentId, amountPaise, adminEmail);

    const razorpayRefundId = (rzpRefund && rzpRefund.id) || `rfnd_${crypto.randomUUID()}`;
    const refundRef = db.collection("refunds").doc(razorpayRefundId);

    const now = FieldValue.serverTimestamp();
    const refundData = {
      userId: payment.userId || null,
      paymentId: cleanPaymentId,
      orderId: payment.orderId || null,
      razorpayOrderId: payment.razorpayOrderId || null,
      amount: payment.amount,
      amountPaise,
      currency: payment.currency || "INR",
      status: (rzpRefund && rzpRefund.status) || "processed",
      razorpayRefundId,
      requestedBy: adminEmail,
      requestedAt: now,
      createdAt: now,
    };

    try {
      await refundRef.set(refundData);
      await paymentRef.update({
        refundStatus: "refunded",
        refundId: razorpayRefundId,
        refundedAt: now,
      });
    } catch (dbErr) {
      console.error(`[Firestore Error] Failed to persist refund record ${razorpayRefundId}:`, dbErr);
    }

    return {
      status: "success",
      refundId: razorpayRefundId,
      paymentId: cleanPaymentId,
      amount: payment.amount,
      currency: payment.currency || "INR",
      requestedBy: adminEmail,
    };
  }
);

module.exports = {
  requestRefund,
  verifyAdmin,
  validateRefundEligibility,
  checkDuplicateRefund,
  executeRazorpayRefund,
  razorpayClient,
};
