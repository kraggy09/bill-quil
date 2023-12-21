import React from "react";
import PropTypes from "prop-types";
import { calculateDate, calculateTime } from "../libs/constant";

const PrintTrans = React.forwardRef(
  ({ name, amount, outstanding, paymentMode }, ref) => {
    return (
      <div
        ref={ref}
        className="min-h-[90vh] bg-white absolute min-w-[95vw] upper flex justify-start items-start"
      >
        <div className=" ml-6 min-w-[480px] mt-3 max-w-[510px]  border-2 rounded-lg border-black">
          <div className="min-w-[98%] flex justify-start rounded-xl   mx-1 mr- my-2 border-2 border-black">
            <div className="max-w-[65%] border-r-2 border-black pl-3">
              <p className="italic capitalize font-bold text-lg max-w-[90%]">
                Sultan Communication & General Stores
              </p>

              <p className="text-sm my-1 font-semibold text-gray-800">
                Mob:9370564909 / 9145506000
              </p>
            </div>
            <div className="pl-2">
              <p className="font-semibold text-md italic">
                Date:{calculateDate(new Date())}
              </p>
              <p className="font-semibold text-md italic">
                Time:
                {calculateTime(new Date())}
              </p>
              <span className="flex font-semibold">
                Customer:
                <p className="capitalize italic">{name}</p>
              </span>
            </div>
          </div>
          <div className="flex font-semibold flex-col min-w-full justify-end items-end pr-36 pt-6">
            <h1 className="text-xl mb-3 text-center px-6 border-b-2 border-black">
              Transaction Reciept
            </h1>
            <span>
              Previous Outstanding:
              <span className=" px-6 font-bold">{outstanding}</span>
            </span>
            <span>
              {" "}
              Payment:
              <span className="border-b-2 ml-6 border-black px-6 font-bold">
                {"-" + amount}
              </span>
            </span>
            <span className="mb-6">
              New Outstanding:
              <span className=" px-6 font-bold ">{outstanding - amount}</span>
            </span>
          </div>
          <h3 className="text-center font-semibold mb-6">Thank You!!</h3>
        </div>
      </div>
    );
  }
);

PrintTrans.propTypes = {
  name: PropTypes.string,
  setIsOpen: PropTypes.func,
  amount: PropTypes.string,
  outstanding: PropTypes.string,
  paymentMode: PropTypes.string,
};

PrintTrans.displayName = "PrintBill";

export default PrintTrans;
