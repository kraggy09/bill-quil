import express from "express";
import { updateInventory } from "../controllers/UpdateProducts.js";

const router = express.Router();

router.route("/update").post(updateInventory);

export default router;
