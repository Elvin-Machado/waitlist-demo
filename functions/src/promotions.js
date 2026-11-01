const { positiveNumber } = require("./currency");
const { applyPromotionDiscount, uncappedPromotionDiscount } = require("./pricing");

function normaliseCode(code) {
  return String(code || "").trim().toUpperCase().replace(/\s+/g, "");
}

function toTime(value) {
  if (!value) return null;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function formatINR(value) {
  return new Intl.NumberFormat("en-IN").format(positiveNumber(value));
}

async function findPromotionByCode(db, code) {
  const norm = normaliseCode(code);
  if (!norm) return null;
  const snapshot = await db.collection("promotions").where("code", "==", norm).limit(1).get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

/**
 * Validates a promotion against every rule.
 *
 * Returns null when valid, otherwise { code, message }.
 *
 * Server time is authoritative (Date.now()).
 */
function promotionError(promotion, options = {}) {
  const {
    eligibleAmount,
    usedCount = 0,
    perUserUsedCount = 0,
    now = Date.now(),
    productType = "courses",
  } = options;

  if (!promotion) {
    return { code: "INVALID_COUPON", message: "Invalid or expired coupon." };
  }
  if (promotion.status !== "active") {
    return { code: "COUPON_INACTIVE", message: "Invalid or expired coupon." };
  }

  const start = toTime(promotion.startDate);
  if (start && now < start) {
    return { code: "COUPON_NOT_STARTED", message: "This coupon is not yet active." };
  }
  const end = toTime(promotion.endDate);
  if (end && now > end) {
    return { code: "COUPON_EXPIRED", message: "This coupon has expired." };
  }

  const usageLimit = positiveNumber(promotion.usageLimit);
  const usedCountNum = positiveNumber(usedCount);
  if (usageLimit > 0 && usedCountNum >= usageLimit) {
    return { code: "COUPON_USAGE_LIMIT", message: "This coupon has reached its usage limit." };
  }

  const perUserLimit = positiveNumber(promotion.perUserLimit || 1);
  if (perUserLimit > 0 && perUserUsedCount >= perUserLimit) {
    return { code: "COUPON_PER_USER_LIMIT", message: "You have already used this coupon." };
  }

  const applicableTo = promotion.applicableTo || "all";
  if (applicableTo !== "all" && applicableTo !== productType) {
    return { code: "COUPON_WRONG_PRODUCT", message: "This coupon does not apply to the selected product." };
  }

  const minimumPurchase = positiveNumber(promotion.minimumPurchase);
  if (minimumPurchase > 0 && positiveNumber(eligibleAmount) < minimumPurchase) {
    return {
      code: "COUPON_MIN_PURCHASE",
      message: `Minimum purchase of ₹${formatINR(minimumPurchase)} required.`,
    };
  }

  const discountType = promotion.discountType;
  const discountValue = Number(promotion.discountValue);
  if (discountType !== "percentage" && discountType !== "fixed") {
    return { code: "COUPON_INVALID", message: "Invalid or expired coupon." };
  }
  if (discountType === "percentage" && (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 100)) {
    return { code: "COUPON_INVALID", message: "Invalid or expired coupon." };
  }
  if (discountType === "fixed" && (!Number.isFinite(discountValue) || discountValue <= 0)) {
    return { code: "COUPON_INVALID", message: "Invalid or expired coupon." };
  }

  return null;
}

/**
 * A display-facing summary of the promotion (never used for pricing authority).
 */
function describePromotion(promotion, calc) {
  if (!promotion) return null;
  const eligiblePaise = calc.amountsPaise.eligibleAmountPaise;
  const uncappedPaise = uncappedPromotionDiscount(promotion, eligiblePaise);
  const actualPaise = applyPromotionDiscount(promotion, eligiblePaise);

  return {
    code: normaliseCode(promotion.code),
    discountType: promotion.discountType,
    discountValue: Number(promotion.discountValue),
    maximumDiscount: positiveNumber(promotion.maximumDiscount),
    minimumPurchase: positiveNumber(promotion.minimumPurchase),
    usageLimit: positiveNumber(promotion.usageLimit),
    usedCount: positiveNumber(promotion.usedCount),
    perUserLimit: positiveNumber(promotion.perUserLimit || 1),
    discount: calc.promotionDiscount,
    discountCapped: actualPaise < uncappedPaise,
  };
}

module.exports = {
  normaliseCode,
  findPromotionByCode,
  promotionError,
  describePromotion,
  formatINR,
};