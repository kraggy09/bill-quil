import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

export const getAdminData = async (req, res) => {
  try {
    let date = new Date();
    let { days } = req.body;

    // Define date ranges
    const startCurrent = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    startCurrent.setHours(0, 0, 0, 0);

    const endCurrent = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000);
    endCurrent.setHours(23, 59, 59, 999);

    const startPrevious = new Date(
      date.getTime() - days * 2 * 24 * 60 * 60 * 1000
    );
    startPrevious.setHours(0, 0, 0, 0);

    const endPrevious = new Date(
      date.getTime() - (days + 1) * 24 * 60 * 60 * 1000
    );
    endPrevious.setHours(23, 59, 59, 999);

    // Helper function for aggregations
    const aggregateSales = (start, end) => {
      return Bill.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $addFields: {
            BillTotal: {
              $sum: "$items.total", // Sum the total of all items in each document
            },
          },
        },
        {
          $group: {
            _id: "", // Group by empty string to get overall total
            overallSales: {
              $sum: "$BillTotal",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
    };

    // Helper function for transaction aggregations
    const aggregateTransactions = (start, end, taken = false) => {
      return Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
            taken: taken,
          },
        },
        {
          $group: {
            _id: "",
            overallPayment: {
              $sum: "$amount",
            },
          },
        },
      ]);
    };

    // Current and Previous Sales Aggregations
    let [totalCurrSales, totalPreviousSales] = await Promise.all([
      aggregateSales(startCurrent, endCurrent),
      aggregateSales(startPrevious, endPrevious),
    ]);

    // Current and Previous Transactions Aggregations
    let [currentTransactions, previousTransaction] = await Promise.all([
      aggregateTransactions(startCurrent, endCurrent),
      aggregateTransactions(startPrevious, endPrevious),
    ]);

    // Daily sales
    let sales = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startCurrent,
            $lte: endCurrent,
          },
        },
      },
      {
        $addFields: {
          dateOnly: {
            $dateToString: {
              format: "%m-%d-%Y",
              date: "$date",
            },
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$dateOnly",
          totalAmount: {
            $sum: "$items.total",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Daily transactions
    let trans = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startCurrent,
            $lte: endCurrent,
          },
          taken: false,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%m-%d-%Y", date: "$createdAt" },
          },
          totalTrans: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    let outstanding = await Customer.aggregate([
      {
        $group: {
          _id: "",
          cash: {
            $sum: "$outstanding",
          },
        },
      },
    ]);

    // Send the aggregated data as response
    return res.status(200).json({
      totalCurrSales,
      totalPreviousSales,
      currentTransactions,
      previousTransaction,
      sales,
      trans,
      outstanding: outstanding[0].cash,
    });
  } catch (error) {
    console.error("Error in getAdminData: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
