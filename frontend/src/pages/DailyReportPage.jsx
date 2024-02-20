import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import toast from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

axios.defaults.withCredentials = true;
import { apiUrl } from "../constant";
import Loading from "../components/Loading";
import { FaPercentage } from "react-icons/fa";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { calculateDate, calculateTime } from "../libs/constant";
import BillStrap from "../components/BillStrap";

const DailyReportPage = () => {
  const daily = useSelector((store) => store.report.report);
  const user = useSelector((store) => store.user);
  const [type, setType] = useState("bills");
  const [dataObj, setDataObj] = useState(null);

  // console.log(dataObj);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);
  const [show, setShow] = useState(false);
  // console.log("StartDate", startDate);
  // console.log(endDate);

  const apiUrl1 = "/dailyReportOfDays";
  // console.log(apiUrl + apiUrl1);

  const getBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl + apiUrl1, {
        params: {
          startDate,
          endDate,
        },
      });
      if (res) {
        const temp = res.data;
        // console.log("Data", temp);
        setDailyReport(temp.newDaily);
        // toast.success(`Bills Found Successfully`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Error while getting bills", startDate);
      setLoading(false);
    }
  };
  const handleSubmit = () => {
    getBills();
  };
  // console.log(dailyReport);
  useEffect(() => {
    if (daily) {
      setDailyReport(daily);
    }
  }, [daily]);

  // console.log(dataObj);
  useEffect(() => {
    if (dailyReport) {
      let temp = dailyReport.bills.reduce(
        (acc, currentBill) => {
          const temp = currentBill.items.reduce(
            (ac, item) => {
              return {
                billAmount: ac.billAmount + (item.total ?? 0),
                investment:
                  ac.investment +
                  (item.quantity ?? 0) * (item.product?.costPrice ?? 0),
              };
            },
            { billAmount: 0, investment: 0 }
          );

          const payment = currentBill.payment || 0;
          return {
            totalBillAmount: acc.totalBillAmount + temp.billAmount,
            totalPayment: acc.totalPayment + payment,
            totalInvestment: acc.totalInvestment + temp.investment,
          };
        },
        { totalBillAmount: 0, totalPayment: 0, totalInvestment: 0 }
      );

      let totalPayment = dailyReport.transactions.reduce((ac, item) => {
        return ac + (item.taken === false ? item.amount : 0);
      }, 0);

      // Apply optional chaining and nullish coalescing for totalPayment as well
      totalPayment = totalPayment ?? 0;

      const newDataObj = { ...temp, totalPayment };
      setDataObj(newDataObj);
    }
  }, [dailyReport]);

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold text-center my-3">
          Get the complete details here
        </h1>
      </div>
      {user.isAdmin && show && (
        <article className="flex min-w-full items-center justify-center my-6">
          <div className="min-w-[150px] min-h-[70px] border-2 border-green-500 bg-green-300  rounded-3xl text-3xl font-bold text-green-900 flex items-center justify-center shadow-lg px-6 mx-6 ">
            <FaIndianRupeeSign className="mx-1 font-extrabold" />
            {dataObj &&
              (dataObj.totalBillAmount - dataObj.totalInvestment).toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-green-500 bg-green-200 rounded-3xl text-3xl font-bold text-green-800 flex items-center justify-center px-6 ">
            <AiOutlineArrowDown className="mx-1 font-extrabold" />₹
            {dataObj && dataObj.totalPayment.toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-red-500 rounded-3xl text-3xl font-bold text-red-800 flex items-center justify-center px-6 bg-red-200">
            <AiOutlineArrowUp className="mx-1 font-extrabold" />₹
            {dataObj && dataObj.totalBillAmount.toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-yellow-300 rounded-3xl text-3xl font-bold text-yellow-700 flex items-center justify-center px-6 bg-yellow-200">
            <FaPercentage className="mx-1 font-extrabold" />
            {dataObj &&
              (
                ((dataObj.totalBillAmount - dataObj.totalInvestment) /
                  dataObj.totalBillAmount) *
                100
              ).toFixed(1)}
          </div>
        </article>
      )}
      {user.isAdmin && (
        <div
          className="flex text-2xl min-w-full items-center justify-center"
          onClick={() => setShow((prev) => !prev)}
        >
          {!show ? (
            <FaEye className="hover:text-green-500 hover:cursor-pointer" />
          ) : (
            <FaEyeSlash className="hover:text-red-500 hover:cursor-pointer" />
          )}
        </div>
      )}
      <div className="flex min-w-[50vw] my-3 justify-around">
        <span className="flex items-center justify-center text-xl">
          <p className="mr-3">Start Date: </p>
          <input
            type="date"
            className="bg-gray-300 px-3 rounded-xl hover:cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </span>
        <span className="flex items-center justify-center text-xl">
          <p className="mr-3">End Date:</p>
          <input
            type="date"
            className="bg-gray-300 px-3 rounded-xl hover:cursor-pointer"
            value={endDate}
            onChange={(e) => {
              // console.log(e.target.value);
              setEndDate(e.target.value);
            }}
          />
        </span>
        <button
          className="bg-green-500 p-3 text-2xl font-semibold  rounded-xl text-white"
          onClick={() => handleSubmit()}
        >
          Get the bills
        </button>
      </div>
      <div className="min-w-[90vw] flex my-6 justify-center">
        <div className="flex rounded-full   border-2">
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
          <div
            onClick={() => {
              setType("payment");
            }}
            className={`min-w-[160px] hover:cursor-pointer rounded-full flex items-center justify-center px-3 mx-auto text-xl font-bold py-2 ${
              type === "payment"
                ? "bg-green-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Payment
          </div>
          {dailyReport && dailyReport.updatedToday && (
            <div
              onClick={() => {
                setType("updatedProduct");
              }}
              className={`min-w-[160px] hover:cursor-pointer rounded-full flex items-center justify-center px-3 mx-auto text-xl font-bold py-2 ${
                type === "updatedProduct"
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              Updated
            </div>
          )}
        </div>
      </div>
      <div className="min-w-[90vw] mb-16 ml-24 flex items-center justify-center">
        {type === "bills" ? (
          <table className="table-auto border-spacing-x-60 text-2xl border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black">Time</th>
                <th className="border border-black">Bill Id</th>
                <th className="border border-black px-0">Bill Amount</th>
                <th className="border border-black px-6">Outstanding</th>
                <th className="border border-black px-6">Payment</th>
                <th className="border border-black">Total</th>
                <th className="border border-black">View</th>
              </tr>
            </thead>
            <tbody>
              {dailyReport &&
                [...dailyReport.bills].reverse().map((bill) => {
                  return <BillStrap key={bill._id} bill={bill} />;
                })}
            </tbody>
          </table>
        ) : type === "transaction" ? (
          <table className="table-auto border-spacing-16 text-2xl border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black">Time</th>
                <th className="border border-black px-0">
                  Previous Outstanding
                </th>
                <th className="border border-black px-6">Payment</th>
                <th className="border border-black px-6">New Outanding</th>
              </tr>
            </thead>
            <tbody>
              {dailyReport &&
                [...dailyReport.transactions].reverse().map((transaction) => {
                  return (
                    !transaction.taken && (
                      <tr className="text-xl" key={transaction._id}>
                        <td className="px-16 py-3 font-semibold">
                          {calculateDate(new Date(transaction.createdAt))}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {calculateTime(new Date(transaction.createdAt))}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {transaction.previousOutstanding || 0}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {transaction.amount}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {transaction.newOutstanding || 0}{" "}
                        </td>
                      </tr>
                    )
                  );
                })}
            </tbody>
          </table>
        ) : type === "updatedProduct" ? (
          <table className="table-auto border-spacing-16 text-2xl border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black mx-6">Time</th>
                <th className="border border-black">Product</th>
                <th className="border border-black px-0">Previous Quantity</th>
                <th className="border border-black px-6">Purchased</th>
                <th className="border border-black px-6">New Quantity</th>
              </tr>
            </thead>
            <tbody>
              {dailyReport &&
                dailyReport.updatedToday &&
                [...dailyReport.updatedToday].reverse().map((updated) => {
                  return (
                    <tr className="text-xl" key={updated._id}>
                      {updated.createdAt && (
                        <td className="px-16 py-3 font-semibold">
                          {calculateDate(new Date(updated.createdAt))}
                        </td>
                      )}
                      {updated.createdAt && (
                        <td className="px-16 py-3 font-semibold">
                          {calculateTime(new Date(updated.createdAt))}
                        </td>
                      )}
                      <td className="px-16 py-3 capitalize font-semibold">
                        {updated.product && updated.product.name}
                      </td>
                      <td className="px-16 py-3 font-semibold">
                        {updated.previousQuantity % 1 != 0
                          ? updated.previousQuantity.toFixed(3)
                          : updated.previousQuantity}
                      </td>
                      <td className="px-16 py-3 font-semibold">
                        {updated.quantity}{" "}
                      </td>
                      <td className="px-16 py-3 font-semibold">
                        {(updated.quantity + updated.previousQuantity) % 1 == 0
                          ? updated.quantity + updated.previousQuantity
                          : (
                              updated.quantity + updated.previousQuantity
                            ).toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <table className="table-auto border-spacing-16 text-2xl border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black mx-6">Time</th>
                <th className="border border-black">Party Name</th>
                <th className="border border-black px-0">Payment ₹</th>
              </tr>
            </thead>
            <tbody>
              {dailyReport &&
                [...dailyReport.transactions].reverse().map((transaction) => {
                  return (
                    transaction.taken && (
                      <tr className="text-xl" key={transaction._id}>
                        <td className="px-16 py-3 font-semibold">
                          {calculateDate(new Date(transaction.createdAt))}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {calculateTime(new Date(transaction.createdAt))}
                        </td>
                        <td className="px-16 py-3 capitalize font-semibold">
                          {transaction.name}
                        </td>
                        <td className="px-16 py-3 font-semibold">
                          {transaction.amount}
                        </td>
                      </tr>
                    )
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default DailyReportPage;
