import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().max(80).required().label("Name"),
  email: Joi.string()
    .max(50)
    .email({ minDomainSegments: 2 })
    .required()
    .label("Email"),
  picture: Joi.string().optional().label("Picture"),
  status: Joi.string().optional().label("Status"),
  password: Joi.string().min(5).required().label("Password"),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  isActive: Joi.boolean().optional().label("isActive"),
});

export const signinSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().label("Email"),
  password: Joi.string().min(5).required(),
});
