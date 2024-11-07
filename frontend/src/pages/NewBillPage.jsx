import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoRefresh } from "react-icons/io5";

import { Toaster, toast } from "react-hot-toast";
// import { , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BillType from "../components/BillType";
import Modal from "../components/Modal";
import BillingHeader from "../components/BillingHeader";
import BillTable from "../components/BillTable";
import Loading from "../components/Loading";
import BillModal from "../components/BillModal";

import { fetchProducts } from "../store/productSlice";
import { fetchCustomers } from "../store/customerSlice";
import { fetchDailyReport } from "../store/reportSlice";
import { fetchLastBillId } from "../store/billIdSlice";
import { apiUrl } from "../constant";
import apiCaller from "../libs/apiCaller";

// Constants
const API_URL = "/createBill";

const NewBillPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [billType, setBillType] = useState("");
  const [print, setPrint] = useState(false);
  const [reload, setReload] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [foundCustomer, setFoundCustomer] = useState({});
  const [purchased, setPurchased] = useState([]);
  console.log(purchased);
  const [apiSuccess, setApiSuccess] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState(0);
  const [disabledRefresh, setDisabledRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
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
      let err = false;
      purchased.forEach((pr) => {
        if (pr.total === 0) {
          toast.error(`${pr.name} has  0 quantity`);
          err = true;
        }
      });

      if (err) {
        setDisabled(false);
        setLoading(false);
        return;
      }
      if (apiSuccess) {
        toast.error("API called already");
        return;
      }
      const response = await apiCaller.post(apiUrl + API_URL, {
        purchased,
        discount,
        billId: id,
        payment: payment === "" ? 0 : payment,
        total,
        paymentMode,
        customerId: foundCustomer?._id,
        createdBy: user.id,
      });
      setApiSuccess(true);

      setPrint(true);
      console.log(response.data);
      dispatch(fetchProducts());
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
      dispatch(fetchLastBillId());

      toast.success("Bill created successfully"); // Display success message
    } catch (error) {
      console.log("error", error);

      dispatch(fetchProducts());
      dispatch(fetchCustomers());
      dispatch(fetchDailyReport());
      setDisabled(false);
      toast.error(error?.response?.data?.msg); // Display error message
    } finally {
      setLoading(false);
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
        reload={reload}
        billType={billType}
        purchased={purchased}
        setPurchased={setPurchased}
        foundCustomer={foundCustomer}
        setFoundCustomer={setFoundCustomer}
      />
      <div className="min-w-full  flex items-center justify-end">
        <div
        className="flex gap-x-11"
          onMouseEnter={() => setDisabledRefresh(false)}
          onMouseLeave={() => setDisabledRefresh(true)}
          onClick={() => {
            handleRefresh();
          }}
        >

          <div >Total Products: <span className="bg-green-200 text-green-800 font-semibold px-2 rounded-lg">
          {purchased.length}</span></div>
          <button
            disabled={disabledRefresh}
            className="flex items-center justify-center  bg-green-500 text-white rounded-xl font-bold px-3 py-1"
          >
            <IoRefresh className={loading && "animate-spin"} />
            Refresh
          </button>
        </div>
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
          className="bg-green-600 mr-10 p-2  text-white hover:bg-green-600 rounded-xl font-bold my-6"
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
      <Toaster position="top-center" />
      {loading && <Loading />}
    </div>
  );
};

export default NewBillPage;
