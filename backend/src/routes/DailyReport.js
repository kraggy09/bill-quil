import express from "express";
import { getDailyReport } from "../controllers/DailyReport.js";

const router = express.Router();

router.route("/dailyReport").get(getDailyReport);

export default router;
