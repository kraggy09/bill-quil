import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ProductsTable = ({ filteredProducts, setFilteredProducts }) => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const itemsPerPage = 10; // Number of items to display per page

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
    <div className="relative">
      <table className="min-w-full ml-8">
        <thead>
          <tr>
            <th className="text-start text-xl">Barcode</th>
            <th className="text-start text-xl">Name</th>
            <th className="text-start text-xl">MRP ₹</th>
            {user.isAdmin && <th className="text-start text-xl">CP ₹</th>}
            <th className="text-start text-xl">RP ₹</th>
            <th className="text-start text-xl">WP ₹</th>
            <th className="text-start text-xl">SWP ₹</th>
            <th className="text-start text-xl">Stock</th>
            <th className="text-start text-xl">Packet</th>
            <th className="text-start text-xl">Box</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => {
            return (
              <tr key={product.id}>
                <td className="text-start font-semibold text-xl py-2 ">
                  <div className="hover:cursor-pointer  max-w-[140px]">
                    <span
                      onClick={() => {
                        navigate(`/products/barcode/${product.barcode[0]}`, {
                          state: product.barcode,
                        });
                      }}
                      className="bg-green-300  mx-1 my-2 px-2 rounded-xl py-1 "
                    >
                      {" "}
                      {product.barcode[0]}
                    </span>
                    {product.barcode.length - 1 > 0 && (
                      <span className="ml-3 rounded-full bg-yellow-400 px-3 py-2 ">
                        +{product.barcode.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-start hover:cursor-pointer capitalize font-semibold text-xl py-2">
                  <div
                    onClick={() =>
                      user.isAdmin &&
                      navigate(`/products/${product._id}`, { state: product })
                    }
                    className=""
                  >
                    {product.name}
                  </div>
                </td>
                <td className="text-start font-semibold text-xl py-2">
                  <div className="">{product.mrp}</div>
                </td>
                {user.isAdmin && (
                  <td className="text-start font-semibold text-xl py-2">
                    <div className="">{product.costPrice}</div>
                  </td>
                )}
                <td className="text-start font-semibold text-xl py-2">
                  <div className="">{product.retailPrice}</div>
                </td>
                <td className="text-start font-semibold text-xl py-2">
                  <div className="">
                    {product.wholesalePrice % 1 != 0
                      ? product.wholesalePrice.toPrecision(3)
                      : product.wholesalePrice}
                  </div>
                </td>
                <td className="text-start font-semibold text-xl py-2">
                  <div className="">
                    {product.superWholesalePrice % 1 != 0
                      ? product.superWholesalePrice.toPrecision(3)
                      : product.superWholesalePrice}
                  </div>
                </td>
                <td className="text-start hover:cursor-pointer font-semibold text-xl py-2">
                  <span
                    onClick={() => {
                      user.isAdmin &&
                        navigate(`/products/updateStock/${product._id}`, {
                          state: product,
                        });
                    }}
                    className={`px-2 rounded-xl ${
                      product.stock <= product.minQuantity
                        ? "bg-red-500 text-white"
                        : ""
                    }`}
                  >
                    {product.stock % 1 != 0
                      ? product.stock.toPrecision(3)
                      : product.stock}
                  </span>
                </td>
                <td className="text-start font-semibold text-xl py-2">
                  {product.packet}
                </td>
                <td className="text-start font-semibold text-xl py-2">
                  {product.box}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center my-4">
        <button
          onClick={goToPreviousPage}
          className={`text-xl mx-2 py-1 ${
            currentPage === 1
              ? "text-gray-500"
              : "text-blue-500 hover:text-blue-500"
          }`}
        >
          Previous
        </button>

        <div className="text-2xl rounded-xl px-5 py-2 bg-green-500 mx-3  text-white">
          {currentPage}
        </div>
        <button
          onClick={goToNextPage}
          className={`text-xl mx-2 py-1 ${
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
