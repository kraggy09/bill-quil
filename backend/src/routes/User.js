import express from "express";
import { register } from "../controllers/User.js";

const router = express.Router();

router.route("/login").post();
router.route("/register").post(register);

export default router;
