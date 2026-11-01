const admin = require("firebase-admin");

admin.initializeApp();

module.exports = Object.assign(
  {},
  require("./src/orders"),
  require("./src/verify"),
  require("./src/refunds")
);