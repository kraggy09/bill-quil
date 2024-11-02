import { useState } from "react";
import BillingHeader from "./BillingHeader";
import Loading from "./Loading";
import ReturnBillTable from "./ReturnBillTable";
import { fetchCustomers } from "../store/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import { fetchProducts } from "../store/productSlice";
import { fetchDailyReport } from "../store/reportSlice";
import apiCaller from "../libs/apiCaller";
import { apiUrl } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import TransactionModal from "./TransactionModal";
import { fetchLastBillId } from "../store/billIdSlice";
import { IoRefresh } from "react-icons/io5";

const ReturnProduct = () => {
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);

  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  console.log("Hey, I am the total", total);
  const { id } = useSelector((store) => store.billId);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      await dispatch(fetchProducts()); // Wait for the fetchProducts operation to complete
      await dispatch(fetchCustomers());
      await dispatch(fetchLastBillId());
      await dispatch(fetchDailyReport());
      setReload(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error!! Please re-login");
      setLoading(false);
    }
  };
  const [foundCustomer, setFoundCustomer] = useState();
  const [disabledRefresh, setDisabledRefresh] = useState(false);
  const [purchased, setPurchased] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [returnType, setReturnType] = useState("adjustment");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiCaller.post(apiUrl + "/products/return", {
        foundCustomer,
        purchased,
        returnType,
        billId: id,
        total,
      });

      dispatch(fetchCustomers());
      dispatch(fetchProducts());
      dispatch(fetchDailyReport());
      dispatch(fetchLastBillId());
      setLoading(false);

      if (returnType === "adjustment") {
        setIsOpen(true);
      }
      toast.success("Product return successfull");
      if (returnType === "refund") {
        setPurchased([]);
      }
      console.log(res.data, "DAt");

      // Additional logic based on the response if needed
    } catch (error) {
      console.log(error, "Error");

      console.error("Error while making the request:", error.message);
      toast.error(error.response.data.msg);
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
        reload={reload}
        billType="return"
        purchased={purchased}
        setFoundCustomer={setFoundCustomer}
        setPurchased={setPurchased}
      />
      <div className="min-w-full  flex items-center justify-end">
        <div
          onMouseEnter={() => setDisabledRefresh(false)}
          onMouseLeave={() => setDisabledRefresh(true)}
          onClick={() => {
            handleRefresh();
          }}
        >
          <button
            disabled={disabledRefresh}
            className="flex items-center justify-center  bg-green-500 text-white rounded-xl font-bold px-3 py-1"
          >
            <IoRefresh className={loading && "animate-spin"} />
            Refresh
          </button>
        </div>
      </div>
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
