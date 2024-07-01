import { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintBill from "./PrintBill";
import ThermalPrint from "./ThermalPrint";
import { useNavigate } from "react-router-dom";
import ThermalPrintHindi from "./ThermalPrintHindi";

export const PrintButton = ({
  foundCustomer,
  purchased,
  billId,
  setIsOpen,
  total,
  payment,
  discount,
}) => {
  const billComponentRef = useRef();
  const thermalComponentRef = useRef();
  const thermalHindiCompRef = useRef();
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
        className=" bg-red-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
      >
        No Print
      </button>

      <ReactToPrint
        trigger={() => (
          <button
            className=" bg-green-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
            onClick={() => {
              navigate("/");
            }}
          >
            Print Bill
          </button>
        )}
        content={() => billComponentRef.current}
        onAfterPrint={() => {
          // Handle actions after printing (e.g., close the print)
          setIsOpen(false);
          navigate("/");
        }}
      />
      <PrintBill
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={billComponentRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
      />

      <ReactToPrint
        trigger={() => (
          <button
            className=" bg-blue-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
            onClick={() => {
              navigate("/");
            }}
          >
            Print Thermal
          </button>
        )}
        content={() => thermalComponentRef.current}
        onAfterPrint={() => {
          // Handle actions after printing (e.g., close the print)
          setIsOpen(false);
          navigate("/");
        }}
      />

      <ReactToPrint
        trigger={() => (
          <button
            className=" bg-yellow-600 mx-6 my-2 p-2 text-white font-bold rounded-xl px-3"
            onClick={() => {
              navigate("/");
            }}
          >
            Print Thermal Hindi
          </button>
        )}
        content={() => thermalHindiCompRef.current}
        onAfterPrint={() => {
          // Handle actions after printing (e.g., close the print)
          setIsOpen(false);
          navigate("/");
        }}
      />
      <ThermalPrint
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={thermalComponentRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
      />
      <ThermalPrintHindi
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={thermalHindiCompRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
      />
    </div>
  );
};
