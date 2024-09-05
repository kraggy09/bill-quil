import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { calculateDate, calculateTime } from "../libs/constant";
import { useNavigate } from "react-router-dom";

const BillStrap = ({ bill }) => {
  // console.log(bill);
  const date = new Date(bill.createdAt);
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState(0);
  // console.log(bill);
  const calculateBillAmount = () => {
    let total = bill.items.reduce((ac, item) => {
      return ac + item.total;
    }, 0);
    setBillAmount(Math.ceil(total));
  };
  useEffect(() => {
    calculateBillAmount();
  }, [bill.items]);
  // bill?.id && console.log("Id", bill);

  return (
    <tr className="font-medium  ">
      <td className="lg:px-6 md:px-2 py-3 ">{calculateDate(date)}</td>
      <td className="lg:px-6 md:px-2 py-3 ">{calculateTime(date)}</td>
      <td className="lg:px-6 md:px-2 py-3 ">
        {bill?.id?.id ? bill.id.id : "Old Bill"}
      </td>
      <td className="lg:px-6 md:px-2 py-3 ">
        {" "}
        {billAmount.toFixed(3) - bill.discount}
      </td>
      <td className="lg:px-6 md:px-2 py-3 ">
        {(bill.total - billAmount) % 1 != 0
          ? (bill.total - billAmount + bill.discount).toFixed(1)
          : bill.total - billAmount + bill.discount}
      </td>
      <td className="lg:px-6 md:px-2 py-3 ">{bill.payment}</td>
      <td className="lg:px-6 md:px-2 py-3 ">{bill.total - bill.payment}</td>
      <td
        onClick={() => {
          navigate(`/bills/${bill._id}`, { state: bill });
        }}
        className="px-6 text-3xl hover:cursor-pointer hover:text-green-500 py-3"
      >
        <AiFillEye />
      </td>
      {/* Additional cells or content go here if needed */}
    </tr>
  );
};

export default BillStrap;

BillStrap.propTypes = {
  bill: PropTypes.object,
};
