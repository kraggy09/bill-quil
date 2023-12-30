import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

import UpdateProducts from "../models/UpdateProducts.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const createNewProduct = async (req, res) => {
  try {
    let {
      name,
      barcode,
      mrp,
      costPrice,
      retailPrice,
      wholesalePrice,
      superWholesalePrice,
      measuring,
      stock,
      packet,
      box,
      minQuantity,
    } = req.body;

    const newBarcode = [barcode];
    name = name.toLowerCase();
    const productBarcode = await Product.findOne({ barcode });
    const productName = await Product.findOne({ name });
    if (productBarcode) {
      if (productBarcode.barcode.includes(barcode)) {
        return res.status(400).json({
          success: false,
          msg: `The barcode is already being used by the product `,
          product: productBarcode,
        });
      }
    }
    if (productName) {
      if (productName.name.toLowerCase() == name) {
        return res.status(400).json({
          success: false,
          msg: `Product Already exists`,
          product: productName,
        });
      }
    }
    const newProduct = await Product.create({
      name,
      barcode: newBarcode,
      mrp,
      costPrice,
      retailPrice,
      wholesalePrice,
      superWholesalePrice,
      measuring,
      stock,
      packet,
      box,
      minQuantity,
    });

    return res.status(201).json({
      success: true,
      msg: `Product created successfully`,
      data: newProduct,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { name, barcode } = req.query;
    if (name) {
      const product = await Product.find({ name });
      if (product) {
        return res.status(200).json({
          success: true,
          msg: "The product is found",
          data: product,
        });
      }
    }
    if (barcode) {
      const product = await Product.findOne({ barcode });
      if (product) {
        return res.status(200).json({
          success: true,
          msg: "The product is found",
          data: product,
        });
      }
    }

    return res.status(400).json({
      success: false,
      msg: "No data found for this product",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getAllproduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      msg: "These are the products",
      products,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { name, mrp, barcode } = req.query;
    if (name) {
      const deletedProduct = await Product.findOneAndDelete({ name, mrp });
      if (deletedProduct) {
        return res.status(200).json({
          success: true,
          data: deletedProduct,
          msg: "Product deleted successfully",
        });
      }
    }
    if (barcode) {
      const deletedProduct = await Product.findOneAndDelete({ barcode });
      if (deletedProduct) {
        return res.status(200).json({
          success: true,
          data: deletedProduct,
          msg: "Product deleted successfully",
        });
      }
    }

    return res.status(400).json({
      success: false,
      msg: "No product found ",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateProductDetails = async (req, res) => {
  try {
    const product = req.body;
    const newProduct = {
      name: product.name,
      mrp: product.mrp,
      costPrice: product.costPrice,
      measuring: product.measuring,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      superWholesalePrice: product.superWholesalePrice,
      stock: product.stock,
      packet: product.packet,
      box: product.box,
      minQuantity: product.minQuantity,
    };

    const barcode = product.barcode;
    console.log("barcode", barcode);
    console.log(newProduct);
    console.log(product._id);

    const existingProduct = await Product.findOne({ barcode: barcode });

    if (existingProduct && existingProduct.name != newProduct.name) {
      return res.status(404).json({
        success: false,
        msg: "Barcode in use for other product",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $set: newProduct,
        $addToSet: { barcode: existingProduct ? [] : barcode },
      },
      { new: true }
    );
    console.log("updatedProduct", updatedProduct);

    if (!updatedProduct) {
      // Handle the case where the product was not found
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Respond with the updated product data
    res.status(200).json({
      success: true,
      msg: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({
      success: false,
      msg: "Server is down",
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const currentDate = getDate();

    const { quantity, id } = req.body;

    // Use the $inc operator to increment the stock field by the given quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $inc: { stock: quantity },
      },
      { new: true }
    );

    const product = {
      product: updatedProduct._id,
      quantity: quantity,
      previousQuantity: updatedProduct.stock - quantity,
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

    if (!updatedProduct) {
      // Handle the case where the product was not found
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Respond with the updated product data
    res.status(200).json({
      success: true,
      msg: "Stock Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({
      success: false,
      msg: "Server is down",
    });
  }
};

export const returnProduct = async (req, res) => {
  const abc = req.body;
  const currentDate = getDate();
  const { purchased, foundCustomer, returnType, total } = abc;

  try {
    const items = await Promise.all(
      purchased.map(async (product) => {
        const quantity =
          product.piece +
          product.packet * product.packetQuantity +
          product.box * product.boxQuantity;
        const id = new mongoose.Types.ObjectId(product.id);
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            $inc: { stock: quantity },
          },
          { new: true }
        );

        return {
          product: updatedProduct._id,
          quantity: quantity,
          previousQuantity: updatedProduct.stock - quantity,
        };
      })
    );

    let transaction, dailyReport;

    if (returnType === "adjustment") {
      const newOutstanding = foundCustomer.outstanding - total;

      transaction = await Transaction.create({
        name: foundCustomer.name,
        previousOutstanding: foundCustomer.outstanding,
        amount: total,
        newOutstanding,
        taken: false,
        purpose: "Return Product",
        paymentMode: "productReturn",
      });

      const customer = await Customer.findByIdAndUpdate(foundCustomer._id, {
        $inc: { outstanding: -total },
        $push: { transactions: transaction._id },
      });
    } else {
      transaction = await Transaction.create({
        name: "Product Return",
        amount: total,
        taken: true,
        purpose: "return",
        paymentMode: "cash",
      });
    }

    const productsForDailyReport = items.map((inv) => ({
      product: inv.product,
      quantity: inv.quantity,
      previousQuantity: inv.previousQuantity,
    }));

    dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: {
          updatedToday: { $each: productsForDailyReport },
          transactions: transaction._id,
        },
      },
      { upsert: true, new: true }
    );

    console.log("Everything done successfully");
    return res.status(200).json({
      success: true,
      transaction,
      dailyReport,
      msg: "Updated successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Error during processing",
    });
  }
};

// export const returnProduct = async (req, res) => {
//   const abc = req.body;
//   const currentDate = getDate();
//   const { purchased, foundCustomer, returnType, total } = abc;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const items = await Promise.all(
//       purchased.map(async (product) => {
//         const quantity =
//           product.piece +
//           product.packet * product.packetQuantity +
//           product.box * product.boxQuantity;
//         const id = new mongoose.Types.ObjectId(product.id);
//         const updatedProduct = await Product.findByIdAndUpdate(
//           id,
//           {
//             $inc: { stock: quantity },
//           },
//           { new: true, session }
//         );

//         return {
//           product: updatedProduct._id,
//           quantity: quantity,
//           previousQuantity: updatedProduct.stock - quantity,
//         };
//       })
//     );

//     let transaction, dailyReport;

//     if (returnType === "adjustment") {
//       const newOutstanding = foundCustomer.outstanding - total;

//       transaction = await Transaction.create(
//         {
//           name: foundCustomer.name,
//           previousOutstanding: foundCustomer.outstanding,
//           amount: total,
//           newOutstanding,
//           taken: false,
//           purpose: "Return Product",
//           paymentMode: "productReturn",
//         },
//         { session }
//       );

//       const customer = await Customer.findByIdAndUpdate(
//         foundCustomer._id,
//         {
//           $inc: { outstanding: -total },
//           $push: { transactions: transaction._id },
//         },
//         { session }
//       );
//     } else {
//       transaction = await Transaction.create(
//         {
//           name: "Product Return",
//           amount: total,
//           taken: true,
//           purpose: "return",
//           paymentMode: "cash",
//         },
//         { session }
//       );
//     }

//     const productsForDailyReport = items.map((inv) => ({
//       product: inv.product,
//       quantity: inv.quantity,
//       previousQuantity: inv.previousQuantity,
//     }));

//     dailyReport = await DailyReport.findOneAndUpdate(
//       { date: currentDate },
//       {
//         $push: {
//           updatedToday: { $each: productsForDailyReport },
//           transactions: transaction._id,
//         },
//       },
//       { upsert: true, new: true, session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     console.log("Everything done successfully");
//     return res.status(200).json({
//       success: true,
//       transaction,
//       dailyReport,
//       msg: "Updated successfully",
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: "Error during processing",
//     });
//   }
// };
