import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../constant";
import axios from "axios";
import { FaPrint } from "react-icons/fa";

axios.defaults.withCredentials = true;

import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";
import { calculateDate, calculateTime } from "../libs/constant";
import BillModal from "./BillModal";

const SingleBill = () => {
  const apiEndPoint = "/getBillDetails";
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  console.log(params);
  console.log(params.id);
  const { id } = params;
  const handleOnLoad = async () => {
    setLoading(true);

    try {
      const res = await axios.get(apiUrl + apiEndPoint, { params: { id } });
      console.log(res.data.bills);
      setBill(res.data.bills);
      setLoading(false);

      toast.success("Successfull");
    } catch (error) {
      setLoading(false);
      toast.error("Error from the server");

      console.log(error);
    }
  };

  const calculateBillAmount = () => {
    if (bill != null && bill.items) {
      const total = bill.items.reduce((ac, item) => {
        return ac + item.total;
      }, 0);
      return total;
    }
  };
  useEffect(() => {
    calculateBillAmount();
  }, [bill]);

  useEffect(() => {
    handleOnLoad();
  }, []);
  return (
    <div className="ml-24">
      {loading && <Loading />}
      {bill && (
        <div className="relative">
          <header className="ml-6 text-xl font-semibold italic capitalize">
            <p>
              Bill Id:
              <span className="border-b-2 border-green-500 px-3">
                {bill?.id?.id ? bill.id.id : "Old Bill"}
              </span>
            </p>
            <p>
              Name:
              <span className="border-b-2 border-green-500 px-3">
                {bill.customer.name}
              </span>
            </p>

            <p>
              Current Outstanding:{" "}
              <span className="border-b-2 border-red-700 px-3">
                {bill.customer.outstanding}
              </span>
            </p>
            <p>
              Mobile:{" "}
              <span className="border-b-2 border-green-500 px-3">
                {bill.customer.phone}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="border-b-2 border-green-500 px-3">
                Date:
                {calculateDate(new Date(bill.createdAt)) +
                  "   " +
                  calculateTime(new Date(bill.createdAt))}
              </span>
              <span
                onClick={() => setIsOpen(true)}
                className="flex hover:cursor-pointer flex-col items-center justify-center"
              >
                <FaPrint />
                Click to Reprint
              </span>
            </p>
            <BillModal
              isOpen={isOpen}
              purchased={
                bill &&
                bill.items.map((item) => {
                  console.log(
                    item.total,
                    item.total / item.quantity,
                    item.discount
                  );
                  return {
                    name: item.product.name,
                    mrp: item.product.mrp,
                    piece: item.quantity,
                    box: 0,
                    boxQuantity: 0,
                    packet: 0,
                    packetQuantity: 0,
                    price: item.total / item.quantity,
                    total: item.total,
                    discount: item.discount,
                  };
                })
              }
              foundCustomer={
                bill && {
                  phone: bill.customer.phone,
                  outstanding: bill.total - calculateBillAmount(),
                  name: bill.customer.name,
                }
              }
              setIsOpen={setIsOpen}
              total={bill && bill.total}
              payment={bill && bill.payment}
              discount={bill && bill.discount}
              billId={bill && bill?.id?.id ? bill.id.id : "Old Bill"}
            />
          </header>
          <table className="table-auto my-6 mx-16">
            <thead>
              <tr>
                <th className="px-16">Name</th>
                <th className="px-16">Quantity</th>
                <th className="px-16">Price</th>
                <th className="px-16">Total</th>
              </tr>
            </thead>
            <tbody className="text-xl font-semibold ">
              {bill.items.map((item) => {
                return (
                  <tr key={item._id}>
                    <td className="capitalize  pl-20">
                      <p className="text-start">{item.product.name}</p>
                    </td>
                    <td className="px-16">
                      <p className="text-center">{item.quantity}</p>
                    </td>
                    <td className="px-16">
                      <p className="text-center">
                        {" "}
                        {(item.total / item.quantity).toPrecision(3)}
                      </p>
                    </td>
                    <td className="px-16">{item.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="min-w-full flex mt-3 pr-20 items-end justify-end">
            <div className="flex flex-col text-xl font-semibold">
              <span className="border-t-2 pt-2 flex items-center justify-around border-black border-dashed ">
                <p>Total: </p>
                <p>{calculateBillAmount()}</p>
              </span>
              <span className=" flex items-center justify-around">
                <p>Prev:</p>
                <p>{bill.total - calculateBillAmount()}</p>
              </span>
              <span className="flex items-center justify-around">
                <p>Payment:</p>
                <p>{bill.payment}</p>
              </span>
              <span className="flex items-center justify-around">
                <p>Rem:</p>
                <p>{bill.total - bill.payment}</p>
              </span>
            </div>
          </div>
        </div>
      )}
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default SingleBill;
