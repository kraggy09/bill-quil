import express from "express";
import { createBill } from "../controllers/Bill.js";

const router = express.Router();

router.route("createBill").post(createBill);

export default router;
