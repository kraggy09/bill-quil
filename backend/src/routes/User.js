import express from "express";
import { checkAuth, login, register } from "../controllers/User.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/verifyAuth").post(checkAuth);

export default router;
