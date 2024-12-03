import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Logger from "../models/Logger.js";
import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";
import mongoose from "mongoose";

export const updateInventoryRequest = async (req, res) => {
  const products = req.body;
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const bulkOperations = [];
      const updateProductsData = [];

      for (const productData of products.update) {
        const item = productData.barcode;

        // Find the existing product
        const existingProduct = await Product.findOne({
          barcode: item,
        }).session(session);
        if (!existingProduct) {
          throw new Error(`Product not found for barcode: ${item}`);
        }

        // Prepare data for the `UpdateProducts` collection
        updateProductsData.push({
          product: existingProduct._id,
          createdBy: products.createdBy,
          oldStock: productData.stock,
          quantity: productData.quantity,
        });
      }

      // Insert the update logs in bulk
      const createdItems = await UpdateProducts.insertMany(updateProductsData, {
        session,
      });

      return createdItems;
    });

    // Success response
    return res.status(200).json({
      success: true,
      msg: "Sent for verification to Admin",
      items: result,
    });
  } catch (error) {
    console.error("Error:", error.message);

    // Error response
    return res.status(500).json({
      success: false,
      msg: error.message || "Internal server error",
    });
  } finally {
    // Ensure the session ends
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
    await session.withTransaction(async () => {
      const product = await UpdateProducts.findOneAndDelete({
        _id: id,
      }).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      return product; // Returning the deleted product for response
    });

    // Success response
    return res.status(200).json({
      success: true,
      msg: "Request Rejected Successfully",
    });
  } catch (error) {
    console.error("Error rejecting inventory request:", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message || "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

//Todo: Regressly test
export const acceptInventoryRequest = async (req, res) => {
  const { inv } = req.body;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const currentDate = getDate();

      // Fetch the available product within the transaction session
      const availableProduct = await Product.findById(inv.product._id).session(
        session
      );
      if (!availableProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        error.data = { productId: inv.product._id };
        throw error;
      }

      // Update the product's stock within the session
      const updatedProduct = await Product.findByIdAndUpdate(
        inv.product._id,
        { $inc: { stock: inv.quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        const error = new Error("Product update failed");
        error.statusCode = 500;
        error.data = { productId: inv.product._id };
        throw error;
      }

      // Create the log entry within the transaction session
      await Logger.create(
        [
          {
            name: "Stock Update",
            previousQuantity: availableProduct.stock,
            newQuantity: updatedProduct.stock,
            product: availableProduct._id,
            quantity: inv.quantity,
          },
        ],
        { session }
      );

      // Update the daily report within the transaction session
      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        {
          $push: {
            updatedToday: {
              product: updatedProduct._id,
              quantity: inv.quantity,
              previousQuantity: updatedProduct.stock - inv.quantity,
            },
          },
        },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        const error = new Error("Daily report update failed");
        error.statusCode = 500;
        throw error;
      }

      // Delete the inventory request within the transaction session
      const deleteRequest = await UpdateProducts.findOneAndDelete({
        _id: inv._id,
      }).session(session);

      if (!deleteRequest) {
        const error = new Error("Failed to delete the inventory request");
        error.statusCode = 500;
        error.data = { requestId: inv._id };
        throw error;
      }
    });

    return res.status(200).json({
      success: true,
      msg: "Stock updated successfully",
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error accepting inventory request:", error);

    // Send a custom error response to the client
    return res.status(error.statusCode || 500).json({
      success: false,
      msg: error.message || "Server down",
      data: error.data || null,
    });
  } finally {
    // Ensure the session is properly ended
    session.endSession();
  }
};

// Todo: Regressly test
export const acceptAllInventoryRequest = async (req, res) => {
  const session = await mongoose.startSession();

  const requests = req.body.inventoryRequests; // Assuming req.body is an array of inventory requests
  console.log(requests);

  try {
    const currentDate = getDate();

    await session.withTransaction(async () => {
      const productBulkOps = [];
      const loggerEntries = [];
      const dailyReportItems = [];
      const deleteRequests = [];

      for (const inv of requests) {
        // Fetch the product to be updated
        const availableProduct = await Product.findById(
          inv.product._id
        ).session(session);
        if (!availableProduct) {
          throw new Error(`Product not found: ${inv.product._id}`);
        }

        // Prepare product stock update operation
        productBulkOps.push({
          updateOne: {
            filter: { _id: inv.product._id },
            update: { $inc: { stock: inv.quantity } },
          },
        });

        // Prepare logger entry
        loggerEntries.push({
          name: "Stock Update",
          previousQuantity: availableProduct.stock,
          newQuantity: availableProduct.stock + inv.quantity,
          quantity: inv.quantity,
          product: availableProduct._id,
        });

        // Prepare daily report entry
        dailyReportItems.push({
          product: availableProduct._id,
          quantity: inv.quantity,
          previousQuantity: availableProduct.stock,
          purpose: "Stock Update",
        });

        // Collect requests to delete
        deleteRequests.push(inv._id);
      }

      // Execute bulk write for product updates
      if (productBulkOps.length > 0) {
        const productUpdateResult = await Product.bulkWrite(productBulkOps, {
          session,
        });
        if (productUpdateResult.modifiedCount !== productBulkOps.length) {
          throw new Error("Failed to update all product stocks");
        }
      }

      // Insert logger entries in bulk
      if (loggerEntries.length > 0) {
        await Logger.insertMany(loggerEntries, { session });
      }

      // Update daily report with all items
      await DailyReport.findOneAndUpdate(
        { date: currentDate },
        { $push: { updatedToday: dailyReportItems } },
        { upsert: true, new: true, session }
      );

      // Delete inventory requests in bulk
      if (deleteRequests.length > 0) {
        await UpdateProducts.deleteMany({
          _id: { $in: deleteRequests },
        }).session(session);
      }
    });

    // Success response
    return res.status(200).json({
      success: true,
      msg: "All stock updates successful",
    });
  } catch (error) {
    console.error("Error accepting all inventory requests:", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message || "Internal server error",
    });
  } finally {
    // Ensure session is ended
    session.endSession();
  }
};
