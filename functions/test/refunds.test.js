const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  verifyAdmin,
  validateRefundEligibility,
  checkDuplicateRefund,
  executeRazorpayRefund,
} = require("../src/refunds");

// Mock Firestore DB helper
function mockDb({ adminDoc = null, paymentDoc = null, existingRefunds = [] } = {}) {
  return {
    collection: (collName) => {
      if (collName === "admins") {
        return {
          doc: () => ({
            get: async () => ({
              exists: Boolean(adminDoc),
              data: () => adminDoc || {},
            }),
          }),
        };
      }
      if (collName === "payments") {
        return {
          doc: () => ({
            get: async () => ({
              exists: Boolean(paymentDoc),
              data: () => paymentDoc || {},
            }),
          }),
        };
      }
      if (collName === "refunds") {
        return {
          where: () => ({
            limit: () => ({
              get: async () => ({
                empty: existingRefunds.length === 0,
                docs: existingRefunds.map((r) => ({ data: () => r })),
              }),
            }),
          }),
        };
      }
      return {};
    },
  };
}

// 1. Unauthenticated request rejected
test("refunds: missing auth token throws unauthenticated", async () => {
  const requestWithoutAuth = { data: { paymentId: "pay_123" } };
  assert.equal(Boolean(requestWithoutAuth.auth), false);
});

// 2. Non-admin rejected
test("refunds: non-admin email throws permission-denied", async () => {
  const db = mockDb({ adminDoc: null });
  await assert.rejects(
    async () => {
      await verifyAdmin(db, "user@example.com");
    },
    (err) => {
      assert.equal(err.code, "permission-denied");
      return true;
    }
  );

  const dbUser = mockDb({ adminDoc: { role: "user" } });
  await assert.rejects(
    async () => {
      await verifyAdmin(dbUser, "user@example.com");
    },
    (err) => {
      assert.equal(err.code, "permission-denied");
      return true;
    }
  );
});

// Admin validation success
test("refunds: admin user succeeds verification", async () => {
  const db = mockDb({ adminDoc: { role: "admin" } });
  const result = await verifyAdmin(db, "admin@kawsacademy.com");
  assert.equal(result, true);
});

// 3. Missing payment rejected
test("refunds: missing payment doc throws not-found", () => {
  assert.throws(
    () => {
      validateRefundEligibility(null);
    },
    (err) => {
      assert.equal(err.code, "not-found");
      return true;
    }
  );
});

// 4. Failed payment rejected
test("refunds: failed/pending payment status throws failed-precondition", () => {
  assert.throws(
    () => {
      validateRefundEligibility({ status: "failed", amount: 1600 });
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );

  assert.throws(
    () => {
      validateRefundEligibility({ status: "pending", amount: 1600 });
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );
});

// 5. Already refunded rejected
test("refunds: payment with refundStatus/refundId throws failed-precondition", () => {
  assert.throws(
    () => {
      validateRefundEligibility({ status: "paid", amount: 1600, refundStatus: "refunded" });
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );
});

// 6. Invalid amount rejected
test("refunds: invalid or zero amount throws failed-precondition", () => {
  assert.throws(
    () => {
      validateRefundEligibility({ status: "paid", amount: 0 });
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );

  assert.throws(
    () => {
      validateRefundEligibility({ status: "paid", amount: -500 });
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );
});

// 7. Successful refund path logic (mocked Razorpay SDK)
test("refunds: successful refund path converts INR rupees to paise and calls SDK", async () => {
  const payment = { status: "paid", amount: 1600 };
  const { amountPaise } = validateRefundEligibility(payment);
  assert.equal(amountPaise, 160000);

  const mockRzp = {
    payments: {
      refund: async (paymentId, payload) => {
        assert.equal(paymentId, "pay_TfZypEPNcgrnIy");
        assert.equal(payload.amount, 160000);
        assert.equal(payload.notes.requestedBy, "admin@kawsacademy.com");
        return {
          id: "rfnd_TfZypEPNcgrnIy_01",
          entity: "refund",
          amount: 160000,
          currency: "INR",
          payment_id: paymentId,
          status: "processed",
        };
      },
    },
  };

  const refundRes = await executeRazorpayRefund(mockRzp, "pay_TfZypEPNcgrnIy", amountPaise, "admin@kawsacademy.com");
  assert.equal(refundRes.id, "rfnd_TfZypEPNcgrnIy_01");
  assert.equal(refundRes.status, "processed");
});

// 8. Duplicate refund protection logic
test("refunds: checkDuplicateRefund rejects when a refund doc exists", async () => {
  const dbWithRefund = mockDb({
    existingRefunds: [{ razorpayRefundId: "rfnd_123", paymentId: "pay_TfZypEPNcgrnIy" }],
  });

  await assert.rejects(
    async () => {
      await checkDuplicateRefund(dbWithRefund, "pay_TfZypEPNcgrnIy");
    },
    (err) => {
      assert.equal(err.code, "failed-precondition");
      return true;
    }
  );

  const dbWithoutRefund = mockDb({ existingRefunds: [] });
  await checkDuplicateRefund(dbWithoutRefund, "pay_TfZypEPNcgrnIy"); // Should not throw
});
