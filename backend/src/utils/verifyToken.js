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

export const extractToken = async (req, res, next) => {
  let token;

  // Check the request method
  if (req.method === "POST") {
    token = req.body.token; // For POST requests, get the token from the body
  } else if (req.method === "GET" || req.method === "DELETE") {
    token = req.headers["authorization"]?.split(" ")[1]; // For GET requests, get the token from the Authorization header
  }

  // If no token is found, return an error
  if (!token) {
    return res.status(404).json({
      success: false,
      msg: "Token not found",
    });
  }

  // Verify the token
  let verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({
      success: false,
      msg: "Please relogin as your token is not correct",
    });
  }

  // Token is verified, proceed to the next middleware or route handler
  next();
};
