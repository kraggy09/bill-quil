import Customer from "../models/Customer.js";

export const createNewCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    const { name, outstanding, phone } = customerData;
    const customer = await Customer.findOne({ name });
    if (customer) {
      return res.status(404).json({
        success: false,
        msg: "Customer already exists",
        customer,
      });
    }

    const newCustomer = Customer.create({
      name,
      outstanding,
      phone,
    });
    return res.status(201).json({
      success: true,
      msg: "Customer created successfully",
      data: newCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
