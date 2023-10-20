import PropTypes from "prop-types";
import BillProducts from "./BillProducts";

const BillTable = ({ foundCustomer, purchased, setPurchased }) => {
  console.log(purchased);
  return (
    <div className="relative">
      <table className="min-w-full mt-6">
        <thead>
          <tr>
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
            return (
              <BillProducts
                product={product}
                key={productIndex}
                index={productIndex}
                setPuchased={setPurchased}
              />
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex-col items-end justify-end flex">
        <div className="mt-6 border border-black border-dashed border-spacing-2 min-w-[200px]"></div>

        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">OutStanding:</span>
            {foundCustomer.outstanding}₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Discount:</span>100₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Total:</span>1500₹
          </p>
        </div>
        <div className="min-w-[200px] ">
          <p className="text-end text-xl mr-9 font-bold">
            <span className="px-16">Payment:</span>100₹
          </p>
        </div>
      </div>
    </div>
  );
};

BillTable.propTypes = {
  foundCustomer: PropTypes.object.isRequired,
  purchased: PropTypes.array.isRequired,
  setPurchased: PropTypes.func.isRequired,
};

export default BillTable;
