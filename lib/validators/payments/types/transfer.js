const Joi = require('joi');

const schema = Joi.object().keys({
  request_id: Joi.string().required(),
  source_account_id: Joi.string().required(),
  target_account_id: Joi.string().required(),
  amount: Joi.number().precision(6).required(),
  currency: Joi.string().regex(/^[A-Z]{3}$/).required(),
  reference: Joi.string(),
});

module.exports = (input) => Joi.validate(input, schema);
