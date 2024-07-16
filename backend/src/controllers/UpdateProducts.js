import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";
import mongoose from "mongoose";

// Update Inventory Request
export const updateInventoryRequest = async (req, res) => {
  const products = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const items = [];

    for (const productData of products.update) {
      const item = productData.barcode;
      const existingProduct = await Product.findOne({ barcode: item }).session(
        session
      );

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      console.log(existingProduct);
      const updatedProduct = await UpdateProducts.create(
        [
          {
            product: existingProduct._id,
            createdBy: products.createdBy,
            oldStock: productData.stock,
            quantity: productData.quantity,
          },
        ],
        { session }
      );

      items.push(updatedProduct);
    }

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      msg: "Sent for verification to Admin",
      items,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

// Get Inventory Update Requests
export const getInventoryUpdateRequest = async (req, res) => {
  try {
    const inventory = await UpdateProducts.find().populate("product");
    if (inventory) {
      return res.status(200).json({
        success: true,
        inventory,
        msg: "These are the requests that are needed to update",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "No inventory update requests found",
      });
    }
  } catch (error) {
    console.error("Error fetching inventory update requests:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// Reject Inventory Request
export const rejectInventoryRequest = async (req, res) => {
  const { id } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await UpdateProducts.findOneAndDelete({ _id: id }).session(
      session
    );

    if (product) {
      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        msg: "Request Rejected Successfully",
        product,
      });
    } else {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error("Error rejecting inventory request:", error);
    return res.status(500).json({
      success: false,
      msg: "Server down",
    });
  } finally {
    session.endSession();
  }
};

// Accept Inventory Request
export const acceptInventoryRequest = async (req, res) => {
  const { inv } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const currentDate = getDate();

    const updatedProduct = await Product.findByIdAndUpdate(
      inv.product._id,
      {
        $inc: { stock: inv.quantity },
      },
      { new: true, session }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        msg: "Product not found",
        success: false,
      });
    }

    const product = {
      product: updatedProduct._id,
      quantity: inv.quantity,
      previousQuantity: updatedProduct.stock - inv.quantity,
    };

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: {
          updatedToday: product,
        },
      },
      { upsert: true, new: true, session }
    );

    const deleteRequest = await UpdateProducts.findOneAndDelete({
      _id: inv._id,
    }).session(session);

    await session.commitTransaction();
    if (dailyReport) {
      console.log("Yo bro daily report to h");
      return res.status(200).json({
        success: true,
        msg: "Stock updated successfully",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error("Error accepting inventory request:", error);
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  } finally {
    session.endSession();
  }
};

// Accept All Inventory Requests
export const acceptAllInventoryRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentDate = getDate();
    const requests = req.body; // Assuming req.body is an array of inventory requests

    for (const inv of requests) {
      const updatedProduct = await Product.findByIdAndUpdate(
        inv.product._id,
        { $inc: { stock: inv.quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error("Product update failed");
      }

      const product = {
        product: updatedProduct._id,
        quantity: inv.quantity,
        previousQuantity: updatedProduct.stock - inv.quantity,
      };

      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        { $push: { updatedToday: product } },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        throw new Error("Daily report update failed");
      }

      await UpdateProducts.findOneAndDelete({ _id: inv._id }).session(session);
    }

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      msg: "All stock updates successful",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error accepting all inventory requests:", error);
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  } finally {
    session.endSession();
  }
};
