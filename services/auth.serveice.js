import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import databaseModel from "../models/index.js";
import { sendResponse } from "../utils/response.send.util.js";

// env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

// Register
export const SignUpUser = async (userData) => {
  try {
    let { name, email, picture, status, password } = userData;

    const hashPassword = bcrypt.hash(password, 10);
    password = await hashPassword;

    // check is user already exist
    const checkDb = await databaseModel.User.findOne({
      where: { email: email },
    });
    if (checkDb) {
      throw sendResponse(409, false, "This email already exist.");
    }

    const user = await databaseModel.User.create({
      name,
      email,
      picture: picture || DEFAULT_PICTURE,
      status: status || DEFAULT_STATUS,
      password,
    });

    return user;
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};

// Login
export const signInUser = async (email, password) => {
  try {
    const user = await databaseModel.User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    // check user exist
    if (!user) {
      throw sendResponse(400, false, "Invalid credentials");
    } else {
      // compare password
      let passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        throw sendResponse(400, false, "Invalid credential");
      } else {
        const token = jwt.sign(
          { userId: user.dataValues.id },
          process.env.SECRET_KEY,
          {
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: process.env.EXPIRES_IN,
          }
        );
        user.token = token;
        delete user.password;

        return user;
      }
    }
  } catch (error) {
    console.log("Occurred server error", error);
    throw error;
  }
};
