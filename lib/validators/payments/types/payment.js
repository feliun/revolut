const Joi = require('joi');

const schema = Joi.object().keys({
  request_id: Joi.string().required(),
  account_id: Joi.string().required(),
  receiver: Joi.object().keys({
    counterparty_id: Joi.string().required(),
    account_id: Joi.string(),
  }),
  amount: Joi.number().precision(6).required(),
  currency: Joi.string().regex(/^[A-Z]{3}$/).required(),
  description: Joi.string(),
});

module.exports = (input) => Joi.validate(input, schema);
