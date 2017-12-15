const { types } = require('require-all')(__dirname);

const isRevolut = (user) => user && user.profile_type;

const validate = (validator, counterparty) => {
  const { error, value } = validator(counterparty);
  if (error) throw new Error(error);
  return value;
};

module.exports = (counterparty) => {
  if (isRevolut(counterparty)) return validate(types.revolut, counterparty);
  throw new Error('Fill me in!');
};
