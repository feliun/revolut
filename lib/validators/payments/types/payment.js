const Joi = require('joi');

const schema = Joi.object().keys({
  request_id: Joi.string().required(),
  account_id: Joi.string().required(),
  receiver: Joi.object().keys({
    counterparty_id: Joi.string().required(),
    account_id: Joi.string(),
  }),
  schedule_for: Joi.date(),
  amount: Joi.number().precision(6).required(),
  currency: Joi.string().regex(/^[A-Z]{3}$/).required(),
  reference: Joi.string(),
});

module.exports = (input) => Joi.validate(input, schema);
