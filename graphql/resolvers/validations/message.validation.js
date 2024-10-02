import Joi from "joi";

export const messageCreateSchema = Joi.object({
  conversationId: Joi.number().required().label("conversationId"),
  message: Joi.string().required().label("message"),
  files: Joi.string().optional().label("files"),
  isActive: Joi.boolean().optional().label("isActive"),
});

export const messageUpdateSchema = Joi.object({
  id: Joi.number().required().label("id"),
  message: Joi.string().optional().label("message"),
  files: Joi.string().optional().label("files"),
  isActive: Joi.boolean().optional().label("isActive"),
});

export const messageDeleteSchema = Joi.object({
  id: Joi.number().required().label("id"),
});
