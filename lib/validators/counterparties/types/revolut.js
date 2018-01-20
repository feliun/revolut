const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  profile_type: Joi.any().valid('personal', 'business').required(),
  phone: Joi.string().regex(/^\+[0-9]+$/),
  email: Joi.string().email(),
  company_name: Joi.string(),
  individual_name: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
  })
});

module.exports = (input) => Joi.validate(input, schema);
