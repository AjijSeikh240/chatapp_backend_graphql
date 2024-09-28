import databaseModel from "../models/index.js";
import { Op, where } from "sequelize";
import createHttpError from "http-errors";
import validator from "validator";

export const doesConversationExist = async (senderId, receiverId, isGroup) => {
  if (isGroup === false) {
    let convos = await databaseModel.Conversation.findAll({
      where: {
        isGroup: false,
        [Op.or]: [
          { [Op.and]: [{ senderId: senderId }, { receiverId: receiverId }] },
          { [Op.]: [{ senderId: receiverId }, { receiverId: senderId }] },
        ],
        // senderId: senderId,
        // receiverId: receiverId,'
      },
    });
    console.log("convos////////////", convos);
    return convos;
  } else {
    // it's a group chat
    let convo = databaseModel.Conversation.findAll({
      where: { isGroup: true },
    });
    return convo;
  }
};

// create conversation
export const createConversation = async (data) => {
  const newConvo = await databaseModel.Conversation.create(data);

  return newConvo;
};

export const populatedConversation = async (id) => {
  const populateConve = await databaseModel.Conversation.findByPk(id);

  return populateConve;
};

// getUserConversations
export const getUserConversations = async (user_id) => {
  const conversations = await databaseModel.Conversation.findAll({
    where: { [Op.or]: [{ senderId: user_id }, { receiverId: user_id }] },
  });

  return conversations;
};

export const updateLatestMessage = async (conversationId, latestMessageId) => {
  const updatedConversation = await databaseModel.Conversation.update(
    { latestMessageId: latestMessageId },
    { where: { id: conversationId } }
  );
  ///  checking pending
  if (updatedConversation[0] == 0)
    throw createHttpError.BadRequest(
      "update latest message not updated in conversation"
    );
  // console.log("updatedConversation", updatedConversation);
  return updatedConversation;
};
import databaseModel from "../models/index.js";

export const createdMessage = async (data) => {
  const newMessage = await databaseModel.Message.create(data);
  if (!newMessage)
    return {
      code: 400,
      status: false,
      ack: 0,
      msg: "Oops... somethings went wrong",
    };
  return newMessage;
};

export const populateMessage = async (id) => {
  const msgs = await databaseModel.Message.findByPk(id);
  if (!msgs)
    return {
      code: 400,
      status: false,
      ack: 0,
      msg: "Oops... somethings went wrong",
    };
  return msgs;
};

export const getConversationMessages = async (conversationId) => {
  const messages = await databaseModel.Message.findAll({
    where: conversationId,
  });

  return messages;
};