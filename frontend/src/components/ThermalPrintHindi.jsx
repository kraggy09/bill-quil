import React from "react";
import PropTypes from "prop-types";
import {
  calculateDate,
  calculateTime,
  calculateMeasuring,
} from "../libs/constant";

const ThermalPrintHindi = React.forwardRef(
  ({ foundCustomer, purchased, payment, total, discount, billId }, ref) => {
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
      <div ref={ref} className="text-sm ">
        <header className="flex items-center flex-col justify-center">
          <h1 className="ml-1 font-bold">सुल्तान कम्यूनिकेशन & जनरल स्टोर्स</h1>
          <p className="text-xs font-semibold">ग्रीन लॅंड होटेल के पीछे</p>
          <p className="text-xs font-semibold">Mob:9370564909/9145506000</p>
          <div className="font-bold mt-3">
            ------------------------------------------------
          </div>
          <div className="text-xs justify-between font-semibold  flex ">
            <span id="left" className="mr-10">
              <p>चालान नं.: {billId}</p>
              <p>तारीख:{calculateDate(new Date())}</p>
            </span>
            <span id="right">
              <p>पेमेंट: {payment}</p>
              <p>समय : {calculateTime(new Date())}</p>
            </span>
          </div>
        </header>

        <div className="flex text-xs justify-around font-semibold">
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
        <p className="font-semibold text-xs ml-6">
          Total Items:{purchased.length}
        </p>

        <div className="font-bold mb-3">
          ------------------------------------------------
        </div>
        <main className="flex text-xs items-center font-semibold justify-center flex-col">
          <table className="min-w-full mx-6">
            <tbody>
              <tr>
                <th className="border border-black">नाम </th>
                <th className="border border-black">पीस</th>
                <th className="border border-black">दाम</th>
                <th className="border border-black">भाव</th>
                <th className="border border-black">टोटल</th>
              </tr>
              {purchased &&
                [...purchased].reverse().map((product) => {
                  // console.log(product, "current product");
                  const total =
                    product.piece +
                    product.box * product.boxQuantity +
                    product.packet * product.packetQuantity;
                  const price = product.price;

                  return (
                    <tr key={product._id} className="border border-black">
                      <td>
                        <p className="text-center capitalize">
                          {product?.hi || product.name}
                        </p>
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
                      <td>
                        <p className="text-center"> {product.mrp}</p>
                      </td>
                      <td>
                        <p className="text-center">
                          {price % 1 != 0 ? price.toFixed(2) : price}
                        </p>
                      </td>
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
          <div className="min-w-full mt-2 flex flex-col pr-2 justify-end items-end">
            <div className="">
              बिल:{total - foundCustomer.outstanding + Number(discount)}
            </div>
            {foundCustomer.outstanding > 0 ? (
              <div>बाकी:+{foundCustomer.outstanding}</div>
            ) : (
              foundCustomer.outstanding < 0 && (
                <div>जमा:-{foundCustomer.outstanding}</div>
              )
            )}
            {discount > 0 && <div>डिसकाउंट :-{discount}</div>}

            <div className="">टोटल:{total}</div>
            {payment > 0 && (
              <div className="">
                पेमेंट:{payment == null ? 0 : "-" + payment}
              </div>
            )}
            <div className="">
              {total - payment > 0 ? (
                <span>बाकी:{total - payment}</span>
              ) : (
                <span>जमा:{total - payment}</span>
              )}
            </div>
            {calculateSave(purchased) > 0 && (
              <>
                <div>------------------------------------------------</div>
                <div className="mt-2 font-bold flex min-w-full items-center justify-center text-2xl">
                  You Saved:{calculateSave(purchased).toFixed(3)}
                </div>
                <div>------------------------------------------------</div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }
);

ThermalPrintHindi.propTypes = {
  foundCustomer: PropTypes.object,
  setIsOpen: PropTypes.func,
  purchased: PropTypes.array,
  total: PropTypes.number,
  payment: PropTypes.string,
  discount: PropTypes.number,
};

ThermalPrintHindi.displayName = "ThermalPrintHindi";

export default ThermalPrintHindi;
