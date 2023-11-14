import express from "express";
import {
  createNewCustomer,
  getAllCustomers,
  getSingleCustomer,
} from "../controllers/Customer.js";

const router = express.Router();

router.route("/newCustomer").post(createNewCustomer);
router.route("/getAllCustomers").get(getAllCustomers);
router.route("/getCustomer/:customerId").get(getSingleCustomer);

export default router;
