import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

import axios from "axios";
import BillType from "../components/BillType";
import Modal from "../components/Modal";
import BillingHeader from "../components/BillingHeader";
import BillTable from "../components/BillTable";
import { fetchProducts } from "../store/productSlice";

// Constants
const API_URL = "http://localhost:4000/api/v1/createBill";

const NewBillPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [billType, setBillType] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [isOpen, setIsOpen] = useState(true);
  const [foundCustomer, setFoundCustomer] = useState({});
  const [purchased, setPurchased] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState(100);
  const [total, setTotal] = useState(100);

  // Handle form submission
  const submitHandle = async () => {
    try {
      const response = await axios.post(API_URL, {
        purchased,
        discount,
        payment,
        total,
        paymentMode,
        customerId: foundCustomer._id,
      });
      console.log(response);
      dispatch(fetchProducts());
      toast.success("Bill created successfully"); // Display success message
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error(error);
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
          disabled={purchased.length > 0 ? false : true}
        >
          Create bill
        </button>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default NewBillPage;
