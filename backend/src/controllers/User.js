import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { verifyToken } from "../utils/verifyToken.js";
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

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists. Proceed with the login.",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      username,
      isAdmin,
      password: hashedPassword, // Use the hashed password here
    });

    if (newUser) {
      generateToken(newUser._id, res);
    } else {
      return res.status(404).json({
        msg: "Error creating user",
        success: false,
      });
    }

    const userWithoutPassword = newUser.toObject();
    // console.log(userWithoutPassword);
    delete userWithoutPassword.password;

    return res.status(201).json({
      success: true,
      msg: "User created successfully",
      newUser: userWithoutPassword,
    });
  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal Error from the server",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  //Finding user with username
  const user = await User.findOne({ username });

  //If not found just throw error
  if (!user) {
    // console.log("User not found. Kindly check your username.");
    return res.status(404).json({
      success: false,
      msg: "User not found. Kindly check your username.",
    });
  }

  try {
    //Checking and throwing error for the password if not correct
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        msg: "Incorrect password. Please try again.",
      });
    }

    let token = await generateToken(user._id, res);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    //Finally sending in response to the user
    return res.status(200).json({
      success: true,
      msg: "User Login successful",
      user: userWithoutPassword,
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

export const checkAuth = async (req, res) => {
  const { token } = req.body;

  const verificationResult = await verifyToken(token);

  if (verificationResult.status !== 200) {
    return res.status(verificationResult.status).json(verificationResult.json);
  }

  const userId = verificationResult.userId;

  try {
    let user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("Error checking authentication:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        msg: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      msg: "Server error! Please try again",
      success: false,
    });
  }
};
