import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";

export const createBill = async (req, res) => {
  const customerId = req.body.customerId;
  const products = req.body.products;
  const total = req.body.total;

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
    const newBill = await Bill.create({
      customer: customerId,
      items: items,
      total,
    });

    // Update the customer's bills array with the newly created bill
    await Customer.findByIdAndUpdate(customerId, {
      $push: { bills: newBill._id },
    });

    return res
      .status(201)
      .json({ message: "Bill created successfully", bill: newBill });
  } catch (error) {
    console.error("Error creating bill:", error);
    return res.status(500).json({ error: "Error creating bill" });
  }
};
