import express from "express";
import { checkAdmin, checkAuth, login, register } from "../controllers/User.js";
import { getAdminData } from "../controllers/Admin.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/verifyAuth").post(checkAuth);
router.route("/getAdminData").post(checkAdmin, getAdminData);

export default router;
