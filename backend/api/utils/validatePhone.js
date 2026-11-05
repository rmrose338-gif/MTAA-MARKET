const { normalizeKenyanPhone } = require("./phone");

function validatePhone(value) {
  return normalizeKenyanPhone(value);
}

module.exports = { validatePhone };
