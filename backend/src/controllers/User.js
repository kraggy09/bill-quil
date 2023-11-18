import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
const SECRET_KEY = "MySecretKeyForTheSoftware";
export const register = async (req, res) => {
  try {
    const { name, username, password, isAdmin } = req.body;

    if (isAdmin) {
      const checkAdmin = await User.find();
      const adminExists = checkAdmin.some((user) => user.isAdmin);

      if (isAdmin && adminExists) {
        return res.status(400).json({
          success: false,
          msg: "Admin already exists",
        });
      }
    }

    const existingUser = await User.findOne({ username });
    // console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists. Proceed with the login.",
      });
    }
    // console.log("Password before hashing:", password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log("after hashing", hashedPassword);
    const newUser = await User.create({
      name,
      username,
      isAdmin,
      password: hashedPassword, // Use the hashed password here
    });

    return res.status(201).json({
      success: true,
      msg: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal Error from the server",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Use await when querying the user by email
  const user = await User.findOne({ username });

  if (!user) {
    console.log("User not found. Kindly check your email ID.");
    return res.status(404).json({
      success: false,
      msg: "User not found. Kindly check your email ID.",
    });
  }

  try {
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        msg: "Incorrect password. Please try again.",
      });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.cookie(String(user._id), token, {
      path: "/",
      expires: moment
        .tz(Date.now() + 1 * 60 * 60 * 1000, "Asia/Kolkata")
        .toDate(),

      httpOnly: true,
      sameSite: "lax",
    });
    console.log("Token" + token, "    ", "Cookie");
    return res.status(200).json({
      success: true,
      msg: "User Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal Error from the server",
    });
  }
};

export const checkAuthentication = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId, "I am inevitable");
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }

    const newUser = {
      username: user.username,
      isAdmin: user.isAdmin,
    };

    return res.status(200).json({
      success: true,
      user: { ...newUser },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(500).json({
      msg: "Internal server error",
      success: false,
    });
  }
};

export const verifyToken = async (req, res, next) => {
  const headers = req.headers;
  const cookies = headers.cookie;
  const token = cookies && cookies.split("=")[1];
  // console.log(token);
  // const token = cookies.split("=")[1];
  if (!token) {
    return res.status(404).json({
      msg: "Token not found",
      success: false,
    });
  }
  jwt.verify(String(token), SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({
        msg: "Invalid Token",
        success: false,
      });
    }
    // console.log(user);
    req.userId = user.id;

    next();
  });
};
