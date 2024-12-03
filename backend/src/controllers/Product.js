import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import axios from "axios";

import UpdateProducts from "../models/UpdateProducts.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import Logger from "../models/Logger.js";
import BillId from "../models/BillId.js";
import Counter from "../models/Counter.js";

export const createNewProduct = async (req, res) => {
  try {
    let {
      name,
      category,
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
      category,
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
      category: product.category,
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

    // console.log(newProduct.barcode);
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
  const session = await mongoose.startSession();

  try {
    const currentDate = getDate();
    const { quantity, id } = req.body;

    const result = await session.withTransaction(async () => {
      // Find the product with the current session to ensure it's part of the transaction
      const availableProduct = await Product.findById(id).session(session);
      if (!availableProduct) {
        throw new Error("Unable to find the available product");
      }

      // Update the stock using $inc
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error("Unable to update the product");
      }

      const product = {
        product: updatedProduct._id,
        quantity,
        previousQuantity: availableProduct.stock,
        purpose: "Stock Update",
      };

      // Update or create the daily report
      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        { $push: { updatedToday: product } },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        throw new Error("Unable to update the daily report");
      }

      // Log the update
      const logger = await Logger.create(
        [
          {
            name: "Stock Update",
            previousQuantity: availableProduct.stock,
            newQuantity: updatedProduct.stock,
            quantity,
            product: updatedProduct._id,
          },
        ],
        { session }
      );

      if (!logger) {
        throw new Error("Unable to create the logger");
      }

      // Return the updated product
      return updatedProduct;
    });

    return res.status(200).json({
      success: true,
      msg: "Stock Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error during stock update:", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message || "Server Down",
    });
  } finally {
    // Ensure the session is ended
    session.endSession();
  }
};

//Todo: Regress testing
export const returnProduct = async (req, res) => {
  const abc = req.body;
  const currentDate = getDate();
  let { purchased, foundCustomer, billId, transactionId, returnType, total } =
    abc;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Validate billId
      const previousBillId = await Counter.findOne({ name: "billId" }).session(
        session
      );

      const previousTransactionId = await Counter.findOne({
        name: "transactionId",
      }).session(session);

      if (previousBillId.value !== billId) {
        throw new Error("Duplicate bill !! Pls refresh");
      }

      if (previousTransactionId.value != transactionId) {
        throw new Error("Duplicate Transaction !! Pls refresh");
      }
      if (purchased.length === 0) {
        throw new Error("No products to return");
      }

      // Prepare bulk operations for product stock updates and logger entries
      const productBulkOperations = [];
      const loggerEntries = [];
      const items = [];

      for (const product of purchased) {
        const quantity =
          product.piece +
          product.packet * product.packetQuantity +
          product.box * product.boxQuantity;

        const id = new mongoose.Types.ObjectId(product.id);

        // Prepare stock update operation
        productBulkOperations.push({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { stock: quantity } },
          },
        });

        // Fetch product details for logging
        const availableProduct = await Product.findById(id).session(session);
        if (!availableProduct) {
          throw new Error(`Product not found: ${product.name || product.id}`);
        }

        // Prepare logger entry
        loggerEntries.push({
          name: "Product Return",
          previousQuantity: availableProduct.stock,
          newQuantity: availableProduct.stock + quantity,
          quantity,
          product: availableProduct._id,
        });

        // Prepare item details for daily report
        items.push({
          product: availableProduct._id,
          quantity,
          previousQuantity: availableProduct.stock,
        });
      }

      // Execute bulk write for product stock updates
      const bulkWriteResult = await Product.bulkWrite(productBulkOperations, {
        session,
      });

      if (bulkWriteResult.modifiedCount !== purchased.length) {
        throw new Error("Failed to update all product stocks");
      }

      // Insert logger entries in bulk
      await Logger.insertMany(loggerEntries, { session });

      // Handle return type
      let transaction = null;
      if (returnType === "adjustment") {
        // Fetch and validate customer
        foundCustomer = await Customer.findById(foundCustomer._id).session(
          session
        );
        if (!foundCustomer) {
          throw new Error("Customer not found");
        }

        const newOutstanding = foundCustomer.outstanding - total;

        let newTransactionId = await Counter.findOneAndUpdate(
          { name: "transactionId" },
          {
            $inc: { value: 1 },
          },
          {
            new: true,
            session,
          }
        );

        if (!newTransactionId) {
          throw new Error("Unable to create transaction id");
        }
        // Create transaction
        transaction = await Transaction.create(
          [
            {
              id: newTransactionId.value,
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
          { session }
        );

        if (!transaction[0]) {
          throw new Error("Unable to create the transaction");
        }

        // Update customer outstanding balance
        const updatedCustomer = await Customer.findByIdAndUpdate(
          foundCustomer._id,
          { $inc: { outstanding: -total } },
          { session }
        );

        if (!updatedCustomer) {
          throw new Error("Unable to update customer's outstanding balance");
        }
      } else {
        const newTransactionId = await Counter.findOneAndUpdate(
          { value: "transactionId" },
          {
            $inc: { value: 1 },
          },
          {
            new: true,
            session,
          }
        );

        console.log(newTransactionId, "this is the transaction");

        if (!newTransactionId) {
          throw new Error("Unable to create transaction id");
        }
        transaction = await Transaction.create(
          [
            {
              id: newTransactionId.value,
              name: "Product Return",
              amount: total,
              taken: true,
              purpose: "return",
              paymentMode: "cash",
              approved: true,
            },
          ],
          { session }
        );

        if (!transaction[0]) {
          throw new Error("Unable to create the transaction");
        }
      }

      // Update daily report correctly here
      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        {
          $push: {
            updatedToday: items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              previousQuantity: item.previousQuantity,
              purpose: "Product Return",
            })),
            transactions: transaction[0]._id,
          },
        },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        throw new Error("Unable to update the daily report");
      }

      let newBillId = await Counter.findOneAndUpdate(
        { name: "billId" },
        {
          $inc: { value: 1 },
        },
        { new: true, session }
      );

      if (!newBillId) {
        throw new Error("Unable to create the bill id");
      }
      // Success response
      return res.status(200).json({
        success: true,
        transaction,
        dailyReport,
        msg: "Updated successfully",
      });
    });
  } catch (error) {
    console.error("Error during transaction:", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  } finally {
    // End session
    session.endSession();
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
