import PropTypes from "prop-types";
import BillProducts from "./BillProducts";
import { useEffect } from "react";

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
  console.log(purchased);
  console.log("Component is rendered");
  useEffect(() => {
    let total = purchased.reduce((accumulator, product) => {
      console.log("useEffect is working");
      const productTotal = parseFloat(product.total);
      if (!isNaN(productTotal)) {
        return accumulator + productTotal;
      } else {
        return accumulator; // Ignore invalid total values
      }
    }, 0);
    if (foundCustomer.outstanding) {
      total += Number(foundCustomer.outstanding);
    }
    total -= Number(discount);

    setTotal(Math.ceil(total.toFixed(2)));
  }, [purchased, foundCustomer, discount]);

  return (
    <div className="relative">
      <table className="min-w-full mt-6">
        <thead>
          <tr>
            <th className="text-2xl">Action</th>

            <th className="text-2xl">Name</th>
            <th className="text-2xl">Price</th>
            <th className="text-2xl">Toggle</th>
            <th className="text-2xl">Piece</th>
            <th className="text-2xl">Packet</th>
            <th className="text-2xl">Box</th>
            <th className="text-2xl">Discount</th>
            <th className="text-2xl">Total</th>
          </tr>
        </thead>
        <tbody className="mt-20">
          {purchased.map((product, productIndex) => {
            console.log(product);
            return (
              <BillProducts
                product={product}
                key={productIndex}
                index={productIndex}
                purchased={purchased}
                setPurchased={setPurchased}
              />
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex-col items-end justify-end flex">
        <div className="mt-6 border border-black border-dashed border-spacing-2 min-w-[200px]"></div>

        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Total Bill:</span>
            {total - (foundCustomer.outstanding || 0)}₹
          </p>
          <div className="min-w-[200px] ">
            <p className="text-end text-xl mr-9 font-bold">
              <span className="px-16">OutStanding:</span>
              {foundCustomer.outstanding}₹
            </p>
          </div>

          <p className="text-end text-xl mr-9 font-bold">
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
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Total:</span>
            {total}₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Payment:</span>
            <input
              type="number"
              className="text-end max-w-[70px]"
              value={payment}
              onChange={(e) => {
                setPayment(e.target.value);
              }}
            />
            ₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
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
