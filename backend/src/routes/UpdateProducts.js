import express from "express";
import {
  acceptAllInventoryRequest,
  acceptInventoryRequest,
  getInventoryUpdateRequest,
  rejectInventoryRequest,
  updateInventoryRequest,
} from "../controllers/UpdateProducts.js";

const router = express.Router();

router.route("/products/updateInventoryRequest").post(updateInventoryRequest);
router.route("/products/acceptInventoryRequest").post(acceptInventoryRequest);
router.route("/products/requests").get(getInventoryUpdateRequest);
router.route("/products/deleteInventoryRequest").delete(rejectInventoryRequest);
router
  .route("/products/updateAllInventroryRequests")
  .post(acceptAllInventoryRequest);

export default router;
