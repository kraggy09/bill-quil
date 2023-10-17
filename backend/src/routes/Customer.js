import express from "express";
import { createNewCustomer } from "../controllers/Customer.js";

const router = express.Router();

router.route("/newCustomer").post(createNewCustomer);

export default router;
