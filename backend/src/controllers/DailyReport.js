import getDate from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";

export const getDailyReport = async (req, res) => {
  try {
    const date = getDate(); // You should define the 'getDate' function or use a valid date here

    // Use await to make the code cleaner and handle async operations
    const dailyReport = await DailyReport.find({ date })
      .populate("bills")
      .populate("transactions")
      .exec();

    if (!dailyReport) {
      return res.status(404).json({
        msg: "Daily Reports not found",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Daily Reports found",
      success: true,
      dailyReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error fetching daily reports",
      success: false,
      error: error.message,
    });
  }
};
