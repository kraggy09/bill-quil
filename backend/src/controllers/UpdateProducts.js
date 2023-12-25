import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";

export const updateInventoryRequest = async (req, res) => {
  const products = req.body;

  try {
    const items = await Promise.all(
      products.update.map(async (productData) => {
        const item = productData.barcode;

        const existingProduct = await Product.findOne({ barcode: item });

        if (existingProduct) {
          const updatedProduct = await UpdateProducts.create({
            product: existingProduct._id,
            createdBy: products.createdBy,
            oldStock: productData.stock,
            quantity: productData.quantity,
          });
          return updatedProduct;
        }
      })
    );

    if (items.length > 0) {
      return res.status(200).json({
        success: true,
        msg: "Sent for verification to Admin",
        items,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "No products found or error while creating",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const getInventoryUpdateRequest = async (req, res) => {
  const inventory = await UpdateProducts.find().populate("product");
  if (inventory) {
    return res.status(200).json({
      success: true,
      inventory,
      msg: "These are the requests that are needed to update",
    });
  }
};

export const rejectInventoryRequest = async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  try {
    const product = await UpdateProducts.findOneAndDelete({ _id: id });
    if (product) {
      return res.status(200).json({
        success: true,
        msg: "Request Rejected Successfully",
        product,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Server down",
    });
  }
};

export const acceptInventoryRequest = async (req, res) => {
  const { inv } = req.body;
  console.log(inv);
  const currentDate = getDate();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      inv.product._id,
      {
        $inc: { stock: inv.quantity },
      },
      { new: true }
    );

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
      { upsert: true, new: true }
    );
    const deleteRequest = await UpdateProducts.findOneAndDelete({
      _id: inv._id,
    });
    if (dailyReport) {
      return res.status(200).json({
        success: true,
        msg: "stock updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Som error occured",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  }
};

export const acceptAllInventoryRequest = async (req, res) => {
  try {
    const currentDate = getDate();
    const requests = req.body; // Assuming req.body is an array of inventory requests
    console.log(requests);

    // Using Promise.all to parallelize the processing of each inventory request
    const results = await Promise.all(
      requests.map(async (inv) => {
        const updatedProduct = await Product.findByIdAndUpdate(
          inv.product._id,
          {
            $inc: { stock: inv.quantity },
          },
          { new: true }
        );

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
          { upsert: true, new: true }
        );

        const deleteRequest = await UpdateProducts.findOneAndDelete({
          _id: inv._id,
        });

        return { success: true, msg: "Stock updated successfully" };
      })
    );

    // Check if all requests were successful
    const allSuccess = results.every((result) => result.success);

    if (allSuccess) {
      return res.status(200).json({
        success: true,
        msg: "All stock updates successful",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Some errors occurred during processing",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  }
};
