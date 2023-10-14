import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";

export const updateInventory = async (req, res) => {
  try {
    const allProducts = await UpdateProducts.find();
    const updatedProducts = [];

    for (const updateProduct of allProducts) {
      let filter = {};
      let update = {};

      if (updateProduct.name) {
        filter = { name: updateProduct.name, mrp: updateProduct.mrp };
      } else if (updateProduct.barcode) {
        filter = { barcode: updateProduct.barcode };
      }

      if (updateProduct.stock !== undefined) {
        update.stock = updateProduct.stock;
      }
      if (updateProduct.costPrice !== undefined) {
        update.costPrice = updateProduct.costPrice;
      }
      if (updateProduct.wholesalePrice !== undefined) {
        update.wholesalePrice = updateProduct.wholesalePrice;
      }
      if (updateProduct.retailPrice !== undefined) {
        update.retailPrice = updateProduct.retailPrice;
      }

      const updatedProduct = await Product.findOneAndUpdate(filter, update, {
        new: true,
      });

      if (updatedProduct) {
        updatedProducts.push(updatedProduct);
      }
    }

    return res.status(200).json({
      success: true,
      msg: "Products updated successfully",
      data: updatedProducts,
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
