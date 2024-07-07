import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Area,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaLock } from "react-icons/fa";

import InventoryRequest from "../components/InventoryRequest";
import axios from "axios";
import { useSelector } from "react-redux";
import { apiUrl } from "../constant";

const DashBoardPage = () => {
  let user = useSelector((store) => store.user);
  let [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const [mergedData, setMergeData] = useState(null);
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "b" || event.key === "B") {
        const linkButton = document.getElementById("newBillLink");
        if (linkButton) {
          linkButton.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  useEffect(() => {
    fetchData();
  }, [days]);

  async function fetchData() {
    let token = localStorage.getItem("token");

    let res = await axios.post(apiUrl + "/getAdminData", {
      token: token,
      days: days,
    });
    setData(res.data);
    // console.log(res.data);
  }

  const getIncrease = (curr, prev) => {
    let a = data && ((curr - prev) / prev) * 100;
    // console.log(a);
    return a;
  };

  useEffect(() => {
    const mergedData =
      data &&
      data.sales.map((sale) => {
        const trans = data.trans.find((tran) => tran._id === sale._id);
        return {
          date: sale._id,
          totalAmount: sale.totalAmount,
          totalTrans: trans ? trans.totalTrans : 0,
        };
      });
    setMergeData(mergedData);
  }, [data]);

  return (
    <main className="md:pl-24 bg-gray-200 flex flex-col min-w-[100vw]">
      <ToastContainer autoClose={2000} />
      {!locked && (
        <article className="min-h-[25vh] ">
          <div className="flex items-center gap-3 md:flex-row flex-col justify-center md:justify-between w-full pt-6">
            <div className="shadow-2xl gap-y-2  rounded-lg px-4 bg-white  flex items-center justify-center max-w-[100%] md:min-w-[30%] h-36">
              <div className="flex flex-col gap-y-2">
                <p className="font-bold">Total Sales</p>
                <div>
                  <span className="text-2xl font-semibold">
                    ₹{data && data.totalCurrSales[0].overallSales}
                  </span>
                  {data && (
                    <span
                      className={`${
                        getIncrease(
                          data.totalCurrSales[0].overallSales,
                          data.totalPreviousSales[0].overallSales
                        ) > 0
                          ? "bg-green-300 text-green-800"
                          : "bg-red-200 text-red-800"
                      } text-[12px] px-2 py-[2px] rounded-md font-semibold ml-3`}
                    >
                      {getIncrease(
                        data.totalCurrSales[0].overallSales,
                        data.totalPreviousSales[0].overallSales
                      ) > 0 && "+"}
                      {getIncrease(
                        data.totalCurrSales[0].overallSales,
                        data.totalPreviousSales[0].overallSales
                      ).toFixed(2)}
                      %
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  Compared to last month
                </span>
              </div>
              <ResponsiveContainer
                className="hidden xl:block"
                width={"55%"}
                height={100}
              >
                <AreaChart
                  width={200}
                  height={200}
                  data={data?.sales}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="shadow-2xl gap-y-2  rounded-lg px-4 bg-white  flex items-center justify-center max-w-[100%] md:min-w-[30%] h-36">
              <div className="flex flex-col gap-y-2">
                <p className="font-bold">Total Payment</p>
                <div>
                  <span className="text-2xl font-semibold">
                    ₹
                    {data &&
                      data.currentTransactions[0].overallPayment.toFixed(2)}
                  </span>
                  {data && (
                    <span
                      className={`${
                        getIncrease(
                          data.currentTransactions[0].overallPayment,
                          data.previousTransaction[0].overallPayment
                        ) > 0
                          ? "bg-green-300 text-green-800"
                          : "bg-red-200 text-red-800"
                      } text-[12px] px-2 py-[2px] rounded-md font-semibold ml-3`}
                    >
                      {getIncrease(
                        data.currentTransactions[0].overallPayment,
                        data.previousTransaction[0].overallPayment
                      ) > 0 && "+"}
                      {getIncrease(
                        data.currentTransactions[0].overallPayment,
                        data.previousTransaction[0].overallPayment
                      ).toFixed(2)}
                      %
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  Compared to last month
                </span>
              </div>
              <ResponsiveContainer
                className="hidden xl:block"
                width={"55%"}
                height={100}
              >
                <AreaChart
                  width={200}
                  height={200}
                  data={data?.trans}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalTrans"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="shadow-2xl gap-y-2  rounded-lg px-4 bg-white  flex items-center justify-center max-w-[100%] md:min-w-[30%] h-36">
              <div className="flex flex-col gap-y-2">
                <p className="font-bold">Total Outstanding</p>
                <div>
                  <span className="text-2xl font-semibold">
                    ₹{data && data.outstanding}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Compared to last month
                </span>
              </div>
              <ResponsiveContainer
                className="hidden xl:block"
                width={"55%"}
                height={100}
              >
                <AreaChart
                  width={200}
                  height={200}
                  data={data?.trans}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalTrans"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      )}
      {locked && (
        <div className="min-h-[65vh]  flex items-center justify-center">
          <div className="min-w-[50%] min-h-[70%] bg-white rounded-lg">
            <h1 className="text-xl capitalize text-center py-2">
              Hello,{" "}
              <span className="bg-green-300 text-green-800 px-2 py-1 rounded-lg hover:cursor-pointer">
                {user && user.username}
              </span>
            </h1>
            {user && user.isAdmin && (
              <>
                {" "}
                <h2 className="text-center px-6 py-2">
                  Please enter your pin to get the details
                </h2>
                <form
                  className="flex items-center justify-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pin === user.pin) {
                      setLocked(false);
                    }
                  }}
                >
                  <div className="flex flex-col justify-end items-end gap-y-6 my-6 ">
                    <div className="flex items-center ">
                      <label htmlFor="">
                        <FaLock size={40} />
                      </label>
                      <input
                        value={pin}
                        onChange={(e) => {
                          let t = e.target.value;
                          setPin(t);
                        }}
                        className="border border-t-0 border-x-0 ml-6 max-w-[150px] md:max-w-[250px]  text-xl border-b-2 outline-none pl-6"
                        type="password"
                      />
                    </div>
                    <button className="px-3 py-2 rounded-lg bg-green-200 text-green-800 font-bold">
                      {" "}
                      Check
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <div className="xl:max-w-[66%] w-[100%]  max-h-[75vh] flex-col  items-start flex">
        {!locked && (
          <div className="my-3 bg-white rounded-lg  h-[40vh] min-w-full xl:min-w-[62vw] md:px-6 ">
            <div className="h-[40vh]">
              <div className="min-w-full flex items-center justify-between">
                <h1 className="text-xl font-bold my-1">Last 30 days</h1>
                <div className="flex gap-x-3">
                  <span
                    onClick={() => {
                      setDays(7);
                    }}
                    className={`${
                      days == 7 ? "bg-green-200 text-green-800" : "bg-gray-200"
                    } px-2 py-1 rounded-lg hover:cursor-pointer`}
                  >
                    7d
                  </span>
                  <span
                    onClick={() => {
                      setDays(15);
                    }}
                    className={`${
                      days == 15 ? "bg-green-200 text-green-800" : "bg-gray-200"
                    } px-2 py-1 rounded-lg hover:cursor-pointer`}
                  >
                    15d
                  </span>
                  <span
                    onClick={() => {
                      setDays(30);
                    }}
                    className={`${
                      days == 30 ? "bg-green-200 text-green-800" : "bg-gray-200"
                    } px-2 py-1 rounded-lg hover:cursor-pointer`}
                  >
                    30d
                  </span>
                </div>
              </div>
              <ResponsiveContainer className="" height="90%" width={"100%"}>
                <AreaChart
                  data={mergedData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="2" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalTrans"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="shadow-2xl min-w-full bg-white px-6 rounded-lg">
          <InventoryRequest />
        </div>
      </div>

      <Link id="newBillLink" to="/newbill">
        <button className="rounded-lg text-3xl text-white absolute bottom-10 right-8 font-bold hover:bg-green-700 px-4 py-3 bg-green-500">
          +
        </button>
      </Link>
    </main>
  );
};

export default DashBoardPage;
