import express from "express";
import {
  createNewPayment,
  createNewTransaction,
} from "../controllers/Transaction.js";

const router = express.Router();

router.route("/createTransation").post(createNewTransaction);
router.route("/createPayment").post(createNewPayment);

export default router;
