const { types } = require('require-all')(__dirname);

const isRevolut = (user) => user && user.profile_type;

const validate = (validator, counterparty) => {
  const { error, value } = validator(counterparty);
  if (error) throw new Error(error);
  return value;
};

module.exports = (counterparty) => {
  if (isRevolut(counterparty)) return validate(types.revolut, counterparty);
  const validatorByCurrency = {
    GBP: types.bank_account.uk,
    USD: types.bank_account.us,
    EUR: types.bank_account.eu,
    default: types.bank_account.other
  };

  const validator = validatorByCurrency[counterparty.currency] || validatorByCurrency.default;
  return validate(validator, counterparty);
};
