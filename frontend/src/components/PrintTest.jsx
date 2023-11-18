import { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintBill from "./PrintBill";
import { useNavigate } from "react-router-dom";

export const PrintButton = ({
  foundCustomer,
  purchased,
  setIsOpen,
  total,
  payment,
  discount,
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="text-2xl bg-red-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
      >
        No Print
      </button>
      <ReactToPrint
        trigger={() => (
          <button
            className="text-2xl bg-green-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
            onClick={() => {
              navigate("/");
            }}
          >
            Print
          </button>
        )}
        content={() => componentRef.current}
        onAfterPrint={() => {
          // Handle actions after printing (e.g., close the print)
          setIsOpen(false);
          navigate("/");
        }}
      />
      <PrintBill
        total={total}
        discount={discount}
        payment={payment}
        ref={componentRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
      />
    </div>
  );
};
