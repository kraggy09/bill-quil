import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const DailyReportPage = () => {
  const [type, setType] = useState("bills");

  // {const calculateTransactionTotal = () => {

  //   if (daily && daily.transactions.length > 0) {
  //     daily.transactions.reduce((accumulator, trans) => {
  //       return accumulator + trans.amount;
  //     });
  //   }
  // };}
  // useEffect(() => {
  //   const total = calculateTransactionTotal();
  //   setTransactionAmount(total);
  // }, []);

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold text-center my-3">
          Get the complete details here
        </h1>
      </div>
      <div className="min-w-[90vw] flex my-6 justify-center">
        <div className="flex rounded-full  max-w-[320px] border-2">
          <div
            onClick={() => {
              setType("bills");
            }}
            className={`min-w-[150px] hover:cursor-pointer rounded-full px-3 mx-auto flex items-center justify-center text-xl font-bold  py-2 ${
              type === "bills"
                ? "bg-green-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Bills
          </div>
          <div
            onClick={() => {
              setType("transaction");
            }}
            className={`min-w-[160px] hover:cursor-pointer rounded-full flex items-center justify-center px-3 mx-auto text-xl font-bold py-2 ${
              type === "transaction"
                ? "bg-green-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Transactions
          </div>
        </div>
      </div>
      <div>{type === "bills" ? "Bills" : "Transactions"}</div>
    </div>
  );
};

export default DailyReportPage;
