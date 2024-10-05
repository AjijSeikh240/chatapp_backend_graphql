import DataLoader from "dataloader";
import databaseModel from "../models/index.js";
import { sendResponse } from "./response.send.util.js";

const userLoader = new DataLoader(async (userId) => {
  try {
    const users = await databaseModel.User.findAll({
      where: {
        id: userId,
      },
    });

    // Create a map for easy access
    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = user; // Map users by their ID
    });

    // Return users in the order of the original userIds array
    return userId.map((userId) => userMap[userId] || null);
  } catch (error) {
    return sendResponse(500, false, error.message);
  }
});

export default userLoader;
