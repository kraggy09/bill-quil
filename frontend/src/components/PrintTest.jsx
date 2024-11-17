import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import PrintBill from "./PrintBill";
import ThermalPrint from "./ThermalPrint";
import { useNavigate } from "react-router-dom";
import ThermalPrintHindi from "./ThermalPrintHindi";
import PropTypes from "prop-types";

export const PrintButton = ({
  foundCustomer,
  purchased,
  billId,
  setIsOpen,
  total,
  payment,
  discount,
  createdAt,
}) => {
  const billComponentRef = useRef();
  const thermalComponentRef = useRef();
  const thermalHindiCompRef = useRef();
  const navigate = useNavigate();
  const [withMRP, setWithMRP] = useState(true);

  return (
    <div>
      <div className="flex items-center pl-6">
        <div className="rounded-lg border flex cursor-pointer text-green-800  border-green-800  overflow-hidden ">
          <div
            onClick={() => {
              setWithMRP(false);
            }}
            className={`px-4 ${
              withMRP ? "bg-white text-black" : "bg-green-200"
            }`}
          >
            NO MRP
          </div>
          <div
            onClick={() => setWithMRP(true)}
            className={`px-4 ${
              !withMRP ? "bg-white text-black" : "bg-green-200"
            }`}
          >
            MRP
          </div>
        </div>
        <button
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              navigate("/newBill");
            }, 500);
          }}
          className=" bg-red-600 mx-3 my-2 p-1 text-white font-bold rounded-lg px-3"
        >
          No Print
        </button>

        <ReactToPrint
          trigger={() => (
            <button
              className=" bg-green-600 mx-3 my-2 p-1 text-white font-bold rounded-lg px-3"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  navigate("/newBill");
                }, 500);
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
            setTimeout(() => {
              navigate("/newBill");
            }, 500);
          }}
        />

        <ReactToPrint
          trigger={() => (
            <button
              className=" bg-blue-600 mx-3 my-2 p-1 text-white font-bold rounded-lg px-3"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  navigate("/newBill");
                }, 500);
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
            setTimeout(() => {
              navigate("/newBill");
            }, 500);
          }}
        />

        <ReactToPrint
          trigger={() => (
            <button
              className=" bg-yellow-600 mx-3 my-2 p-1 text-white font-bold rounded-lg px-3"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  navigate("/newBill");
                }, 500);
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
            setTimeout(() => {
              navigate("/newBill");
            }, 500);
          }}
        />
      </div>
      <PrintBill
        createdAt={createdAt}
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={billComponentRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
        withMRP={withMRP}
      />

      <ThermalPrint
        createdAt={createdAt}
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={thermalComponentRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
        withMRP={withMRP}
      />
      <ThermalPrintHindi
        createdAt={createdAt}
        billId={billId}
        total={total}
        discount={discount}
        payment={payment}
        ref={thermalHindiCompRef}
        foundCustomer={foundCustomer}
        purchased={purchased}
        withMRP={withMRP}
      />
    </div>
  );
};

PrintButton.propTypes = {
  foundCustomer: PropTypes.object,
  setIsOpen: PropTypes.func,
  purchased: PropTypes.array,
  total: PropTypes.number,
  payment: PropTypes.string,
  discount: PropTypes.number,
  withMRP: PropTypes.number,
  billId: PropTypes.number,
  createdAt: PropTypes.string,
};
