import React from "react";
import PropTypes from "prop-types";
import {
  calculateDate,
  calculateMeasuring,
  calculateTime,
} from "../libs/constant";

const PrintBill = React.forwardRef(
  (
    {
      foundCustomer,
      purchased,
      payment,
      total,
      discount,
      billId,
      createdAt,
      withMRP,
    },
    ref
  ) => {
    // console.log(billId);
    // console.log(foundCustomer, purchased);
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
        className="min-h-[90vh] bg-white absolute min-w-[100vw] upper flex justify-start items-start"
      >
        <div className="max-h-[85vh] scrollbar-hide overflow-y-scroll ml-6 min-w-[480px] mt-3 max-w-[510px]  border-2 rounded-lg border-black">
          <div className="min-w-[98%] flex justify-start rounded-xl   mx-1 mr- my-2 border-2 border-black">
            <div className="max-w-[55%] border-r-2 border-black pl-3">
              <p className="italic capitalize font-bold  max-w-[90%]">
                Sultan Communication & General Stores
              </p>

              <p className="text-sm my-1 font-semibold text-gray-800">
                Mob:9370564909 / 9145506000
              </p>
              <p className="text-sm my-1 font-semibold text-gray-800">
                Bill No. B-{billId}
              </p>
            </div>
            <div className="pl-2">
              <p className="font-semibold text-md italic">
                Time:
                {createdAt
                  ? calculateDate(new Date(createdAt))
                  : calculateDate(new Date())}
                {"     "}
                {createdAt
                  ? calculateTime(new Date(createdAt))
                  : calculateTime(new Date())}
              </p>
              <span className="flex font-semibold">
                Customer:
                <p className="capitalize italic">
                  {foundCustomer != null && foundCustomer.name}
                </p>
              </span>
              <span className="flex font-semibold">
                Mobile:
                <p className="capitalize italic">
                  {foundCustomer != null && foundCustomer.phone}
                </p>
              </span>
            </div>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="border border-black">Sr No.</th>
                <th className="border border-black">Name</th>
                <th className="border border-black">Quantity</th>
                {withMRP && (
                  <>
                    <th className="border border-black">Price</th>
                    <th className="border border-black">MRP</th>
                  </>
                )}
                <th className="border border-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchased &&
                [...purchased].reverse().map((product, idx) => {
                  console.log(product, idx);
                  const total =
                    product.piece +
                    product.box * product.boxQuantity +
                    product.packet * product.packetQuantity;
                  const price = product.price;

                  return (
                    <tr key={product._id} className="border border-black">
                      <td>
                        <p className="text-center capitalize">{idx + 1}</p>
                      </td>
                      <td>
                        <p className="text-center capitalize">{product.name}</p>
                      </td>

                      <td>
                        <p className="text-center">
                          {" "}
                          {product.measuring === "kg"
                            ? calculateMeasuring(total)
                            : total % 1 != 0
                            ? total.toFixed(3)
                            : total}
                        </p>
                      </td>
                      {withMRP && (
                        <>
                          <td>
                            <p className="text-center">
                              {price % 1 != 0 ? price.toFixed(2) : price}
                            </p>
                          </td>
                          <td>
                            <p className="text-center"> {product.mrp}</p>
                          </td>
                        </>
                      )}
                      <td>
                        <p className="text-center">
                          {(price * total - product.discount) % 1 != 0
                            ? (price * total - product.discount).toFixed(2)
                            : price * total - product.discount}
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="min-w-full mt-6 flex flex-col pr-6 justify-end items-end">
            <div className="">
              Bill Total:
              {total + Number(discount) - foundCustomer.outstanding || 0}
            </div>
            {foundCustomer.outstanding > 0 ? (
              <div>Outstanding:+{foundCustomer.outstanding}</div>
            ) : (
              foundCustomer.outstanding < 0 && (
                <div>Balance:{foundCustomer.outstanding}</div>
              )
            )}
            {discount > 0 && <div>Discount: -{discount}</div>}

            <div className="">Total:{total}</div>
            <div className="">Payment:{payment == null ? 0 : payment}</div>
            <div className="">
              {total - payment > 0 ? (
                <span>Outstanding:{total - payment}</span>
              ) : (
                <span>Balance: {total - payment}</span>
              )}
            </div>
            <div className="mt-6 font-bold text-2xl">
              You Saved:{calculateSave(purchased).toFixed(3)}
            </div>
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
  payment: PropTypes.string,
  discount: PropTypes.number,
  withMRP: PropTypes.number,
  billId: PropTypes.number,
  createdAt: PropTypes.string,
};

PrintBill.displayName = "PrintBill";

export default PrintBill;
