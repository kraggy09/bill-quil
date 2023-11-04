import React from "react";
import { PrintButton } from "../components/PrintTest";

const BillModal = ({
  isOpen,
  setIsOpen,
  foundCustomer,
  purchased,
  total,
  payment,
  discount,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white">
            <PrintButton
              foundCustomer={foundCustomer}
              purchased={purchased}
              setIsOpen={setIsOpen}
              total={total}
              payment={payment}
              discount={discount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BillModal;
