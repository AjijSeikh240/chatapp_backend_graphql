import databaseModel from "../models/index.js";
import { Sequelize, Op } from "sequelize";

export const findUser = async (userId) => {
  try {
    const user = await databaseModel.User.findByPk(userId);

    return user;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

export const searchUsers = async (searchParam, userId) => {
  try {
    const users = await databaseModel.User.findAll({
      where: {
        // id: {
        //   [Sequelize.Op.not]: userId, // Exclude the user with the specified ID
        // },
        [Op.or]: [{ name: { [Op.like]: `%${searchParam}%` } }],
      },
    });
    // console.log("users", users);
    return users;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};
