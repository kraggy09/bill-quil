import express from "express";
import {
  createBill,
  getAllBillsOfToday,
  getBillDetails,
} from "../controllers/Bill.js";

const router = express.Router();

router.route("/createBill").post(createBill);
router.route("/getBillDetails").get(getBillDetails);
router.route("/getAllBills").get(getAllBillsOfToday);

export default router;
