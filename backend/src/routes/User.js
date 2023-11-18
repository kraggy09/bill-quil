import express from "express";
import {
  checkAuthentication,
  login,
  register,
  verifyToken,
} from "../controllers/User.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/checkAuth").get(verifyToken, checkAuthentication);

export default router;
