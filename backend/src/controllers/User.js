import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists. Proceed with the login.",
      });
    }

    const newUser = await User.create({
      name,
      email,
      isAdmin,
      password,
      isAdmin: true,
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
