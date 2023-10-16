import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";

export const createNewProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      mrp,
      costPrice,
      retailPrice,
      wholesalePrice,
      measuring,
      stock,
      packet,
      box,
    } = req.body;

    const productBarcode = await Product.findOne({ barcode });
    const productName = await Product.findOne({ $and: [{ name }, { mrp }] });
    if (productBarcode) {
      if (barcode == productBarcode.barcode) {
        return res.status(400).json({
          success: false,
          msg: `The barcode is already being used by the product `,
          product: productBarcode,
        });
      }
    }
    if (productName) {
      if (productName.name == name && productName.mrp == mrp) {
        return res.status(400).json({
          success: false,
          msg: `Product Already exists`,
          product: productName,
        });
      }
    }
    const newProduct = await Product.create({
      name,
      barcode,
      mrp,
      costPrice,
      retailPrice,
      wholesalePrice,
      measuring,
      stock,
      packet,
      box,
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
    const products = await Product.find().sort({ name: 1, mrp: 1 });
    return res.status(200).json({
      success: true,
      msg: "These are the products",
      data: products,
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

export const updateInventoryRequest = async (req, res) => {
  const { name, barcode, mrp, costPrice, stock, wholesalePrice, retailPrice } =
    req.body;
  try {
    const filter = { barcode };
    const updateProduct = await UpdateProducts.findOne(filter);
    if (updateProduct) {
      return res.status(404).json({
        msg: `Product is already sent for verfication from the admin`,
        updateProduct,
      });
    }
    if (name) {
      const filter = { name, mrp }; // Filter to find the product
      const update = {};
      if (stock !== undefined) {
        update.stock = stock;
      }
      if (costPrice !== undefined) {
        update.costPrice = costPrice;
      }
      if (wholesalePrice !== undefined) {
        update.wholesalePrice = wholesalePrice;
      }
      if (retailPrice !== undefined) {
        update.retailPrice = retailPrice;
      }
      if (mrp !== undefined) {
        update.mrp = mrp;
      }
      // Use findOneAndUpdate to find and update the product
      const product = await Product.findOne(filter);
      if (product) {
        const updatedProduct = await UpdateProducts.create({
          box: product.box,
          packet: product.box,
          name: product.name,
          barcode: product.barcode,
          costPrice: product.costPrice,
          wholesalePrice: product.wholesalePrice,
          mrp: product.mrp,
          retailPrice: product.retailPrice,
          measuring: product.measuring,
          stock: product.stock,
          ...update,
        });

        return res.status(201).json({
          updatedProduct,
          msg: `Your product has been sent to admin for verification of updating `,
        });
      }
    }
    if (barcode) {
      const filter = { barcode }; // Filter to find the product

      const update = {};
      if (stock !== undefined) {
        update.stock = stock;
      }
      if (costPrice !== undefined) {
        update.costPrice = costPrice;
      }
      if (wholesalePrice !== undefined) {
        update.wholesalePrice = wholesalePrice;
      }
      if (retailPrice !== undefined) {
        update.retailPrice = retailPrice;
      }
      if (mrp !== undefined) {
        update.mrp = mrp;
      }

      const product = await Product.findOne(filter);
      console.log(product);
      if (product) {
        const updatedProduct = await UpdateProducts.create({
          box: product.box,
          packet: product.box,
          name: product.name,
          barcode: product.barcode,
          costPrice: product.costPrice,
          wholesalePrice: product.wholesalePrice,
          mrp: product.mrp,
          retailPrice: product.retailPrice,
          measuring: product.measuring,
          stock: product.stock,
          ...update,
        });

        return res.status(201).json({
          updatedProduct,
          msg: `Your product has been sent to admin for verification of updating `,
        });
      }
    }

    return res.status(404).json({
      success: false,
      msg: "No product found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal Error from the server",
      error: error.message,
    });
  }
};