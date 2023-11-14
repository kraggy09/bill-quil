import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../constant";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";
import { calculateDate, calculateTime } from "../libs/constant";

const SingleBill = () => {
  const apiEndPoint = "/getBillDetails";
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);
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
    <div>
      {loading && <Loading />}
      {bill && (
        <div className="relative">
          <header className="ml-6 text-xl font-semibold italic capitalize">
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
            <p>
              Date:
              <span className="border-b-2 border-green-500 px-3">
                {calculateDate(new Date(bill.createdAt)) +
                  "   " +
                  calculateTime(new Date(bill.createdAt))}
              </span>
            </p>
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
