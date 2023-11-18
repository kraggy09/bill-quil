import express from "express";
import {
  getDailyReport,
  getDailyReportOfDays,
} from "../controllers/DailyReport.js";

const router = express.Router();

router.route("/dailyReport").get(getDailyReport);
router.route("/dailyReportOfDays").get(getDailyReportOfDays);

export default router;
