import getDate from "../config/getDate.js";
import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

export const createBill = async (req, res) => {
  const currentDate = getDate();
  const products = req.body.products;
  const { customerId, total, payment = 0, discount = 0 } = req.body;

  const items = await Promise.all(
    products.map(async (product) => {
      const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: { stock: -product.quantity },
        },
        { new: true }
      );

      return {
        product: updatedProduct._id,
        quantity: product.quantity,
      };
    })
  );

  try {
    const customer = await Customer.findById(customerId);
    const newBill = await Bill.create({
      customer: customerId,
      items: items,
      total,
      payment,
      discount,
    });

    let transaction = null;
    let dailyReport = null;
    if (payment > 0) {
      transaction = await Transaction.create({
        name: customer.name,
        purpose: "Payment",
        amount: payment,
        taken: false,
      });

      dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        {
          $push: { transactions: transaction._id, bills: newBill._id },
        },
        { upsert: true, new: true }
      );
    }

    // Update the customer's bills array with the newly created bill
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, {
      $push: { bills: newBill._id },
      outstanding: total - payment,
      $push: { transactions: transaction ? transaction._id : null },
    });

    if (updatedCustomer) {
      return res.status(201).json({
        message: "Bill created successfully",
        data: {
          bill: newBill,
          updatedCustomer,
          dailyReport,
        },
      });
    }
  } catch (error) {
    console.error("Error creating bill:", error);
    return res.status(500).json({ error: "Error creating bill" });
  }
};

export const getBillDetails = () => {};
