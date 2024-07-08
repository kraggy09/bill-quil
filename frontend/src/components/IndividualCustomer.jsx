import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { apiUrl } from "../constant";
import axios from "axios";
axios.defaults.withCredentials = true;

import Loading from "./Loading";
import BillStrap from "./BillStrap";
import { calculateDate, calculateTime } from "../libs/constant";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";

const IndividualCustomer = () => {
  const params = useParams();
  const [customer, setCustomer] = useState();

  const location = useLocation();
  const { id } = params;
  const { state } = location;
  let user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  let [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const getIncrease = (curr, prev) => {
    let a = data && ((curr - prev) / prev) * 100;
    // console.log(a);
    return a;
  };

  console.log(state);

  const [tab, setTab] = useState("bills");
  console.log(customer);
  const onLaodData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl + "/getCustomer" + "/" + state._id);
      setCustomer(res.data.customer);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    onLaodData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [days]);

  async function fetchData() {
    let token = localStorage.getItem("token");

    let res = await axios.post(apiUrl + "/getCustomerData", {
      token: token,
      days: days,
      customerId: id,
    });
    setData(res.data);
    // console.log(res.data);
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-w-[90vw] pl-24">
          <div className="min-w-full my-6 flex items-center justify-center">
            {" "}
            <div className="flex rounded-lg max-w-[320px] border-2">
              <div
                onClick={() => {
                  setLoading(true);
                  setTab("bills");
                  setLoading(false);
                }}
                className={`min-w-[150px] hover:cursor-pointer rounded-lg px-3  mx-auto flex items-center justify-center  font-bold  py-2 ${
                  tab === "bills"
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                Bills
              </div>
              <div
                onClick={() => {
                  setLoading(true);
                  setTab("transaction");
                  setLoading(false);
                }}
                className={`min-w-[160px]  hover:cursor-pointer rounded-lg flex items-center justify-center px-3 mx-auto  font-bold py-2 ${
                  tab === "transaction"
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                Transactions
              </div>
            </div>
          </div>

          <div className="pl-6 flex gap-x-6 min-w-full font-bold  my-3">
            <div className="flex gap-y-2 flex-col">
              <p>Customer Id: {id}</p>
              <p className="capitalize"> Name: {customer && customer.name}</p>
              <p className="capitalize">
                {" "}
                Outstanding: {customer && customer.outstanding}
              </p>
              <p>Mobile Number:{customer && customer.phone}</p>
            </div>
            {!locked && user.usAdmin ? (
              <div className="flex items-center min-w-[65vw] justify-between">
                {data && (
                  <div className="shadow-2xl gap-y-2  rounded-lg px-4 bg-white  flex items-center justify-center max-w-[100%] md:min-w-[30%] h-36">
                    <div className="flex flex-col gap-y-2">
                      <p className="font-bold">Total Sales</p>
                      <div>
                        <span className="text-2xl font-semibold">
                          ₹{data && data.totalCurrSales[0]?.overallSales}
                        </span>
                        {data && (
                          <span
                            className={`${
                              getIncrease(
                                data.totalCurrSales[0]?.overallSales,
                                data.totalPreviousSales[0]?.overallSales
                              ) > 0
                                ? "bg-green-300 text-green-800"
                                : "bg-red-200 text-red-800"
                            } text-[12px] px-2 py-[2px] rounded-md font-semibold ml-3`}
                          >
                            {getIncrease(
                              data.totalCurrSales[0]?.overallSales,
                              data.totalPreviousSales[0]?.overallSales
                            ) > 0 && "+"}
                            {getIncrease(
                              data.totalCurrSales[0]?.overallSales,
                              data.totalPreviousSales[0]?.overallSales
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
                )}
                {data && (
                  <div className="shadow-2xl gap-y-2  rounded-lg px-4 bg-white  flex items-center justify-center max-w-[100%] md:min-w-[30%] h-36">
                    <div className="flex flex-col gap-y-2">
                      <p className="font-bold">Total Payment</p>
                      <div>
                        <span className="text-2xl font-semibold">
                          ₹
                          {data &&
                            data.currentTransactions[0]?.overallPayment.toFixed(
                              2
                            )}
                        </span>
                        {data && (
                          <span
                            className={`${
                              getIncrease(
                                data.currentTransactions[0]?.overallPayment,
                                data.previousTransaction[0]?.overallPayment
                              ) > 0
                                ? "bg-green-300 text-green-800"
                                : "bg-red-200 text-red-800"
                            } text-[12px] px-2 py-[2px] rounded-md font-semibold pl-3`}
                          >
                            {getIncrease(
                              data.currentTransactions[0]?.overallPayment,
                              data.previousTransaction[0]?.overallPayment
                            ) > 0 && "+"}
                            {getIncrease(
                              data.currentTransactions[0]?.overallPayment,
                              data.previousTransaction[0]?.overallPayment
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
                )}
                <div className="flex flex-col gap-y-2">
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
            ) : (
              <div>
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
            )}
          </div>
          {tab === "bills" ? (
            <table className="table-auto border-spacing-x-60  border border-black pl-6 ">
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
                {customer &&
                  [...customer.bills].reverse().map((bill) => {
                    return <BillStrap key={bill._id} bill={bill} />;
                  })}
              </tbody>
            </table>
          ) : (
            <table className="table-auto border-spacing-16  border border-black pl-6 ">
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
                {customer &&
                  [...customer.transactions].reverse().map((transaction) => {
                    return (
                      <tr className="" key={transaction._id}>
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
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default IndividualCustomer;
