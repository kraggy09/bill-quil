import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { apiUrl } from "../constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { AiOutlineArrowUp } from "react-icons/ai";
import { FaPercentage } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import BillStrap from "../components/BillStrap";
const apiUrl1 = "/getAllBills";

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dataObj, setDataObj] = useState(null);
  const daily = useSelector((store) => store.report.report);
  const user = useSelector((store) => store.user);

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
        console.log("Data", temp);
        setBills(temp.bills);
        toast.success(`Bills Found Successfully`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while getting bills", startDate);
      setLoading(false);
    }
  };

  useEffect(() => {
    let temp =
      bills &&
      bills.reduce(
        (acc, currentBill) => {
          const temp = currentBill.items.reduce(
            (ac, item) => {
              if (item.product?.costPrice === undefined) {
                console.log(
                  `Item without product.costPrice in bill ID ${currentBill._id},total:${currentBill.total}`
                );
              }

              return {
                billAmount: ac.billAmount + item.total,
                investment:
                  ac.investment +
                  item.quantity * (item.product?.costPrice ?? 0),
              };
            },
            { billAmount: 0, investment: 0 }
          );

          const payment = currentBill.payment ?? 0;
          if (currentBill._id === undefined) {
            console.log("Bill without _id");
          }

          return {
            totalBillAmount: acc.totalBillAmount + temp.billAmount,
            totalPayment: acc.totalPayment + payment,
            totalInvestment: acc.totalInvestment + temp.investment,
          };
        },
        { totalBillAmount: 0, totalPayment: 0, totalInvestment: 0 }
      );

    // Optional chaining check for setDataObj
    setDataObj(
      temp ?? { totalBillAmount: 0, totalPayment: 0, totalInvestment: 0 }
    );

    console.log(temp);
  }, [bills]);

  useEffect(() => {
    if (daily) {
      setBills(daily.bills);
    }
  }, [daily]);

  const handleSubmit = () => {
    getBills();
  };

  return (
    <div>
      <header className="ml-9">
        <p className="text-2xl text-center my-3 font-bold">
          Search the bills here
        </p>
        <div className="flex min-w-[90vw] my-3 justify-around">
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
            className="bg-green-500 p-2 font-semibold text-xl rounded-xl text-white"
            onClick={() => handleSubmit()}
          >
            Get the bills
          </button>
        </div>
      </header>
      {user.isAdmin && (
        <article className="flex min-w-full items-center justify-center my-6">
          <div className="min-w-[150px] min-h-[70px] border-2 border-green-500 rounded-3xl text-3xl font-bold text-green-900 flex items-center justify-center  px-6 mx-6 bg-green-200 ">
            <FaIndianRupeeSign className="mx-1 font-extrabold" />
            {dataObj &&
              (dataObj.totalBillAmount - dataObj.totalInvestment).toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-red-500 rounded-3xl text-3xl font-bold text-red-900 flex items-center justify-center px-6 bg-red-200">
            <AiOutlineArrowUp className="mx-1 font-extrabold" />₹
            {dataObj && dataObj.totalBillAmount.toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-yellow-300 rounded-3xl text-3xl font-bold text-yellow-800 flex items-center justify-center px-6 bg-yellow-200">
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
      <main className="min-w-[90vw] flex items-center justify-center">
        {
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
              {bills &&
                [...bills].reverse().map((bill) => {
                  return <BillStrap key={bill._id} bill={bill} />;
                })}
            </tbody>
          </table>
        }
      </main>
      {loading && <Loading />}
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default BillPage;
