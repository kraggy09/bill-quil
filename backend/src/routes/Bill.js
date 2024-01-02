import express from "express";
import {
  createBill,
  getAllBillsOfToday,
  getBillDetails,
  getLatestBillId,
} from "../controllers/Bill.js";

const router = express.Router();

router.route("/createBill").post(createBill);
router.route("/getBillDetails").get(getBillDetails);
router.route("/getAllBills").get(getAllBillsOfToday);
router.route("/getLatestBillId").get(getLatestBillId);

export default router;
