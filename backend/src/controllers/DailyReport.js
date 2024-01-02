import getDate, { getCurrentDateOfUser } from "../config/getDate.js";
import DailyReport from "../models/DailyReport.js";

export const getDailyReport = async (req, res) => {
  try {
    const date = getDate();

    const dailyReport = await DailyReport.find({ date })
      .populate({
        path: "bills",
        populate: {
          path: "items.product",
          path: "id",
        },
      })
      .populate("transactions")
      .populate({
        path: "updatedToday.product",
        model: "Product",
      })
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

export const getDailyReportOfDays = async (req, res) => {
  const { startDate, endDate } = req.query;
  // console.log(startDate, endDate);
  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    // console.log(start);
    const end = new Date(endDate);
    // console.log(end);
    end.setHours(23, 59, 59, 59);
    const dailyReport = await DailyReport.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .populate({
        path: "bills",
        populate: {
          path: "items.product",
          path: "id",
        },
      })
      .populate("transactions")
      .populate({
        path: "updatedToday.product",
        model: "Product",
      })
      .exec();

    const newDaily = {
      bills: [],
      transactions: [],
      updatedToday: [],
    };

    for (const daily of dailyReport) {
      for (const bill of daily.bills) {
        newDaily.bills.push(bill);
      }
      for (const transaction of daily.transactions) {
        newDaily.transactions.push(transaction);
      }
      for (const updatedToday of daily.updatedToday) {
        newDaily.updatedToday.push(updatedToday);
      }
    }

    if (!dailyReport || dailyReport.length == 0) {
      return res.status(404).json({
        data: "You messed up",
        msg: "Daily Reports not found",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Daily Reports found",
      success: true,
      dailyReport,
      newDaily,
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
