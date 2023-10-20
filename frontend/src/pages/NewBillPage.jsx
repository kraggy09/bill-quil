import { useState } from "react";
import BillType from "../components/BillType";
import Modal from "../components/Modal";
import BillingHeader from "../components/BillingHeader";
import BillTable from "../components/BillTable";
import { useSelector } from "react-redux";

const NewBillPage = () => {
  const [billType, setBillType] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [foundCustomer, setFoundCustomer] = useState({});
  const [purchased, setPurchased] = useState([]);
  /** Task for 21-10-2023
   * change the purchased array according to the api
   * create a new bill according to the api
   * and much more
   */
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
      />
    </div>
  );
};

export default NewBillPage;
