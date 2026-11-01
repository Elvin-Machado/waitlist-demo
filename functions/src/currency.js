const PAISE_PER_RUPEE = 100;

function rupeesToPaise(rupees) {
  const value = Number(rupees);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * PAISE_PER_RUPEE);
}

function paiseToRupees(paise) {
  const value = Number(paise);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value) / PAISE_PER_RUPEE;
}

function positiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, num) : 0;
}

module.exports = {
  PAISE_PER_RUPEE,
  rupeesToPaise,
  paiseToRupees,
  positiveNumber,
};