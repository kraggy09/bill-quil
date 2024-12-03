import express from "express";
import {
  approveTransaction,
  createNewPayment,
  createNewTransaction,
  rejectTransaction,
  getAllTransactions,
  getLatestTransactionId,
} from "../controllers/Transaction.js";

const router = express.Router();

router.route("/createTransation").post(createNewTransaction);
router.route("/createPayment").post(createNewPayment);
router.route("/getTransactionForApproval").get(getAllTransactions);
router.route("/approveTransaction").post(approveTransaction);
router.route("/rejectTransaction").post(rejectTransaction);
router.route("/getLatestTransactionId").get(getLatestTransactionId);

export default router;
