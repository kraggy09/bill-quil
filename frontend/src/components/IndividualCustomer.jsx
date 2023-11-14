import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { apiUrl } from "../constant";
import axios from "axios";
import Loading from "./Loading";
import BillStrap from "./BillStrap";
import { calculateDate, calculateTime } from "../libs/constant";

const IndividualCustomer = () => {
  const params = useParams();
  const [customer, setCustomer] = useState();

  const location = useLocation();
  const { id } = params;
  const { state } = location;
  const [loading, setLoading] = useState(false);

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
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-w-[85vw]">
          <div className="min-w-full my-6 flex items-center justify-center">
            {" "}
            <div className="flex rounded-full max-w-[320px] border-2">
              <div
                onClick={() => {
                  setLoading(true);
                  setTab("bills");
                  setLoading(false);
                }}
                className={`min-w-[150px] rounded-full px-3 mx-auto flex items-center justify-center text-xl font-bold  py-2 ${
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
                className={`min-w-[160px]  rounded-full flex items-center justify-center px-3 mx-auto text-xl font-bold py-2 ${
                  tab === "transaction"
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                Transactions
              </div>
            </div>
          </div>

          <div className="ml-6 font-bold text-2xl my-3">
            <p>Customer Id: {id}</p>
            <p className="capitalize"> Name: {customer && customer.name}</p>
            <p className="capitalize">
              {" "}
              Outstanding: {customer && customer.outstanding}
            </p>
          </div>
          {tab === "bills" ? (
            <table className="table-auto border-spacing-x-60 text-2xl border border-black ml-6 ">
              <thead className="border border-black">
                <tr className="border border-black">
                  <th className="border border-black mx-6">Date</th>
                  <th className="border border-black">Time</th>
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
                {customer &&
                  [...customer.transactions].reverse().map((transaction) => {
                    return (
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
