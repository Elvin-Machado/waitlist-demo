const { rupeesToPaise, paiseToRupees, positiveNumber } = require("./currency");

/**
 * Server-side promotion discount calculation.
 *
 * All money math happens in integer paise to avoid floating-point drift.
 *
 * Returns the promotion discount in paise (integer).
 *
 * Rule summary:
 *   - percentage: eligibleAmountPaise * pct / 100 (pct between 0 and 100)
 *   - fixed:      discountValue in paise
 *   - maximumDiscount (if > 0) caps the discount
 *   - the discount can never exceed the eligible amount
 */
function applyPromotionDiscount(promotion, eligibleAmountPaise) {
  if (!promotion || eligibleAmountPaise <= 0) return 0;

  const type = promotion.discountType;
  const discountValue = Number(promotion.discountValue);
  let discountPaise = 0;

  if (type === "percentage") {
    if (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 100) {
      return 0;
    }
    discountPaise = Math.round((eligibleAmountPaise * discountValue) / 100);
  } else if (type === "fixed") {
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      return 0;
    }
    discountPaise = rupeesToPaise(discountValue);
  } else {
    return 0;
  }

  const maximumDiscount = Number(promotion.maximumDiscount || 0);
  if (Number.isFinite(maximumDiscount) && maximumDiscount > 0) {
    const maximumDiscountPaise = rupeesToPaise(maximumDiscount);
    discountPaise = Math.min(discountPaise, maximumDiscountPaise);
  }

  return Math.min(discountPaise, eligibleAmountPaise);
}

/** The same as applyPromotionDiscount but ignoring the maximumDiscount cap (used for UI messaging). */
function uncappedPromotionDiscount(promotion, eligibleAmountPaise) {
  if (!promotion || eligibleAmountPaise <= 0) return 0;

  const type = promotion.discountType;
  const discountValue = Number(promotion.discountValue);
  let discountPaise = 0;

  if (type === "percentage") {
    if (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 100) return 0;
    discountPaise = Math.round((eligibleAmountPaise * discountValue) / 100);
  } else if (type === "fixed") {
    if (!Number.isFinite(discountValue) || discountValue <= 0) return 0;
    discountPaise = rupeesToPaise(discountValue);
  }

  return Math.min(discountPaise, eligibleAmountPaise);
}

/**
 * Computes authoritative money values for an order.
 *
 * items: [{ price, originalPrice? }]
 * price          - actual payable price (INR)            -> subtotal
 * originalPrice  - optional MRP used only for display    -> courseDiscount
 *
 * Returns rupee values (numbers) plus an internal paise breakdown.
 */
function computeOrderAmounts(items, promotion) {
  let subtotalPaise = 0;
  let courseDiscountPaise = 0;

  for (const item of items || []) {
    const price = positiveNumber(item.price);
    subtotalPaise += rupeesToPaise(price);

    const originalPrice = Number(item.originalPrice);
    if (Number.isFinite(originalPrice) && originalPrice > price) {
      courseDiscountPaise += rupeesToPaise(originalPrice) - rupeesToPaise(price);
    }
  }

  courseDiscountPaise = Math.max(0, courseDiscountPaise);
  const eligibleAmountPaise = subtotalPaise;
  const promotionDiscountPaise = promotion
    ? applyPromotionDiscount(promotion, eligibleAmountPaise)
    : 0;
  const finalAmountPaise = eligibleAmountPaise - promotionDiscountPaise;

  return {
    subtotal: paiseToRupees(subtotalPaise),
    originalAmount: paiseToRupees(subtotalPaise + courseDiscountPaise),
    courseDiscount: paiseToRupees(courseDiscountPaise),
    eligibleAmount: paiseToRupees(eligibleAmountPaise),
    promotionDiscount: paiseToRupees(promotionDiscountPaise),
    finalAmount: paiseToRupees(finalAmountPaise),
    currency: "INR",
    amountsPaise: {
      subtotalPaise,
      courseDiscountPaise,
      eligibleAmountPaise,
      promotionDiscountPaise,
      finalAmountPaise,
    },
  };
}

module.exports = {
  applyPromotionDiscount,
  uncappedPromotionDiscount,
  computeOrderAmounts,
};