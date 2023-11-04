import React from "react";
import PropTypes from "prop-types";
import getDate from "../../../backend/src/config/getDate";

const PrintBill = React.forwardRef(
  ({ foundCustomer, setIsOpen, purchased, payment, total, discount }, ref) => {
    console.log(foundCustomer, purchased);
    const calculateSave = (product) => {
      let saved = 0;
      for (let i = 0; i < product.length; i++) {
        const quantity =
          product[i].piece +
          product[i].box * product[i].boxQuantity +
          product[i].packet * product[i].packetQuantity;
        let temp = product[i].mrp * quantity;
        saved += temp - product[i].price * quantity;
      }
      return saved;
    };
    return (
      <div
        ref={ref}
        className="min-h-[90vh] bg-white absolute min-w-[95vw] upper flex justify-start items-start"
      >
        <div className="min-h-[92vh] ml-6 min-w-[480px] mt-3 max-w-[560px] border-2 border-black">
          <div className="min-w-[99%] uppercase font-bold m-1 border-2 border-black">
            <p>Sultan Communication & General Stores</p>
            <p>{foundCustomer != null && foundCustomer.name}</p>
            <p>Date:{getDate()}</p>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchased &&
                purchased.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>
                        <p className="text-center capitalize">{product.name}</p>
                      </td>
                      <td>
                        <p className="text-center"> {product.mrp}</p>
                      </td>
                      <td>
                        <p className="text-center">
                          {" "}
                          {product.piece +
                            product.box * product.boxQuantity +
                            product.packet * product.packetQuantity}
                        </p>
                      </td>
                      <td>
                        <p className="text-center">
                          {Math.ceil(product.price)}
                        </p>
                      </td>
                      <td>
                        <p className="text-center">
                          {product.price *
                            (product.piece +
                              product.packet * product.packetQuantity +
                              product.box * product.boxQuantity) -
                            product.discount}
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="min-w-full mt-6 flex flex-col pr-6 justify-end items-end">
            {}
            {discount > 0 && <div>Discount:{discount}</div>}

            <div className="">
              Bill Total:{total - foundCustomer.outstanding || 0}
            </div>
            {foundCustomer.outstanding > 0 && (
              <div>Outstanding:{foundCustomer.outstanding}</div>
            )}
            <div className="">Total:{total}</div>
            <div className="">Payment:{payment}</div>
            <div className="">
              {total - payment > 0 && (
                <span>Outstanding:{total - payment}</span>
              )}
            </div>
            <div className="">You Saved:{calculateSave(purchased)}</div>
          </div>
        </div>
      </div>
    );
  }
);

PrintBill.propTypes = {
  foundCustomer: PropTypes.object,
  setIsOpen: PropTypes.func,
  purchased: PropTypes.array,
  total: PropTypes.number,
  payment: PropTypes.number,
  discount: PropTypes.number,
};

PrintBill.displayName = "PrintBill";

export default PrintBill;
