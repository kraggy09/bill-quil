import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    if (!token) {
      return {
        status: 401,
        json: {
          msg: "No token found, please relogin",
          success: false,
          login: false,
        },
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return {
        status: 401,
        json: {
          error: "Unauthorized, invalid token",
          success: false,
          msg: "Bad Auth",
          login: false,
        },
      };
    }

    return {
      status: 200,
      userId: decoded.userId,
    };
  } catch (error) {
    return {
      status: 500,
      json: {
        success: false,
        error: error.message,
        msg: "Error in token verification",
      },
    };
  }
};
