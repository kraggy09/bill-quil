import express from "express";
import { createBill, getBillDetails } from "../controllers/Bill.js";

const router = express.Router();

router.route("/createBill").post(createBill);
router.route("/getBillDetails").get(getBillDetails);

export default router;
