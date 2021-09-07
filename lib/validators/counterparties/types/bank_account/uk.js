const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  country: Joi.string().required(),
  bank_country: Joi.string().required(),
  currency: Joi.any().valid('GBP').required(),
  account_no: Joi.string().required(),
  sort_code: Joi.string().required(),
  email: Joi.string().email(),
  company_name: Joi.string(),
  individual_name: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
  }),
  address: Joi.object().keys({
    street_line1: Joi.string(),
    street_line2: Joi.string(),
    region: Joi.string(),
    postcode: Joi.string(),
    city: Joi.string(),
    country: Joi.string()
  })
});

module.exports = (input) => schema.validate(input);
