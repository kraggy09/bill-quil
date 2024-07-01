import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import Loading from "./Loading";
import ReturnBillTable from "./ReturnBillTable";
import { fetchCustomers } from "../store/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import { fetchProducts } from "../store/productSlice";
import { fetchDailyReport } from "../store/reportSlice";
import axios from "axios";
import { apiUrl } from "../constant";
import { useDispatch } from "react-redux";
import TransactionModal from "./TransactionModal";

const ReturnProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  console.log("Hey, I am the total", total);
  const [foundCustomer, setFoundCustomer] = useState();
  const [purchased, setPurchased] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [returnType, setReturnType] = useState("adjustment");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(apiUrl + "/products/return", {
        foundCustomer,
        purchased,
        returnType,
        total,
      });

      dispatch(fetchCustomers());
      dispatch(fetchProducts());
      dispatch(fetchDailyReport());
      setLoading(false);

      if (returnType === "adjustment") {
        setIsOpen(true);
      }
      toast.success("Product return successfull");
      if (returnType === "refund") {
        setPurchased([]);
      }
      console.log(res.data);
      // Additional logic based on the response if needed
    } catch (error) {
      console.error("Error while making the request:", error.message);
      toast.error(error.message);
      setLoading(false);
      // Handle the error, show a user-friendly message, or take appropriate action
    }
  };

  return (
    <div className="min-w-[90vw] ml-28">
      {loading && <Loading />}
      {foundCustomer && (
        <TransactionModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          name={foundCustomer.name}
          outstanding={foundCustomer.outstanding}
          amount={total}
          paymentMode={"returnType"}
        />
      )}
      <ToastContainer autoClose={1500} />
      <div className="min-w-[90vw] flex my-6 justify-center">
        <div className="flex rounded-xl   border-2">
          <div
            onClick={() => {
              setReturnType("adjustment");
            }}
            className={`min-w-[150px] hover:cursor-pointer rounded-xl px-3 mx-auto flex items-center justify-center  font-bold  py-2 ${
              returnType === "adjustment"
                ? "bg-red-200 text-red-800"
                : "bg-white text-red-800"
            }`}
          >
            Adjustment
          </div>

          <div
            onClick={() => {
              setReturnType("refund");
            }}
            className={`min-w-[160px] hover:cursor-pointer rounded-xl flex items-center justify-center px-3 mx-auto  font-bold py-2 ${
              returnType === "refund"
                ? "bg-green-200  text-green-800"
                : "bg-white text-green-800"
            }`}
          >
            Refund
          </div>
        </div>
      </div>
      <BillingHeader
        billType="return"
        purchased={purchased}
        setFoundCustomer={setFoundCustomer}
        setPurchased={setPurchased}
      />
      <ReturnBillTable
        discount={0}
        total={total}
        setTotal={setTotal}
        foundCustomer={foundCustomer}
        purchased={purchased}
        setPurchased={setPurchased}
        returnType={returnType}
      />
      <div className="max-w-[70vw] flex items-end justify-end">
        {purchased.length > 0 && (
          <button
            disabled={returnType === "adjustment" && foundCustomer == null}
            onClick={handleSubmit}
            className={`${
              returnType === "refund"
                ? "bg-green-200 text-green-800 hover:bg-green-300"
                : "bg-red-200 text-red-800 hover:bg-red-300"
            } p-3 mt-6 rounded-xl font-bold capitalize  `}
          >
            {returnType}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReturnProduct;
