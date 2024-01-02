import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { calculateDate, calculateTime } from "../libs/constant";
import { useNavigate } from "react-router-dom";

const BillStrap = ({ bill }) => {
  const date = new Date(bill.createdAt);
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState(0);
  // console.log(bill);
  const calculateBillAmount = () => {
    const total = bill.items.reduce((ac, item) => {
      return ac + item.total;
    }, 0);
    setBillAmount(total);
  };
  useEffect(() => {
    calculateBillAmount();
  }, [bill.items]);
  // bill?.id && console.log("Id", bill);

  return (
    <tr className="font-medium text-xl ">
      <td className="px-16 py-3 ">{calculateDate(date)}</td>
      <td className="px-16 py-3 ">{calculateTime(date)}</td>
      <td className="px-16 py-3 ">{bill?.id?.id ? bill.id.id : "Old Bill"}</td>
      <td className="px-16 py-3 "> {billAmount.toFixed(3)}</td>
      <td className="px-16 py-3 ">
        {(bill.total - billAmount) % 1 != 0
          ? (bill.total - billAmount).toFixed(1)
          : bill.total - billAmount}
      </td>
      <td className="px-16 py-3 ">{bill.payment}</td>
      <td className="px-16 py-3 ">{bill.total - bill.payment}</td>
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
