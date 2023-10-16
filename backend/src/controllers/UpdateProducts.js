import Product from "../models/Product.js";
import UpdateProducts from "../models/UpdateProducts.js";

export const updateInventory = async (req, res) => {
  try {
    const allProducts = await UpdateProducts.find();
    console.log(allProducts);

    if (allProducts.length == 0) {
      return res.status(404).json({
        success: false,
        msg: `No prodct is found for updating`,
      });
    }
    const updatedProducts = [];

    await Promise.all(
      allProducts.map(async (updateProduct) => {
        let filter = {};
        let update = {};

        filter = { barcode: updateProduct.barcode };

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

        // Delete the processed updateProduct
        await UpdateProducts.findOneAndDelete({
          barcode: updateProduct.barcode,
        });
      })
    );

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
