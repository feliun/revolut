const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  country: Joi.string().required(),
  currency: Joi.any().valid('EUR').required(),
  iban: Joi.string(),
  account_no: Joi.string(),
  bic: Joi.string().required(),
  email: Joi.string().email(),
  address: Joi.object().keys({
    street_line1: Joi.string(),
    street_line2: Joi.string(),
    region: Joi.string(),
    postcode: Joi.string(),
    city: Joi.string(),
    country: Joi.string()
  })
});

module.exports = (input) => Joi.validate(input, schema);

