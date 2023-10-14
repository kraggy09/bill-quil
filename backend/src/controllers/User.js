import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists. Proceed with the login.",
      });
    }

    const hashedPasswrod = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      isAdmin,
      password: hashedPasswrod,
      isAdmin,
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
  const { email, password } = req.body;

  // Use await when querying the user by email
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found. Kindly check your email ID.");
    return res.status(404).json({
      success: false,
      msg: "User not found. Kindly check your email ID.",
    });
  }

  try {
    // Use bcrypt.compare to compare the provided password with the hashed password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      return res.status(200).json({
        success: true,
        msg: "User Login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "Incorrect password. Please try again.",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal Error from the server",
    });
  }
};
