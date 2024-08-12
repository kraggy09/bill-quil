import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { CiWarning } from "react-icons/ci";
import axios from "axios";
import { IoTrashBin } from "react-icons/io5";
import { apiUrl } from "../constant";
import { Toaster, toast } from "react-hot-toast";

import Loading from "./Loading";
import { fetchProducts } from "../store/productSlice";
import { calculateMeasuring } from "../libs/constant";

const ProductsTable = ({ filteredProducts, setFilteredProducts }) => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const itemsPerPage = 10; // Number of items to display per page
  const [deleted, setDeleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(deleted);

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/products/delete`, {
        params: deleted, // Include `deleted` in the request body
      });

      console.log("Product deleted successfully:", res.data);
      toast.success("Product deleted successfully");

      // Handle success (e.g., update state, notify user)
      // ... your success handling logic here ...
    } catch (error) {
      console.error("Error deleting product:", error.message || error);
      toast.error("Error deleting product" + error.message);
      // Notify the user of the error
      // ... your error handling logic here ...
    } finally {
      setLoading(false);
      setDeleted(null);
      dispatch(fetchProducts());
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Function to change the current page
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  // Function to go to the next page
  const goToNextPage = () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  };

  return (
    <div className="relative max-w-[100vw]">
      <Toaster position="top-center" reverseOrder={false} />

      {loading && <Loading />}
      {deleted && (
        <div className="fixed inset-0 flex items-center justify-center z-20  bg-opacity-30 bg-black ">
          <div className="bg-white min-w-[20vw] min-h-[30vh] ">
            <div className="flex flex-col items-center mb-2 justify-center">
              <div
                className="rounded-full text-red-800 bg-red-200 my-2
               p-2 text-xl"
              >
                <CiWarning />
              </div>
              <p className="text-md">Are you sure you want to delete </p>
            </div>
            <h1 className="capitalize font-bold text-center my-2 bg-red-200">
              {deleted.name}
            </h1>
            <div className="">
              <h2>
                Stock:
                {deleted.stock % 1 != 0
                  ? deleted.stock.toFixed(3)
                  : deleted.stock}
              </h2>
            </div>
            <div className="flex items-center flex-wrap my-3 mx gap-x-2">
              <p className=""> Barcode:</p>
              {deleted.barcode.map((b) => {
                return (
                  <p
                    className="bg-green-200 rounded-xl text-green-800 px-2 py-1"
                    key={b}
                  >
                    {b}
                  </p>
                );
              })}
            </div>

            <div className="flex my-8 px-3  gap-x-6 ">
              <button
                onClick={() => {
                  setDeleted(null);
                }}
                className="p-2 bg-gray-200 flex font-bold  min-w-[50%] items-center justify-center rounded-lg "
              >
                <MdCancel size={25} />
                Cancel
              </button>
              <button
                onClick={deleteProduct}
                className=" min-w-[40%] bg-red-200 p-2 rounded-lg font-bold flex items-center justify-center  text-red-700"
              >
                <IoTrashBin size={25} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <table className="min-w-[95%] ml-8">
        <thead>
          <tr>
            <th className="text-start ">Barcode</th>
            <th className="text-start ">Name</th>
            <th className="text-start ">MRP ₹</th>
            {user.isAdmin && <th className="text-start ">CP ₹</th>}
            <th className="text-start ">RP ₹</th>
            <th className="text-start ">WP ₹</th>
            <th className="text-start ">SWP ₹</th>
            <th className="text-start ">Stock</th>
            <th className="text-start ">Packet</th>
            <th className="text-start ">Box</th>
            {user.isAdmin && <th className="text-start ">Del</th>}
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => {
            return (
              <tr key={product.id}>
                <td className="text-start font-semibold  py-2 ">
                  <div className="hover:cursor-pointer h-fit">
                    <span
                      onClick={() => {
                        navigate(`/products/barcode/${product.barcode[0]}`, {
                          state: product.barcode,
                        });
                      }}
                      className="bg-green-300  mx-1 my-2 px-2 rounded-md py-1 "
                    >
                      {" "}
                      {product.barcode[0]}
                    </span>
                    {product.barcode.length - 1 > 0 && (
                      <sup className="px-2 py-1 text-sm rounded-lg bg-yellow-400  ">
                        +{product.barcode.length - 1}
                      </sup>
                    )}
                  </div>
                </td>
                <td className="text-start  hover:cursor-pointer capitalize font-semibold  py-2">
                  <div
                    onClick={() =>
                      user.isAdmin &&
                      navigate(`/products/${product._id}`, { state: product })
                    }
                    className="hover:bg-green-200 hover:text-green-800 w-fit px-2 py-1 rounded-lg"
                  >
                    {product.name}
                  </div>
                </td>
                <td className="text-start font-semibold  py-2">
                  <div className="">{product.mrp}</div>
                </td>
                {user.isAdmin && (
                  <td className="text-start font-semibold  py-2">
                    <div className="">{product.costPrice}</div>
                  </td>
                )}
                <td className="text-start font-semibold  py-2">
                  <div className="">{product.retailPrice}</div>
                </td>
                <td className="text-start font-semibold  py-2">
                  <div className="">
                    {product.wholesalePrice % 1 != 0
                      ? product.wholesalePrice.toPrecision(3)
                      : product.wholesalePrice}
                  </div>
                </td>
                <td className="text-start font-semibold  py-2">
                  <div className="">
                    {product.superWholesalePrice % 1 != 0
                      ? product.superWholesalePrice.toPrecision(3)
                      : product.superWholesalePrice}
                  </div>
                </td>
                <td className="text-start hover:cursor-pointer font-semibold  py-2">
                  <span
                    onClick={() => {
                      user.isAdmin &&
                        navigate(`/products/updateStock/${product._id}`, {
                          state: product,
                        });
                    }}
                    className={`px-2 rounded-lg ${
                      product.stock <= product.minQuantity
                        ? "bg-red-500 text-white"
                        : ""
                    }`}
                  >
                    {product.measuring === "kg"
                      ? calculateMeasuring(product.stock)
                      : product.stock % 1 != 0
                      ? product.stock.toPrecision(3)
                      : product.stock}
                  </span>
                </td>
                <td className="text-start font-semibold  py-2">
                  {product.packet}
                </td>
                <td className="text-start font-semibold  py-2">
                  {product.box}
                </td>
                {user.isAdmin && (
                  <td className="mx-auto">
                    <div
                      onClick={() => {
                        setDeleted(product);
                      }}
                      className="hover:cursor-pointer p-2 w-fit hover:bg-red-200 hover:text-red-700 rounded-lg"
                    >
                      <IoTrashBin size={18} className="" />
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center my-4">
        <button
          onClick={goToPreviousPage}
          className={` mx-2 py-1 ${
            currentPage === 1
              ? "text-gray-500"
              : "text-blue-500 hover:text-blue-500"
          }`}
        >
          Previous
        </button>

        <div className=" rounded-xl px-5 py-2 bg-green-500 mx-3  text-white">
          {currentPage}
        </div>
        <button
          onClick={goToNextPage}
          className={` mx-2 py-1 ${
            currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
              ? "text-gray-500"
              : "text-blue-500 hover:text-blue-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsTable;

ProductsTable.propTypes = {
  filteredProducts: PropTypes.array.isRequired,
  setFilteredProducts: PropTypes.func.isRequired,
};
