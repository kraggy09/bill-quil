import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../constant";
import { fetchDailyReport } from "../store/reportSlice";
import { fetchProducts } from "../store/productSlice";
import RequestShimmer from "../components/RequestShimmer";
import { FaCheck } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { calculateDate, calculateTime } from "../libs/constant";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
const InventoryRequest = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [inventoryRequests, setInventoryRequests] = useState(null);
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
        toast.success(res.data.msg);
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
    <div className="  max-h-[30vh] max-w-[80vw] overflow-auto scrollbar-hide min-h-[40%]">
      <Toaster position="top-center" reverseOrder={false} />

      <p className=" font-bold  pl-16 py-2">Inventory Update Request</p>
      {inventoryRequests == null ? (
        <RequestShimmer />
      ) : (
        inventoryRequests.length > 0 && (
          <div className="min-w-full flex  overflow-y-auto scrollbar-hide max-h-[70%] items-center justify-center overflow-auto">
            <table className="min-w-[90%]  overflow-scroll">
              <thead>
                <tr className="bg-slate-200 border border-black">
                  <th className=" ">Date</th>

                  <th className="">Time</th>
                  <th className="">Request</th>
                  <th className="">Name</th>
                  <th className="px-1">Request Stock</th>
                  <th className="px-1">Current Stock</th>
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
                        <td className="font-semibold capitalize text-center px-1">
                          {calculateDate(new Date(inv.date))}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {calculateTime(new Date(inv.date))}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {inv.createdBy}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {inv.product.name}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {inv.oldStock % 1 != 0
                            ? inv.oldStock.toFixed(3)
                            : inv.oldStock}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {inv.product.stock % 1 != 0
                            ? inv.product.stock.toFixed(3)
                            : inv.product.stock}
                        </td>
                        <td className="font-semibold capitalize text-center px-1">
                          {inv.quantity}
                        </td>
                        {user.isAdmin && (
                          <>
                            <td
                              onClick={() => handleInventoryAcceptance(inv)}
                              className="font-semibold capitalize text-center px-1"
                            >
                              <p className="flex items-center font-bold justify-center bg-green-200 mx-4  rounded-lg my-1 px-2 py-1 text-green-800 hover:cursor-pointer">
                                <IoMdCheckmark />
                              </p>
                            </td>
                            <td
                              onClick={() => handleRejection(inv._id)}
                              className="font-semibold capitalize text-center px-1"
                            >
                              <p className="flex items-center font-bold justify-center bg-red-200 mx-4  rounded-lg px-2 py-1 text-red-800 hover:cursor-pointer">
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
              className="bg-green-500 px-2 py-2 text-white hover:cursor-pointer rounded-lg"
            >
              <IoMdCheckmark size={20} />
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center min-h-[30vh] justify-center">
          <span className="flex bg-green-200 text-green-800 rounded-xl px-4 py-1 items-center justify-center">
            <span className="  font-semibold">
              No new request!! Inventory is up to date
            </span>
            <span className="bg-green-500 text-white py-1 px-2 mx-2 rounded-lg">
              <FaCheck />
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default InventoryRequest;
