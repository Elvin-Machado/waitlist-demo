const { test } = require("node:test");
const assert = require("node:assert/strict");

const { applyPromotionDiscount, uncappedPromotionDiscount, computeOrderAmounts } = require("../src/pricing");
const { promotionError, normaliseCode, describePromotion } = require("../src/promotions");
const { rupeesToPaise, paiseToRupees } = require("../src/currency");

const now = new Date("2026-01-15T12:00:00Z").getTime();
const basePromotion = {
  status: "active",
  discountType: "percentage",
  discountValue: 20,
  applicableTo: "all",
  minimumPurchase: 0,
  maximumDiscount: 0,
  usageLimit: 0,
  usedCount: 0,
  perUserLimit: 1,
  startDate: null,
  endDate: null,
};

test("money conversion uses integer paise", () => {
  assert.equal(rupeesToPaise(2000), 200000);
  assert.equal(rupeesToPaise(0.01), 1);
  assert.equal(paiseToRupees(160000), 1600);
  assert.equal(paiseToRupees(1), 0.01);
});

test("no coupon applies zero discount", () => {
  assert.equal(applyPromotionDiscount(null, 200000), 0);
  const calc = computeOrderAmounts([{ price: 2000 }], null);
  assert.equal(calc.promotionDiscount, 0);
  assert.equal(calc.finalAmount, 2000);
});

test("20% percentage discount on ₹2,000 computes ₹400 discount (paise math)", () => {
  const promo = { ...basePromotion };
  const calc = computeOrderAmounts([{ price: 2000 }], promo);
  assert.equal(calc.eligibleAmount, 2000);
  assert.equal(calc.promotionDiscount, 400);
  assert.equal(calc.finalAmount, 1600);
  assert.equal(calc.amountsPaise.finalAmountPaise, 160000);
});

test("fixed ₹500 coupon", () => {
  const promo = { ...basePromotion, discountType: "fixed", discountValue: 500 };
  const calc = computeOrderAmounts([{ price: 2000 }], promo);
  assert.equal(calc.promotionDiscount, 500);
  assert.equal(calc.finalAmount, 1500);
});

test("maximum discount cap is respected", () => {
  const promo = { ...basePromotion, discountValue: 20, maximumDiscount: 500 };
  const calc = computeOrderAmounts([{ price: 3000 }], promo);
  assert.equal(calc.promotionDiscount, 500);
  assert.equal(calc.finalAmount, 2500);
  assert.equal(uncappedPromotionDiscount(promo, rupeesToPaise(3000)), 60000);
});

test("course discount comes from originalPrice vs price; discount applies to payable subtotal", () => {
  const promo = { ...basePromotion, discountValue: 20, maximumDiscount: 500 };
  const calc = computeOrderAmounts([{ price: 2000, originalPrice: 2500 }], promo);
  assert.equal(calc.subtotal, 2000);
  assert.equal(calc.originalAmount, 2500);
  assert.equal(calc.courseDiscount, 500);
  assert.equal(calc.promotionDiscount, 400);
  assert.equal(calc.finalAmount, 1600);
});

test("invalid or expired coupon", () => {
  assert.equal(promotionError(null, { eligibleAmount: 1000, now }).code, "INVALID_COUPON");
  const paused = { ...basePromotion, status: "paused" };
  assert.equal(promotionError(paused, { eligibleAmount: 1000, now }).code, "COUPON_INACTIVE");
});

test("expired coupon", () => {
  const promo = { ...basePromotion, endDate: new Date("2026-01-01T00:00:00Z") };
  assert.equal(promotionError(promo, { eligibleAmount: 1000, now }).code, "COUPON_EXPIRED");
});

test("coupon before start date", () => {
  const promo = { ...basePromotion, startDate: new Date("2026-02-01T00:00:00Z") };
  assert.equal(promotionError(promo, { eligibleAmount: 1000, now }).code, "COUPON_NOT_STARTED");
});

test("minimum purchase failure", () => {
  const promo = { ...basePromotion, minimumPurchase: 1000 };
  assert.equal(promotionError(promo, { eligibleAmount: 500, now }).code, "COUPON_MIN_PURCHASE");
  assert.equal(promotionError(promo, { eligibleAmount: 1000, now }), null);
});

test("usage limit reached", () => {
  const promo = { ...basePromotion, usageLimit: 100, usedCount: 100 };
  assert.equal(
    promotionError(promo, { eligibleAmount: 2000, now, usedCount: 100 }).code,
    "COUPON_USAGE_LIMIT"
  );
  const promoEdge = { ...basePromotion, usageLimit: 100, usedCount: 99 };
  assert.equal(promotionError(promoEdge, { eligibleAmount: 2000, now, usedCount: 99 }), null);
});

test("global usage limit: promotion below the limit is allowed", () => {
  const promo = { ...basePromotion, code: "DIWALI26", usageLimit: 500, usedCount: 400 };
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now, usedCount: 400 }), null);
});

test("global usage limit: promotion at the limit is rejected", () => {
  const promo = { ...basePromotion, code: "DIWALI26", usageLimit: 500, usedCount: 500 };
  assert.equal(
    promotionError(promo, { eligibleAmount: 2000, now, usedCount: 500 }).code,
    "COUPON_USAGE_LIMIT"
  );
});

test("global usage limit: one below the limit allows exactly one more redemption", () => {
  const promo = { ...basePromotion, code: "DIWALI26", usageLimit: 500, usedCount: 499 };
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now, usedCount: 499 }), null);
  assert.equal(
    promotionError(promo, { eligibleAmount: 2000, now, usedCount: 500 }).code,
    "COUPON_USAGE_LIMIT"
  );
});

test("global usage limit: usageLimit of 0 means unlimited", () => {
  const promo = { ...basePromotion, usageLimit: 0, usedCount: 9999 };
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now, usedCount: 9999 }), null);
});

test("global usage limit: legacy promotion without usedCount field defaults to 0", () => {
  const promo = { ...basePromotion, usageLimit: 500 };
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now, usedCount: 0 }), null);
  assert.equal(
    promotionError(promo, { eligibleAmount: 2000, now, usedCount: 500 }).code,
    "COUPON_USAGE_LIMIT"
  );
});

test("per-user limit reached", () => {
  const promo = { ...basePromotion, perUserLimit: 1 };
  assert.equal(
    promotionError(promo, { eligibleAmount: 2000, now, perUserUsedCount: 1 }).code,
    "COUPON_PER_USER_LIMIT"
  );
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now, perUserUsedCount: 0 }), null);
});

test("invalid discount values are rejected", () => {
  assert.equal(
    promotionError({ ...basePromotion, discountValue: 0 }, { eligibleAmount: 1000, now }).code,
    "COUPON_INVALID"
  );
  assert.equal(
    promotionError({ ...basePromotion, discountValue: 120 }, { eligibleAmount: 1000, now }).code,
    "COUPON_INVALID"
  );
  assert.equal(
    promotionError({ ...basePromotion, discountType: "free" }, { eligibleAmount: 1000, now }).code,
    "COUPON_INVALID"
  );
  assert.equal(
    promotionError({ ...basePromotion, discountType: "fixed", discountValue: 0 }, { eligibleAmount: 1000, now }).code,
    "COUPON_INVALID"
  );
});

test("product applicability (courses)", () => {
  const promo = { ...basePromotion, applicableTo: "mentorship" };
  assert.equal(promotionError(promo, { eligibleAmount: 2000, now }).code, "COUPON_WRONG_PRODUCT");
  const all = { ...basePromotion, applicableTo: "all" };
  assert.equal(promotionError(all, { eligibleAmount: 2000, now }), null);
  const courses = { ...basePromotion, applicableTo: "courses" };
  assert.equal(promotionError(courses, { eligibleAmount: 2000, now }), null);
});

test("code normalisation collapses whitespace + upper cases", () => {
  assert.equal(normaliseCode("  diwali 26 "), "DIWALI26");
});

test("usage fields stay numeric integers (never strings)", () => {
  const promo = { ...basePromotion, code: "DIWALI26", usageLimit: 500, usedCount: 12, perUserLimit: 1 };
  const calc = computeOrderAmounts([{ price: 2000 }], promo);
  const summary = describePromotion(promo, calc);
  assert.equal(typeof summary.usageLimit, "number");
  assert.equal(typeof summary.usedCount, "number");
  assert.equal(typeof summary.perUserLimit, "number");
  assert.equal(Number.isInteger(summary.usageLimit), true);
  assert.equal(Number.isInteger(summary.usedCount), true);
  assert.equal(summary.usageLimit, 500);
  assert.equal(summary.usedCount, 12);
});

test("example scenario: ₹2,000 course, DIWALI26 20% capped at ₹500", () => {
  const promo = {
    ...basePromotion,
    code: "DIWALI26",
    discountValue: 20,
    maximumDiscount: 500,
  };
  const calc = computeOrderAmounts([{ price: 2000, originalPrice: 2500 }], promo);
  assert.equal(calc.originalAmount, 2500);
  assert.equal(calc.courseDiscount, 500);
  assert.equal(calc.promotionDiscount, 400);
  assert.equal(calc.finalAmount, 1600);
  assert.equal(calc.amountsPaise.finalAmountPaise, 160000);
  assert.equal(promotionError(promo, { eligibleAmount: calc.eligibleAmount, now }), null);
});