import Joi from "joi";

export const conversationCreateSchema = Joi.object({
  receiverId: Joi.number().required().label("receiverId"),
  name: Joi.string().max(50).optional().label("name"),
  picture: Joi.string().optional().label("files"),
  isActive: Joi.boolean().optional().label("picture"),
});

export const conversationUpdateSchema = Joi.object({
  id: Joi.number().required().label("id"),
  name: Joi.string().optional().label("name"),
  picture: Joi.string().optional().label("picture"),
  isActive: Joi.boolean().optional().label("isActive"),
});

export const conversationDeleteSchema = Joi.object({
  id: Joi.number().required().label("id"),
});

export const conversationGetSchema = Joi.object({
  conversationId: Joi.number().required().label("conversationId"),
});
