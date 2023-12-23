const Joi = require("joi");

exports.createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

exports.updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string(),
});

exports.updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

exports.registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
