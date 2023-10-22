import express from "express";
import {
  createNewProduct,
  deleteProduct,
  getAllproduct,
  getProduct,
  updateInventoryRequest,
  updateProductDetails,
  updateStock,
  // updateInventory,
} from "../controllers/Product.js";

const router = express.Router();

router.route("/products/newItem").post(createNewProduct);
router.route("/product").get(getProduct);
router.route("/products").get(getAllproduct);
router.route("/products/delete").delete(deleteProduct);
router.route("/products/updateRequest").post(updateInventoryRequest);
router.route("/products/updateProduct").post(updateProductDetails);
router.route("/products/updateStock").post(updateStock);

export default router;
