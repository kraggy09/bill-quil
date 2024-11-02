import { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";

import { CiWarning } from "react-icons/ci";
import { apiUrl } from "../constant";
import { useNavigate } from "react-router-dom";
import { calculateDate, calculateTime } from "../libs/constant";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchCustomers } from "../store/customerSlice";
import { fetchDailyReport } from "../store/reportSlice";
import apiCaller from "../libs/apiCaller";

const TransactionPage = () => {
  const [transaction, setTransaction] = useState(null);
  const dispatch = useDispatch();

  async function approveTransaction(id) {
    try {
      let res = await apiCaller.post(apiUrl + "/approveTransaction", {
        id,
      });
      toast.success(res.data.msg);
      fetchTransactions();
      console.log(res, "This is the response");
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
    } catch (error) {
      console.log(error);
      error.response.data?.customer?.outstanding &&
        toast.error(error.response.data.msg);
      toast((t) => (
        <span>
          The customer current outstanding is{" "}
          <span className="bg-red-200 text-red-600 px-1 rounded-lg">
            {error.response.data.customer.outstanding}
          </span>
          <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
        </span>
      ));
    }
  }
  async function rejectTransaction(id) {
    try {
      let res = await apiCaller.post(apiUrl + "/rejectTransaction", {
        id,
      });
      toast.success(res.data.msg);
      fetchTransactions();
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  async function fetchTransactions() {
    let res = await apiCaller.get(apiUrl + "/getTransactionForApproval");
    console.log(res.data);
    setTransaction(res.data.transactions);
    // toast.success(res.data.msg);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <main className="relative flex pt-6 gap-6 min-w-[100vw] pl-24">
      {transaction && transaction.length > 0 ? (
        transaction.map((tr) => {
          return (
            <article
              key={tr._id}
              className="bg-white py-3 h-fit flex flex-col gap-y-6 min-w-[20%] items-center overflow-hidden shadow-lg shadow-gray-400 rounded-lg cursor-pointer"
            >
              <header className="flex gap-y-3 items-center flex-col">
                <CiWarning color="green" size={30} />
                <h1>Payment Pending</h1>
                <h2 className="font-bold text-xl">Amount: {tr.amount}</h2>
              </header>
              <section className="flex items-center justify-around min-w-full">
                <div className="flex-col">
                  <h2>Curr Outst</h2>
                  <h3 className="text-center font-semibold">
                    {tr.previousOutstanding}
                  </h3>
                </div>
                <div className="flex-col">
                  <h2>Fut. Outst</h2>
                  <h3 className="font-semibold text-center">
                    {tr.newOutstanding}
                  </h3>
                </div>
              </section>
              <div className="min-w-full">
                <hr className="border-b-2 mx-6" />
              </div>
              <footer className="flex items-center justify-between min-w-full px-3">
                <div
                  id="left"
                  className="flex flex-col gap-y-2 items-start justify-center"
                >
                  <p>Party Name</p>
                  <p>Date & Time</p>
                  <p>Method</p>
                </div>
                <div
                  id="right"
                  className="flex flex-col gap-y-2 items-start justify-center"
                >
                  <p className="capitalize">{tr.name}</p>
                  <p>{`${calculateDate(new Date(tr.createdAt))} ${calculateTime(
                    new Date(tr.createdAt)
                  )}`}</p>
                  <p>{tr.paymentMode}</p>
                </div>
              </footer>
              {user.isAdmin && (
                <div className="min-w-full gap-x-6 justify-end items-center flex">
                  <button
                    onClick={() => {
                      rejectTransaction(tr._id);
                    }}
                    className="bg-red-300 rounded-md text-red-700 p-2"
                  >
                    <FcCancel />
                  </button>
                  <button
                    onClick={() => {
                      approveTransaction(tr._id);
                    }}
                    className="bg-green-300 mr-3 rounded-md  text-green-700 p-2"
                  >
                    <FaCheck />
                  </button>
                </div>
              )}
            </article>
          );
        })
      ) : (
        <div className="text-center min-w-full flex items-center justify-center font-semibold">
          All Payments are done nothing to show
          <span className="p-2 rounded-lg bg-green-300 text-green-800 ml-6">
            {" "}
            <FaCheck />
          </span>
        </div>
      )}
      <button
        onClick={() => {
          navigate("/newTransaction");
        }}
        className="absolute bottom-16 right-16 text-lg bg-green-300 px-3 py-1 rounded-lg"
      >
        + New Transaction
      </button>
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default TransactionPage;
