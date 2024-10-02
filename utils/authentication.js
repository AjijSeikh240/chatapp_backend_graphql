import jwt from "jsonwebtoken";

export function getAuthentication(request) {
  const token = req.headers.authorization;
  try {
    if (!token)
      return {
        userAuthentication: {
          userId: null,
          errorMessage: "token is not exist",
        },
      };
    const userDecoded = jwt.verify(token, process.env.SECRET_KET);
    const userAuthentication = { userId: userDecoded?.userId };
    return { userAuthentication };
  } catch (error) {
    return {
      userAuthentication: { userId: null, errorMessage: "User Unauthorized" },
    };
  }
}
