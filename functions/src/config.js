const { defineSecret } = require("firebase-functions/params");

const REGION = process.env.FUNCTIONS_REGION || "asia-south1";

const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

const MIN_PAYABLE_PAISE = 100;

module.exports = {
  REGION,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  MIN_PAYABLE_PAISE,
};