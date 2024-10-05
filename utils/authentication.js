import jwt from "jsonwebtoken";

export async function getAuthentication(req) {
  try {
    const bearerToken = req.headers.authorization;
    console.log("bearerToken", bearerToken);
    if (!bearerToken) {
      console.log("undefined");
      return {
        userAuthentication: {
          userId: null,
          errorMessage: "token is not exist",
        },
      };
    } else {
      const token = bearerToken.split(" ")[1];
      const userDecoded = jwt.verify(token, process.env.SECRET_KEY);
      const userAuthentication = { userId: userDecoded?.userId };
      return { userAuthentication };
    }
  } catch (error) {
    console.log("error", error);
    return {
      userAuthentication: {
        userId: null,
        errorMessage: "User Unauthorized",
      },
    };
  }
}
