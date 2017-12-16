const debug = require('debug')('revolut:counterparties:validation');
const { types } = require('require-all')(__dirname);

const isRevolut = (user) => user && user.profile_type;

const validate = (validator, counterparty) => {
  const { error, value } = validator(counterparty);
  if (error) throw new Error(error);
  return value;
};

module.exports = (counterparty) => {
  if (isRevolut(counterparty)) {
    debug('Validating a revolut account');
    return validate(types.revolut, counterparty);
  }
  const validatorByCurrency = {
    GBP: types.bank_account.uk,
    USD: types.bank_account.us,
    EUR: types.bank_account.eu,
    other: types.bank_account.other
  };

  const { currency } = counterparty;

  debug(`Validating a ${currency} account`);

  const validator = validatorByCurrency[currency] || validatorByCurrency.other;
  return validate(validator, counterparty);
};
