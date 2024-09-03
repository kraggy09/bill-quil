import PropTypes from "prop-types";
import BillProducts from "./BillProducts";
import { useEffect, useRef, useState } from "react";

const BillTable = ({
  foundCustomer,
  purchased,
  setPurchased,
  discount,
  setDiscount,
  total,
  setTotal,
  payment,
  setPayment,
  paymentMode,
  setPaymentMode,
}) => {
  // console.log(purchased);
  const [change, setChange] = useState(false);
  let paymentRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F9") {
        paymentRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    let total = purchased.reduce((accumulator, product) => {
      const productTotal = parseFloat(product.total);
      if (!isNaN(productTotal)) {
        return accumulator + productTotal;
      } else {
        return accumulator; // Ignore invalid total values
      }
    }, 0);
    if (foundCustomer?.outstanding) {
      total += Number(foundCustomer?.outstanding);
    }
    total -= Number(discount);

    setTotal(Math.ceil(total.toFixed(2)));
    setChange(true);
  }, [purchased, foundCustomer, discount]);

  return (
    <div className="relative min-w-full items-center justify-center flex flex-col">
      <table className="min-w-[60vw]  mt-6">
        <thead className="border border-black rounded-xl">
          <tr>
            <th className="">Stock</th>

            <th className=" ">Action</th>

            <th className="">Name</th>
            <th className="">Price</th>
            <th className="">Toggle</th>
            <th className="">Piece</th>
            <th className="">Packet</th>
            <th className="">Box</th>
            <th className="">Discount</th>
            <th className="">Total</th>
          </tr>
        </thead>
        <tbody className="mt-20">
          {[...purchased].reverse().map((product) => {
            // console.log(product);
            return (
              <BillProducts
                product={product}
                key={product.id} // Use the id property as the key
                purchased={purchased}
                change={change}
                setPurchased={setPurchased}
              />
            );
          })}
        </tbody>
      </table>
      <div className="min-w-[60vw] flex-col items-end justify-end flex">
        <div className="mt-6 border border-black border-dashed border-spacing-2 min-w-[200px]"></div>

        <div className="min-w-[200px] ">
          <p className="text-end   font-bold">
            <span className="px-16">Total Bill:</span>
            {total - (foundCustomer?.outstanding || 0)}₹
          </p>
          <div className="min-w-[200px] ">
            <p className="text-end   font-bold">
              <span className="px-16">OutStanding:</span>
              {foundCustomer?.outstanding}₹
            </p>
          </div>

          <p className="text-end   font-bold">
            <span className="px-16">Discount:</span>
            <input
              type="number"
              className="text-end max-w-[50px]"
              value={discount}
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
            />
            ₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end   font-bold">
            <span className="px-16">Total:</span>
            {total}₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end   font-bold">
            <span className="px-16">
              Payment
              <sup className="text-sm ml-3  rounded-full bg-green-300 font-normal px-2 py-1">
                F9
              </sup>
            </span>
            <input
              type="number"
              ref={paymentRef}
              className="text-end pr-2 outline-none border-2 border-green-500 rounded-xl max-w-[70px]"
              value={payment}
              onChange={(e) => {
                setPayment(e.target.value);
              }}
            />
            ₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end  font-bold">
            <span className="px-16">Payment Mode:</span>
            <select
              name="paymentMode" // Set the name attribute to "paymentMode"
              id="paymentMode" // Set an ID for the select element if needed
              value={paymentMode} // Set the value attribute to the paymentMode state
              onChange={(e) => {
                setPaymentMode(e.target.value); // Update the paymentMode state
              }}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </p>
        </div>
      </div>
    </div>
  );
};

BillTable.propTypes = {
  foundCustomer: PropTypes.object.isRequired,
  purchased: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  paymentMode: PropTypes.string.isRequired,
  discount: PropTypes.number.isRequired,
  payment: PropTypes.number.isRequired,
  setPurchased: PropTypes.func.isRequired,
  setPayment: PropTypes.func.isRequired,
  setDiscount: PropTypes.func.isRequired,
  setTotal: PropTypes.func.isRequired,
  setPaymentMode: PropTypes.func.isRequired,
};

export default BillTable;
