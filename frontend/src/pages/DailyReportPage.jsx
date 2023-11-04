import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../store/store";
const DailyReportPage = () => {
  const daily = useSelector((store) => store.report.report);
  console.log(daily);
  return (
    <div className="flex">
      <div className="flex flex-col">
        {daily &&
          daily.transactions.map((trans) => {
            return (
              <span
                className={`${
                  trans.taken == false ? "bg-green-500" : "bg-red-500"
                }`}
                key={trans._id}
              >
                {trans.amount}
              </span>
            );
          })}
      </div>
      <div className="flex flex-col">
        {daily &&
          daily.bills.map((bill) => {
            return (
              <span className="bg-red-500" key={bill._id}>
                {bill.total}
              </span>
            );
          })}
      </div>
    </div>
  );
};

export default DailyReportPage;
