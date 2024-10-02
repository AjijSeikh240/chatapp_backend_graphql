import databaseModel from "../models/index.js";
import { Op } from "sequelize";
import createHttpError from "http-errors";
import { sendResponse } from "../utils/response.send.util.js";

// export const doesConversationExist = async (senderId, receiverId) => {
//   try {
//     const convos = await databaseModel.Conversation.findAll({
//       where: {
//         [Op.or]: [
//           { [Op.and]: [{ senderId: senderId }, { receiverId: receiverId }] },
//           { [Op.and]: [{ senderId: receiverId }, { receiverId: senderId }] },
//         ],
//       },
//     });
//     return convos;
//   } catch (error) {
//     console.log("Occurred server error", error.message);
//     throw sendResponse(500, false, error.message);
//   }
// };

// create conversation
// export const createConversation = async (data) => {

//   const newConvo = await databaseModel.Conversation.create(data);

//   return newConvo;
// };

// export const populatedConversation = async (id) => {
//   const populateConve = await databaseModel.Conversation.findByPk(id);

//   return populateConve;
// };

// getUserConversations
// export const getUserConversations = async (user_id) => {
//   const conversations = await databaseModel.Conversation.findAll({
//     where: { [Op.or]: [{ senderId: user_id }, { receiverId: user_id }] },
//   });

//   return conversations;
// };

// export const updateLatestMessage = async (conversationId, latestMessageId) => {
//   const updatedConversation = await databaseModel.Conversation.update(
//     { latestMessageId: latestMessageId },
//     { where: { id: conversationId } }
//   );
//   ///  checking pending
//   if (updatedConversation[0] == 0)
//     throw createHttpError.BadRequest(
//       "update latest message not updated in conversation"
//     );
//   // console.log("updatedConversation", updatedConversation);
//   return updatedConversation;
// };

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
      where: conversationId,
    });

    return messages;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};
