const crypto = require("crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const Razorpay = require("razorpay");

const { REGION, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, MIN_PAYABLE_PAISE } = require("./config");
const { normaliseCode, findPromotionByCode, promotionError, describePromotion } = require("./promotions");
const { computeOrderAmounts } = require("./pricing");
const { positiveNumber } = require("./currency");

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

function requireAuth(context) {
  const uid = context.auth ? context.auth.uid : null;
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in to continue.", {
      code: "UNAUTHENTICATED",
    });
  }
  return uid;
}

/**
 * Loads the actual course documents and computes authoritative amounts.
 * No price is ever accepted from the client.
 */
async function resolveOrder(db, rawItems, couponCode, uid) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new HttpsError("invalid-argument", "No courses in cart.", { code: "EMPTY_CART" });
  }

  const items = [];
  for (const entry of rawItems) {
    const courseCode = String((entry && entry.courseCode) || "").trim().toUpperCase();
    const domainId = String((entry && entry.domainId) || "").trim();
    if (!courseCode || !domainId) {
      throw new HttpsError("invalid-argument", "One or more cart items are missing course information.", {
        code: "INVALID_CART_ITEM",
      });
    }

    const courseSnap = await db
      .collection("courses")
      .doc(domainId)
      .collection("courseList")
      .doc(courseCode)
      .get();

    if (!courseSnap.exists) {
      throw new HttpsError("failed-precondition", "One or more courses are no longer available.", {
        code: "COURSE_NOT_FOUND",
      });
    }

    const data = courseSnap.data();
    if (data.status !== "published" && data.status !== "PUBLISHED") {
      throw new HttpsError("failed-precondition", "One or more courses are not available for purchase.", {
        code: "COURSE_NOT_PURCHASABLE",
      });
    }

    const price = Number(data.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw new HttpsError("failed-precondition", "One or more courses do not have a price configured.", {
        code: "COURSE_NO_PRICE",
      });
    }

    const originalPrice = Number(data.originalPrice);
    items.push({
      courseCode,
      domainId,
      title: data.title || courseCode,
      price: Math.max(0, price),
      originalPrice: Number.isFinite(originalPrice) && originalPrice > price ? originalPrice : null,
      image: data.image || null,
      duration: data.duration || "4 Hours",
    });
  }

  let promotion = null;
  if (couponCode && normaliseCode(couponCode)) {
    promotion = await findPromotionByCode(db, couponCode);
    if (!promotion) {
      throw new HttpsError("failed-precondition", "Invalid or expired coupon.", {
        code: "INVALID_COUPON",
      });
    }
  }

  const baseCalc = computeOrderAmounts(items, null);
  const eligibleAmount = baseCalc.eligibleAmount;

  if (promotion) {
    const perUserUsage = await db
      .collection("promotionUsage")
      .doc(`${promotion.id}_${uid}`)
      .get();
    const perUserUsedCount = perUserUsage.exists ? positiveNumber(perUserUsage.data().count) : 0;

    const err = promotionError(promotion, {
      eligibleAmount,
      usedCount: positiveNumber(promotion.usedCount),
      perUserUsedCount,
    });
    if (err) {
      throw new HttpsError("failed-precondition", err.message, { code: err.code });
    }
  }

  const calc = computeOrderAmounts(items, promotion);
  return { items, promotion, calc };
}

function summaryOf(calc) {
  return {
    subtotal: calc.subtotal,
    originalAmount: calc.originalAmount,
    courseDiscount: calc.courseDiscount,
    eligibleAmount: calc.eligibleAmount,
    promotionDiscount: calc.promotionDiscount,
    finalAmount: calc.finalAmount,
    currency: "INR",
  };
}

function itemSummaryOf(item) {
  return {
    courseCode: item.courseCode,
    domainId: item.domainId,
    title: item.title,
    price: item.price,
    originalPrice: item.originalPrice,
  };
}

/**
 * previewOrder - authoritative line-item preview WITHOUT creating a Razorpay order or any records.
 * Input: { items: [{ courseCode, domainId }], couponCode? }
 */
exports.previewOrder = onCall(
  {
    region: REGION,
    cors: ["http://localhost:5173"],
    secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
  },
  async (request) => {
  const uid = requireAuth(request);
  const { items, couponCode } = request.data || {};

  const db = getFirestore();
  const { items: resolvedItems, promotion, calc } = await resolveOrder(db, items, couponCode, uid);

  return {
    items: resolvedItems.map(itemSummaryOf),
    promotion: promotion ? describePromotion(promotion, calc) : null,
    summary: summaryOf(calc),
    userId: uid,
  };
});

/**
 * createPaymentOrder - validates cart + coupon server-side, creates a Razorpay order,
 * and stores a paymentOrders/ record BEFORE returning anything to the client.
 * Input: { items: [{ courseCode, domainId }], couponCode? }
 */
exports.createPaymentOrder = onCall(
  {
    region: REGION,
    cors: ["http://localhost:5173"],
    secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
  },
  async (request) => {
  const uid = requireAuth(request);
  const { items, couponCode } = request.data || {};

  const db = getFirestore();
  const { items: resolvedItems, promotion, calc } = await resolveOrder(db, items, couponCode, uid);

  const finalPaise = calc.amountsPaise.finalAmountPaise;
  if (finalPaise < MIN_PAYABLE_PAISE) {
    throw new HttpsError(
      "failed-precondition",
      "Order total must be at least ₹1.00 after discounts.",
      { code: "ORDER_TOTAL_TOO_LOW" }
    );
  }

  const internalOrderId = `ord_${crypto.randomUUID()}`;
  const orderRef = db.collection("paymentOrders").doc(internalOrderId);

  await orderRef.set({
    userId: uid,
    items: resolvedItems.map((it) => ({
      courseCode: it.courseCode,
      domainId: it.domainId,
      title: it.title,
      price: it.price,
      originalPrice: it.originalPrice,
      image: it.image,
      duration: it.duration,
    })),
    couponCode: promotion ? normaliseCode(promotion.code) : null,
    promotionId: promotion ? promotion.id : null,
    subtotal: calc.subtotal,
    courseDiscount: calc.courseDiscount,
    promotionDiscount: calc.promotionDiscount,
    finalAmount: calc.finalAmount,
    currency: "INR",
    status: "created",
    createdAt: FieldValue.serverTimestamp(),
  });

  let rzpOrder;
  try {
    const rzp = razorpayClient();
    rzpOrder = await rzp.orders.create({
      amount: finalPaise,
      currency: "INR",
      receipt: internalOrderId,
      notes: { userId: uid, internalOrderId },
    });
  } catch (cause) {
    console.error("Razorpay order creation failed:", cause);
    throw new HttpsError("internal", "Payment gateway error. Please try again.", {
      code: "RAZORPAY_ORDER_FAILED",
    });
  }

  await orderRef.update({
    razorpayOrderId: rzpOrder.id,
    razorpayStatus: rzpOrder.status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    internalOrderId,
    orderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: RAZORPAY_KEY_ID.value(),
    items: resolvedItems.map(itemSummaryOf),
    promotion: promotion ? describePromotion(promotion, calc) : null,
    summary: summaryOf(calc),
  };
});