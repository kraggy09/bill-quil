import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { AiOutlinePlus } from "react-icons/ai";
import { calculateDate, calculateTime } from "../libs/constant";
import { Link } from "react-router-dom";

const DashBoardPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(startDate.getDate() - 30);
  const [loading, setLoading] = useState(false);
  const [dataObj, setDataObj] = useState(null);
  const daily = useSelector((store) => store.report.report);
  console.log(dataObj);
  const [report, setReport] = useState(null);

  useEffect(() => {
    setReport(daily);
  }, [daily]);

  useEffect(() => {
    if (report) {
      const temp = report.bills.reduce((billAmount, currentBill) => {
        const billAmount1 = currentBill.items.reduce((ac, item) => {
          return ac + item.total;
        }, 0);

        return billAmount + billAmount1;
      }, 0);

      setDataObj({ ...dataObj, billAmount: temp });
      console.log(temp);

      const transTemp = report.transactions.reduce(
        (transAmount, currentTrans) => {
          const transAmoount1 = currentTrans.amount;
          return transAmount + transAmoount1;
        },
        0
      );
      setDataObj({ ...dataObj, transAmount: transTemp });
    }
  }, [report]);

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold text-center my-3 min-w-[85vw]">
          Hello, Sultan Communcation & General Stores
          {/* {calculateDate(new Date())} {time} */}
        </h1>
        <h1 className="text-xl  font-bold text-center my-6  min-w-[85vw]">
          <span className="bg-green-500 italic font-semibold  px-6 text-white py-2 rounded-xl">
            Get the Report Here Of Your Business
          </span>
        </h1>
      </div>
      <Link to={"/newbill"}>
        <button className="rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
          <AiOutlinePlus className="text-2xl text-white font-extrabold" />
        </button>
      </Link>
    </div>
  );
};

export default DashBoardPage;
