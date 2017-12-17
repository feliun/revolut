const debug = require('debug')('revolut:payments:validation');
const { types } = require('require-all')(__dirname);

const isRevolut = ({ source_account_id, target_account_id }) => !!(source_account_id && target_account_id);

const validate = (validator, payment) => {
  const { error, value } = validator(payment);
  if (error) throw new Error(error);
  return value;
};

module.exports = (payment) => {
  if (isRevolut(payment)) {
    debug('Validating a revolut transfer');
    return validate(types.transfer, payment);
  }
  return validate(types.payment, payment);
};
