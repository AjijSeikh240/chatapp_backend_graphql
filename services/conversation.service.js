import { Op } from "sequelize";
import databaseModel from "../models/index.js";
import { sendResponse } from "../utils/response.send.util.js";

export const doesConversationExist = async (senderId, receiverId) => {
  try {
    const convos = await databaseModel.Conversation.findAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ senderId: senderId }, { receiverId: receiverId }] },
          { [Op.and]: [{ senderId: receiverId }, { receiverId: senderId }] },
        ],
      },
    });

    return convos;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

// create conversation
export const createConversation = async (data) => {
  try {
    const newConvo = await databaseModel.Conversation.create(data);
    if (newConvo) {
      throw sendResponse(400, false, "Oops... somethings went wrong");
    }
    return newConvo;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

export const populatedConversation = async (id) => {
  try {
    const populateConve = await databaseModel.Conversation.findByPk(id);

    return populateConve;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

// getUserConversations
export const getUserConversations = async (user_id) => {
  try {
    const conversations = await databaseModel.Conversation.findAll({
      where: { [Op.or]: [{ senderId: user_id }, { receiverId: user_id }] },
    });

    return conversations;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

export const updateLatestMessage = async (conversationId, latestMessageId) => {
  try {
    const updatedConversation = await databaseModel.Conversation.update(
      { latestMessageId: latestMessageId },
      { where: { id: conversationId } }
    );

    if (updatedConversation[0] == 0) {
      throw sendResponse(404, false, "Unable to update latest message");
    }

    return updatedConversation;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};
