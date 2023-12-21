import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import PrintTrans from "./PrintTrans";

export const PrintTransaction = ({
  setIsOpen,
  amount,
  outstanding,
  paymentMode,
  name,
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(false);
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

      <PrintTrans
        ref={componentRef}
        name={name}
        setIsOpen={setIsOpen}
        amount={amount}
        outstanding={outstanding}
        paymentMode={paymentMode}
      />
    </div>
  );
};
