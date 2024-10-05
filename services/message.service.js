import databaseModel from "../models/index.js";
import { Op } from "sequelize";

export const createdMessage = async (data) => {
  try {
    const newMessage = await databaseModel.Message.create(data);
    if (!newMessage) {
      throw sendResponse(400, false, "Oops... somethings went wrong");
    }

    return newMessage;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

export const populateMessage = async (id) => {
  try {
    const msgs = await databaseModel.Message.findByPk(id);
    if (!msgs) {
      throw sendResponse(404, false, "Oops... somethings went wrong");
    }
    return msgs;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

export const getConversationMessages = async (conversationId) => {
  try {
    const messages = await databaseModel.Message.findAll({
      where: { conversationId },
    });
    console.log("messages", messages);
    return messages;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};
