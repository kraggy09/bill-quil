import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import axios from "axios";

import UpdateProducts from "../models/UpdateProducts.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import Logger from "../models/Logger.js";

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
    name = name.trim();
    name = name.toLowerCase();

    let newOne;
    const get_base_url = (lang, word) =>
      `https://www.google.com/inputtools/request?ime=transliteration_en_${lang}&num=5&cp=0&cs=0&ie=utf-8&oe=utf-8&app=jsapi&text=${word}`;

    try {
      const res = await axios.get(get_base_url("hi", name));

      if (res.data[1][0][1]?.length > 0) {
        // console.log([...res.data[1][0][1], name]);
        newOne = [...res.data[1][0][1], name];
      } else {
        console.log(name);
      }
    } catch (error) {
      console.log(error.message);
    }

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
      hi: newOne[0],
      category: "null",
    });

    return res.status(201).json({
      success: true,
      msg: `Product created successfully`,
      data: newProduct,
    });
  } catch (error) {
    // console.log(error.message);
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
    // console.log(error.message);
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
    // console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = req.query;
    console.log(product);

    if (product.barcode) {
      const deletedProduct = await Product.findOneAndDelete({
        barcode: product.barcode,
      });
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
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateProductDetails = async (req, res) => {
  try {
    const product = req.body;
    console.log(product);
    const newProduct = {
      name: product.name.trim(),
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
      barcode: product.barcode,
    };

    console.log(newProduct.barcode);
    // console.log("barcode", barcode);
    // console.log(newProduct);
    // console.log(product._id);

    const existingProduct = await Product.findOne({
      barcode: { $in: newProduct.barcode },
    });

    if (
      existingProduct &&
      existingProduct.name != newProduct.name &&
      existingProduct._id != product._id
    ) {
      return res.status(404).json({
        success: false,
        msg: "Barcode in use for other product",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $set: newProduct,
      },
      { new: true }
    );
    // console.log("updatedProduct", updatedProduct);

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
    // console.log(error.message);
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let transaction, dailyReport;
    dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {},
      { new: true, upsert: true }
    );

    if (purchased.length === 0) {
      throw new Error("No products to return");
    }
    console.log("Daily Report", dailyReport);
    console.log("Purchased", purchased);

    // Update the stock for each purchased product
    const items = [];
    for (const product of purchased) {
      const quantity =
        product.piece +
        product.packet * product.packetQuantity +
        product.box * product.boxQuantity;
      const id = new mongoose.Types.ObjectId(product.id);
      let availableProduct = await Product.findById(id);
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true, session }
      );
      if (!updatedProduct) {
        return res.status(404).json({
          msg: "Error while returning the product",
          success: false,
        });
      }

      let logger = await Logger.create({
        name: "Product Return",
        previousQuantity: availableProduct.stock,
        newQuantity: updatedProduct.stock,
        qunatity: quantity,
        product: availableProduct._id,
      });
      items.push({
        product: updatedProduct._id,
        quantity: quantity,
        previousQuantity: updatedProduct.stock - quantity,
      });
    }
    // Create the transaction based on the return type
    if (returnType === "adjustment") {
      if (foundCustomer.outstanding == null) {
        throw new Error("Outstanding not found");
      }
      const newOutstanding = foundCustomer?.outstanding - total;
      transaction = await Transaction.create(
        [
          {
            name: foundCustomer.name,
            previousOutstanding: foundCustomer.outstanding,
            amount: total,
            newOutstanding,
            taken: false,
            purpose: "Return Product",
            paymentMode: "productReturn",
            approved: true,
            customer: foundCustomer._id,
          },
        ],
        { new: true, session }
      );
      // Update customer's outstanding and push the transaction ID to transactions array
      const customer = await Customer.findByIdAndUpdate(
        foundCustomer._id,
        {
          $inc: { outstanding: -total },
          $push: { transactions: transaction[0]._id },
        },
        { session }
      );
    } else {
      // If returnType is not "adjustment", create a standard product return transaction
      transaction = await Transaction.create(
        [
          {
            name: "Product Return",
            amount: total,
            taken: true,
            purpose: "return",
            paymentMode: "cash",
            approved: true,
          },
        ],
        { new: true, session }
      );
    }

    // Prepare data for daily report update
    const productsForDailyReport = items.map((inv) => ({
      product: inv.product,
      quantity: inv.quantity,
      previousQuantity: inv.previousQuantity,
    }));

    // Update the daily report document
    if (transaction) {
      // Push the updated products and transaction ID to the daily report
      console.log(dailyReport);
      dailyReport.updatedToday.push(...productsForDailyReport);
      dailyReport.transactions.push(transaction[0]._id);
      // Save the modified daily report
      dailyReport = await dailyReport.save({ session });
    } else {
      // If transaction creation fails, abort the session
      await session.abortTransaction();
      return res.status(404).json({
        msg: "There was an error creating the transaction",
        success: false,
      });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    // Return success response
    return res.status(200).json({
      success: true,
      transaction,
      dailyReport,
      msg: "Updated successfully",
    });
  } catch (error) {
    // If an error occurs, abort the transaction and return error response
    await session.abortTransaction();
    session.endSession();
    console.log(error);
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
//           { new: true }
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

//       transaction = await Transaction.create({
//         name: foundCustomer.name,
//         previousOutstanding: foundCustomer.outstanding,
//         amount: total,
//         newOutstanding,
//         taken: false,
//         purpose: "Return Product",
//         paymentMode: "productReturn",
//       });

//       const customer = await Customer.findByIdAndUpdate(foundCustomer._id, {
//         $inc: { outstanding: -total },
//         $push: { transactions: transaction._id },
//       });
//     } else {
//       transaction = await Transaction.create({
//         name: "Product Return",
//         amount: total,
//         taken: true,
//         purpose: "return",
//         paymentMode: "cash",
//       });
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
//       { upsert: true, new: true }
//     );
//     return res.status(200).json({
//       success: true,
//       transaction,
//       dailyReport,
//       msg: "Updated successfully",
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: "Error during processing",
//     });
//   }
// };
