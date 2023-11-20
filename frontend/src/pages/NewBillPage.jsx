import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

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

// Constants
const API_URL = "/createBill";

const NewBillPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [billType, setBillType] = useState("");
  const [print, setPrint] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [isOpen, setIsOpen] = useState(true);
  const [foundCustomer, setFoundCustomer] = useState({});
  const [purchased, setPurchased] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  useEffect(() => {
    if (purchased.length > 0) {
      setDisabled(false);
    }
  }, [purchased]);
  const submitHandle = async () => {
    setDisabled(true);
    setLoading(true);

    try {
      const response = await axios.post(apiUrl + API_URL, {
        purchased,
        discount,
        payment: payment === "" ? 0 : payment,
        total,
        paymentMode,
        customerId: foundCustomer._id,
        createdBy: user.id,
      });
      setLoading(false);
      setPrint(true);
      console.log(response.data);
      dispatch(fetchProducts());
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
      toast.success("Bill created successfully"); // Display success message
    } catch (error) {
      setLoading(false);
      console.error(error);
      setDisabled(false);
      toast.error("Error creating the bill"); // Display error message
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
      <div className="w-full flex justify-end items-end">
        <button
          className="bg-green-600 mr-10 p-5 text-2xl text-white hover:bg-green-600 rounded-xl font-bold my-6"
          onClick={submitHandle}
          disabled={disabled}
          // onClick={() => setPrint(true)}
        >
          Create bill
        </button>
        <button onClick={() => setPrint(true)}>Print</button>
        <BillModal
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
