const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  profile_type: Joi.any().valid('personal', 'business').required(),
  phone: Joi.string().regex(/^\+[0-9]+$/),
  email: Joi.string().email()
});

module.exports = (input) => Joi.validate(input, schema);
