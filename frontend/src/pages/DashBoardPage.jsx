import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

import { IoMdCheckmark } from "react-icons/io";

import { IoCloseSharp } from "react-icons/io5";

import { calculateDate, calculateTime } from "../libs/constant";

import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../constant";
import RequestShimmer from "../components/RequestShimmer";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { fetchDailyReport } from "../store/reportSlice";
import { fetchProducts } from "../store/productSlice";

import { useDispatch } from "react-redux";

const DashBoardPage = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [inventoryRequests, setInventoryRequests] = useState(null);
  const [days, setDays] = useState("1d");
  const handleRejection = async (id) => {
    try {
      const response = await axios.delete(
        apiUrl + "/products/deleteInventoryRequest",
        {
          data: { id: id },
        }
      );
      if (response) {
        toast.success("Request Rejected");
      }
      setInventoryRequests(null);
      onLoad();
      console.log(response.data);
    } catch (error) {
      console.error("Error handling rejection:", error);
    }
  };

  const handleInventoryAcceptance = async (data) => {
    try {
      setInventoryRequests(null);

      const res = await axios.post(
        apiUrl + "/products/acceptInventoryRequest",
        { inv: data }
      );
      if (res) {
        onLoad();
        dispatch(fetchProducts());
        dispatch(fetchDailyReport());
      }
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const hadleAllInventoryAccept = async () => {
    setInventoryRequests(null);
    try {
      const res = await axios.post(
        apiUrl + "/products/updateAllInventroryRequests",
        inventoryRequests
      );
      if (res) {
        toast.success("All Products Updated Successfully");
        onLoad();
        dispatch(fetchDailyReport());
        dispatch(fetchProducts());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onLoad = async () => {
    const res = await axios.get(apiUrl + "/products/requests");
    console.log(res.data);
    setInventoryRequests(res.data.inventory);
  };
  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className="ml-24 flex min-w-[90vw]">
      <ToastContainer autoClose={2000} />
      <div className="min-w-[70%]">
        <div className=" min-w-[70%]  min-h-[60vh] max-h-[60%] ">
          <div className="min-w-full flex items-center justify-center">
            <span className="text-xl font-bold bg-green-200 px-6 py-2 rounded-xl mt-16">
              Hello, Sultan Communication & General Stores
            </span>
          </div>
          <div className="min-w-full">
            <div className="grid items-center max-w-[50%] my-3 mx-6 gap-x-12 gap-y-8 grid-cols-2">
              <div className="min-h-[150px] max-h-64 max-w-[350px] border-2 border-cyan-500 bg-cyan-300  rounded-3xl text-3xl font-bold text-cyan-900 flex items-center justify-center shadow-lg px-6 mx-6">
                SALES
              </div>
              <div className="min-h-[150px] max-h-64 max-w-[350px] border-2 border-red-500 bg-red-300  rounded-3xl text-3xl font-bold text-red-900 flex items-center justify-center shadow-lg px-6 mx-6">
                PAYMENT
              </div>
              <div className="min-h-[150px] max-h-64 max-w-[350px] border-2 border-purple-500 bg-purple-300  rounded-3xl text-3xl font-bold text-purple-900 flex items-center justify-center shadow-lg px-6 mx-6">
                PROFIT
              </div>

              <div className="min-h-[150px] max-h-64 max-w-[350px] border-2 border-green-500 bg-green-300  rounded-3xl text-3xl font-bold text-green-900 flex items-center justify-center shadow-lg px-6 mx-6">
                TRANSACTION
              </div>
              <div className="min-h-[30px] min-w-64 col-span-2 flex justify-around items-center ">
                <button
                  onClick={() => setDays("1d")}
                  className={`px-4 py-1 ${
                    days === "1d"
                      ? "bg-cyan-300 text-cyan-800 font-bold rounded-lg"
                      : "bg-gray-300 text-gray-500 rounded-lg"
                  }`}
                >
                  1d
                </button>
                <button
                  onClick={() => setDays("7d")}
                  className={`px-4 py-1 ${
                    days === "7d"
                      ? "bg-cyan-300 text-cyan-800 font-bold rounded-lg"
                      : "bg-gray-300 text-gray-500 rounded-lg"
                  }`}
                >
                  7d
                </button>
                <button
                  onClick={() => setDays("15d")}
                  className={`px-4 py-1 ${
                    days === "15d"
                      ? "bg-cyan-300 text-cyan-800 font-bold rounded-lg"
                      : "bg-gray-300 text-gray-500 rounded-lg"
                  }`}
                >
                  15d
                </button>
                <button
                  onClick={() => setDays("25d")}
                  className={`px-4 py-1 ${
                    days === "25d"
                      ? "bg-cyan-300 text-cyan-800 font-bold rounded-lg"
                      : "bg-gray-300 text-gray-500 rounded-lg"
                  }`}
                >
                  25d
                </button>
                <button
                  onClick={() => setDays("30d")}
                  className={`px-4 py-1 ${
                    days === "30d"
                      ? "bg-cyan-300 text-cyan-800 font-bold rounded-lg"
                      : "bg-gray-300 text-gray-500 rounded-lg"
                  }`}
                >
                  30d
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" min-w-[70%] overflow-y-auto scrollbar-hide max-h-[40vh] min-h-[40%] bg-slate-100">
          <div className="text-xl font-bold  pl-16 py-2">
            Inventory Update Request
          </div>
          {inventoryRequests == null ? (
            <RequestShimmer />
          ) : (
            inventoryRequests.length > 0 && (
              <div className="min-w-full flex max-h-[80%] items-center justify-center overflow-auto">
                <table className="min-w-[90%]  overflow-scroll">
                  <thead>
                    <tr className="bg-slate-200 border border-black">
                      <th className=" ">Date</th>

                      <th className="">Time</th>
                      <th className="">Request</th>
                      <th className="">Name</th>
                      <th className="px-3">Request Stock</th>
                      <th className="px-3">Current Stock</th>
                      <th className="">Quantity</th>
                      {user.isAdmin && (
                        <>
                          <th className="">Approve</th>
                          <th className="">Reject</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryRequests &&
                      inventoryRequests.map((inv) => {
                        return (
                          <tr className="border border-black" key={inv._id}>
                            <td className="font-semibold capitalize text-center px-3">
                              {calculateDate(new Date(inv.date))}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {calculateTime(new Date(inv.date))}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {inv.createdBy}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {inv.product.name}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {inv.oldStock}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {inv.product.stock}
                            </td>
                            <td className="font-semibold capitalize text-center px-3">
                              {inv.quantity}
                            </td>
                            {user.isAdmin && (
                              <>
                                <td
                                  onClick={() => handleInventoryAcceptance(inv)}
                                  className="font-semibold capitalize text-center px-3"
                                >
                                  <p className="flex items-center font-bold justify-center bg-green-200 mx-4 py-[2px] rounded-xl text-green-800 hover:cursor-pointer">
                                    <IoMdCheckmark />
                                  </p>
                                </td>
                                <td
                                  onClick={() => handleRejection(inv._id)}
                                  className="font-semibold capitalize text-center px-3"
                                >
                                  <p className="flex items-center font-bold justify-center bg-red-200 mx-4 py-[2px] rounded-xl text-red-800 hover:cursor-pointer">
                                    <IoCloseSharp />
                                  </p>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )
          )}
          {inventoryRequests && inventoryRequests.length > 0 ? (
            <div className=" my-6 flex items-end justify-end mr-12">
              {user.isAdmin && (
                <span
                  onClick={() => {
                    hadleAllInventoryAccept();
                  }}
                  className="bg-green-500 px-4 py-3 text-white hover:cursor-pointer rounded-xl"
                >
                  <IoMdCheckmark size={30} />
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center min-h-[30vh] justify-center">
              <span className="flex bg-green-200 text-green-800 rounded-xl px-4 py-1 items-center justify-center">
                <span className=" text-xl font-semibold">
                  No new request!! Inventory is up to date
                </span>
                <span className="bg-green-500 text-white py-1 px-2 mx-2 rounded-lg">
                  <FaCheck />
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-[30%] min-w-[30%] min-h-[100vh] bg-red-200"></div>
      <Link to={"/newbill"}>
        <button className="rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
          <AiOutlinePlus className=" text-white font-extrabold" />
        </button>
      </Link>
    </div>
  );
};

export default DashBoardPage;
