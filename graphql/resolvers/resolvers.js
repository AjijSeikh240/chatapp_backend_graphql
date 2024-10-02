import { PubSub } from "graphql-subscriptions";
import databaseModel from "../../models/index.js";
import { SignUpUser, signInUser } from "../../services/auth.serveice.js";
import { findUser, searchUsers } from "../../services/user.servicer.js";
import {
  createdMessage,
  getConversationMessages,
} from "../../services/message.service.js";
import {
  getUserConversations,
  createConversation,
  doesConversationExist,
  updateLatestMessage,
  populatedConversation,
} from "../../services/conversation.service.js";
import {
  sendResponse,
  sendUnauthorizeResponse,
  sendValidationResponse,
} from "../../utils/response.send.util.js";
import { signinSchema, signupSchema } from "./validations/user.validation.js";
import {
  messageCreateSchema,
  messageDeleteSchema,
  messageUpdateSchema,
} from "./validations/message.validation.js";
import {
  conversationCreateSchema,
  conversationDeleteSchema,
  conversationUpdateSchema,
} from "./validations/conversation.validation.js";

const pubsub = new PubSub();

const resolvers = {
  User: {
    conversations(user) {
      // console.log("userConversation", user);
      return user.getConversation();
    },
    async messages(user) {
      console.log("userMessage", await user.getMessages());
      return user.getMessages();
    },
  },
  Message: {
    async user(message) {
      console.log("Message", message);

      return message.getUser();
    },
    async conversation(message) {
      console.log("Message", message);
      return message.getConversation();
    },
  },
  Conversation: {
    user(conversation) {
      return conversation.getUser();
    },

    message(conversation) {
      console.log("conversation", conversation);
      return conversation.getMessages();
    },
    async receiver(conversation, args, context, info) {
      const receiverId = conversation.receiverId; // Assuming a getter
      if (!receiverId) {
        return null;
      }
      const receiverUserData = await context.userLoader.load(receiverId);
      return receiverUserData[0];
    },
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
    },
  },

  Query: {
    async searchUser(root, { searchParam }, contextValue) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;

        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // get data by search
          const searchData = await searchUsers(searchParam, userId);

          return searchData;
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    async oneUser(root, { id }, contextValue) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;
        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          console.log(id);
          // get user by id
          const userData = await findUser(id);

          return userData;
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    // message
    async getMessage(root, args, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;
        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = messageCreateSchema.validate(args.conversationId);
          // send response if invalid data
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            // fetch msg by conversationId
            const getMsg = await getConversationMessages(args.conversationId);
            console.log("getMsg", getMsg);
            return getMsg[0];
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    /// conversation
    async getConversation(root, args, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;
        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // fetch user conversation by userId
          const getConversationData = await getUserConversations(userId);

          return getConversationData[0];
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },
  },

  Mutation: {
    // after openConversation create we can send a message
    async sendMessage(root, args, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;
        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = messageCreateSchema.validate(args.input);

          // send response if invalid data
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            const senderId = userId; // this is from token

            // get conversationId from input
            const { conversationId } = args.input;

            // check that conversation exist or not
            const conversationData = await populatedConversation(
              conversationId
            );
            if (!conversationData) {
              return sendResponse(404, false, "Conversation does't exist");
            }
            // create msg using createMessage fn.
            const newMessageData = await createdMessage({
              ...args.input,
              senderId,
            });

            // send res if msg not create
            if (!newMessageData) {
              return sendResponse(400, false, "Message is not create");
            } else {
              // update that msg id in conversation model.
              await updateLatestMessage(conversationId, newMessageData.id);

              return sendResponse(
                200,
                true,
                "Successfully send msg",
                newMessageData
              );
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    async updateMessage(root, { id, message, files }, contextValue) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;
        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = messageUpdateSchema.validate({
            id,
            message,
            files,
          });
          // send response if invalid data
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            //  update payload
            const content = {};
            if (message) {
              content.message = message;
            }
            if (files) {
              content.files = files;
            }
            // checking that msg exist or not
            const checkMessage = await databaseModel.Message.findByPk(id);
            // send res if msg does't exist
            if (!checkMessage) {
              return sendResponse(404, false, "Message not found");
            } else {
              // update msg to database
              const messageUpdate = await databaseModel.Message.update(
                content,
                {
                  where: { id: id },
                }
              );
              // checking data successfully update or not, then send res
              if (messageUpdate[0] == 1) {
                return sendResponse(200, true, "successfully updated");
              } else {
                return sendResponse(400, false, "unable to update");
              }
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },
    async deleteMessage(root, { id }, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;

        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = messageDeleteSchema.validate({ id });
          // send response if invalid id
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            // checking msg valid or not
            const checkMessage = await databaseModel.Message.findByPk(id);
            // if msg does't found then send response.
            if (!checkMessage) {
              return sendResponse(404, false, "Message not found");
            } else {
              // delete the msg from db
              const deleteMessage = await databaseModel.Message.destroy({
                where: { id: id },
              });
              // checking data is deleted or not
              if (deleteMessage) {
                return sendResponse(200, true, "Delete successfully");
              } else {
                return sendResponse(400, false, "Unable to delete");
              }
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    // Conversation //
    async createOpenConversation(root, args, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;

        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = conversationCreateSchema.validate(args.input);
          // send response if invalid data
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            const senderId = userId;

            const { receiverId, name, picture } = args.input;
            // check receiver valid or not
            const receiverData = await findUser(receiverId);
            if (!receiverData) {
              return sendResponse(404, false, "Receiver data not found");
            }
            // check conversation already exist or not
            const existedConversation = await doesConversationExist(
              senderId,
              receiverId
            );

            // if conversation exist then return that conversation
            if (existedConversation.length > 0) {
              return {
                __typename: "CreateConversationResponses",
                code: 200,
                status: true,
                msg: "Conversation already exist",
                data: existedConversation[0],
              };
            } else {
              const conversationData = {
                name: name ?? "conversation name",
                picture: picture ?? "conversation picture",
                senderId,
                receiverId,
              };
              // create a conversation
              const newConversation = await createConversation(
                conversationData
              );

              if (!newConversation) {
                return sendResponse(400, false, "Conversation not created");
              } else {
                const populatedConversations = await populatedConversation(
                  newConversation.id
                );

                return {
                  __typename: "CreateConversationResponses",
                  code: 200,
                  status: true,
                  msg: "Successfully populate and create",
                  data: populatedConversations,
                };
              }
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    async updateConversation(root, args, contextValue) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;

        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = conversationUpdateSchema.validate(args);

          // send response if invalid data
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            // destructure data from arguments
            const { id, name, picture, isActive } = args;
            const content = {};
            if (name) {
              content.name = name;
            }

            if (isActive) {
              content.isActive = isActive;
            }

            if (picture) {
              content.picture = picture;
            }

            const checkConversation = await databaseModel.Conversation.findByPk(
              id
            );

            if (!checkConversation) {
              return sendResponse(404, false, "Data not found");
            } else {
              // update the conversation
              const conversationUpdate =
                await databaseModel.Conversation.update(content, {
                  where: { id: id },
                });

              if (conversationUpdate[0] == 1) {
                return sendResponse(200, true, "Successfully updated");
              } else {
                return sendResponse(400, false, "Unable to update");
              }
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },
    async deleteConversation(root, { id }, contextValue, info) {
      try {
        // get context data
        const {
          userAuthentication: { userId, errorMessage },
        } = contextValue;

        // authentication checking
        if (!userId) {
          return sendUnauthorizeResponse(errorMessage.trim());
        } else {
          // input data validation checking
          const { error } = conversationDeleteSchema.validate({ id });
          // send response if invalid id
          if (error) {
            return sendValidationResponse(400, false, error.details);
          } else {
            // checking that conversation exist or not
            const checkConversation = await databaseModel.Conversation.findByPk(
              id
            );
            if (!checkConversation) {
              return sendResponse(404, false, "Data not found");
            } else {
              // delete the conversation
              const deleteConversation =
                await databaseModel.Conversation.destroy({
                  where: { id: id },
                });
              if (deleteConversation) {
                return sendResponse(200, true, "Delete successfully");
              } else {
                return sendResponse(400, false, "Unable to update");
              }
            }
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    // user sign up
    async userSignUp(root, args, contextValue, info) {
      try {
        // input data validation checking
        const { error } = signupSchema.validate(args.input);

        // send response if invalid any data
        if (error) {
          return sendValidationResponse(400, false, error.details);
        } else {
          // create user
          const createUser = await SignUpUser(args.input);
          if (!createUser) {
            return sendResponse(400, false, "Unable to create");
          } else {
            // this is real time message or notification sending
            pubsub.publish("USER_CREATED", {
              userCreated: "Thanks for registration",
            });
            return sendResponse(201, true, "Successfully create", createUser);
          }
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },

    // Login section //
    async userSignIn(root, args, contextValue, info) {
      try {
        // input data validation checking
        const { error } = signinSchema.validate(args);

        // send response if invalid any data
        if (error) {
          return sendValidationResponse(400, false, error.details);
        } else {
          //
          const userSign = await signInUser(args.email, args.password);
          return sendResponse(200, true, "Successfully login", userSign);
        }
      } catch (error) {
        if (error.code) {
          return error;
        } else {
          return sendResponse(500, false, error.message);
        }
      }
    },
  },
};

export default resolvers;
