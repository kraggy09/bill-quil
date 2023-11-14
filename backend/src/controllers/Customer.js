import Customer from "../models/Customer.js";

export const createNewCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    let { name, outstanding, phone } = customerData;
    name = name.toLowerCase();
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

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    if (customers) {
      return res.status(200).json({
        customers,
        msg: "List of customers",
        success: true,
      });
    }
    return res.status(404).json({
      msg: "No customers found",
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getSingleCustomer = async (req, res) => {
  const customerId = req.params.customerId; // Access the customer ID from the route parameter
  try {
    const customer = await Customer.findById(customerId)
      .populate("bills")
      .populate("transactions")
      .exec();

    if (customer) {
      return res.status(200).json({
        msg: "Customer found successfully",
        customer,
        success: true,
      });
    }
    return res.status(404).json({
      msg: "Customer not found",
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
};
