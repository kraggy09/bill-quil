import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoRefresh } from "react-icons/io5";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
axios.defaults.withCredentials = true;

import BillType from "../components/BillType";
import Modal from "../components/Modal";
import BillingHeader from "../components/BillingHeader";
import BillTable from "../components/BillTable";
import { fetchProducts } from "../store/productSlice";
import { fetchCustomers } from "../store/customerSlice";
import { apiUrl } from "../constant";

import BillModal from "../components/BillModal";
import { fetchDailyReport } from "../store/reportSlice";
import Loading from "../components/Loading";
import { fetchLastBillId } from "../store/billIdSlice";

// Constants
const API_URL = "/createBill";

const NewBillPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [billType, setBillType] = useState("");
  const [print, setPrint] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [foundCustomer, setFoundCustomer] = useState({});
  const [purchased, setPurchased] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState(0);
  const [disabledRefresh, setDisabledRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const { id } = useSelector((store) => store.billId);
  console.log(id);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      await dispatch(fetchProducts()); // Wait for the fetchProducts operation to complete
      await dispatch(fetchCustomers());
      await dispatch(fetchLastBillId());
      await dispatch(fetchDailyReport());
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Handle form submission
  useEffect(() => {
    if (purchased.length > 0 && foundCustomer?.name != null) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [purchased, foundCustomer]);
  const submitHandle = async () => {
    setDisabled(true);
    setLoading(true);

    try {
      const response = await axios.post(apiUrl + API_URL, {
        purchased,
        discount,
        billId: id,
        payment: payment === "" ? 0 : payment,
        total,
        paymentMode,
        customerId: foundCustomer?._id,
        createdBy: user.id,
      });
      setLoading(false);
      setPrint(true);
      console.log(response.data);
      dispatch(fetchProducts());
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
      dispatch(fetchLastBillId());

      toast.success("Bill created successfully"); // Display success message
    } catch (error) {
      setLoading(false);
      console.log("error", error);

      dispatch(fetchProducts());
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
      setDisabled(false);
      toast.error(error?.response?.data?.msg); // Display error message
    }
  };

  return (
    <div className="min-w-[85vw]">
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Component={BillType}
        componentProps={{ billType: billType, setBillType: setBillType }}
      />

      <BillingHeader
        billType={billType}
        purchased={purchased}
        setPurchased={setPurchased}
        setFoundCustomer={setFoundCustomer}
      />
      <div
        onMouseEnter={() => setDisabledRefresh(false)}
        onMouseLeave={() => setDisabledRefresh(true)}
        onClick={() => {
          handleRefresh();
        }}
        className="min-w-full  flex items-center justify-end"
      >
        <button
          disabled={disabledRefresh}
          className="flex items-center justify-center text-2xl bg-green-500 text-white rounded-xl font-bold px-3 py-1"
        >
          <IoRefresh className={loading && "animate-spin"} />
          Refresh
        </button>
      </div>
      <BillTable
        foundCustomer={foundCustomer}
        purchased={purchased}
        setPurchased={setPurchased}
        discount={discount}
        setDiscount={setDiscount}
        payment={payment}
        setPayment={setPayment}
        total={total}
        setTotal={setTotal}
        setPaymentMode={setPaymentMode}
        paymentMode={paymentMode}
      />
      <div className="max-w-[75vw] flex justify-end items-end">
        <button
          className="bg-green-600 mr-10 p-2 text-xl text-white hover:bg-green-600 rounded-xl font-bold my-6"
          onClick={submitHandle}
          disabled={disabled}
          // onClick={() => setPrint(true)}
        >
          Create bill
        </button>
        <BillModal
          billId={id}
          isOpen={print}
          purchased={purchased}
          foundCustomer={foundCustomer}
          setIsOpen={setPrint}
          total={total}
          payment={payment}
          discount={discount}
        />
      </div>
      <ToastContainer autoClose={3000} />
      {loading && <Loading />}
    </div>
  );
};

export default NewBillPage;
