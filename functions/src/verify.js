const crypto = require("crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

const { REGION, RAZORPAY_KEY_SECRET } = require("./config");
const { finalizePaidOrder } = require("./complete");

function verifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const keySecret = RAZORPAY_KEY_SECRET.value();
  if (!keySecret) {
    throw new HttpsError("failed-precondition", "Payment verification is not configured on the server.", {
      code: "PAYMENT_GATEWAY_NOT_CONFIGURED",
    });
  }
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new HttpsError("invalid-argument", "Missing payment verification details.", {
      code: "MISSING_VERIFICATION_DATA",
    });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    throw new HttpsError(
      "failed-precondition",
      "Payment signature verification failed.",
      { code: "PAYMENT_SIGNATURE_MISMATCH" }
    );
  }
}

/**
 * verifyPayment - server-side Razorpay signature verification + trusted record creation.
 * Input: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * A success callback from the browser is NEVER trusted. Enrollment, coupon usage and
 * invoice generation only happen here, inside an idempotent Firestore transaction.
 */
exports.verifyPayment = onCall(
  { region: REGION, secrets: [RAZORPAY_KEY_SECRET] },
  async (request) => {
  const uid = request.auth ? request.auth.uid : null;
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in to continue.", {
      code: "UNAUTHENTICATED",
    });
  }

  const data = request.data || {};
  const razorpayOrderId = String(data.razorpay_order_id || "").trim();
  const razorpayPaymentId = String(data.razorpay_payment_id || "").trim();
  const razorpaySignature = String(data.razorpay_signature || "").trim();

  verifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

  const db = getFirestore();
  const orderSnap = await db
    .collection("paymentOrders")
    .where("razorpayOrderId", "==", razorpayOrderId)
    .limit(1)
    .get();

  if (orderSnap.empty) {
    throw new HttpsError("not-found", "Order not found.", { code: "ORDER_NOT_FOUND" });
  }

  const orderId = orderSnap.docs[0].id;
  return finalizePaidOrder({ orderId, razorpayOrderId, razorpayPaymentId, uid });
});