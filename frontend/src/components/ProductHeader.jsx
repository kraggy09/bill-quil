import { useEffect, useState } from "react";
import { sortArray } from "../libs/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const sortByLessStock = (a, b) => {
  const diffA = Number(a.minQuantity - a.stock);
  const diffB = b.minQuantity - b.stock;
  console.log("Difference A:", diffA);
  console.log("Difference B:", diffB);
  return diffB - diffA;
};

const sortByName = (a, b) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

const ProductHeader = ({ filteredProducts, setFilteredProducts }) => {
  console.log(filteredProducts);
  const [query, setQuery] = useState("");
  const product = useSelector((store) => store.product.products);
  const originalProducts = product; // Store the original products
  const navigate = useNavigate();

  const searchProduct = () => {
    return originalProducts.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        // Query is not a valid number, so search by name
        return product.name.toLowerCase().includes(query.toLowerCase());
      } else {
        // Query is a valid number, so search by barcode
        return product.barcode.includes(queryValue);
      }
    });
  };

  useEffect(() => {
    if (query.length === 0) {
      setFilteredProducts(originalProducts); // Reset to original products
    } else {
      let products = searchProduct();
      setFilteredProducts(products);
    }
  }, [query, originalProducts, setFilteredProducts]);

  useEffect(() => {
    handleSortByName();
  }, []);

  const handleSortStock = () => {
    const sortedProducts = sortArray([...filteredProducts], sortByLessStock);
    console.log("You have called sorting");
    setFilteredProducts(sortedProducts);
  };

  const handleSortByName = () => {
    const sortedProducts = sortArray([...filteredProducts], sortByName);
    setFilteredProducts(sortedProducts);
  };

  return (
    <div>
      <div className="flex min-w-full px-6 my-2 items-center justify-start ">
        <span className="px-16 text-2xl font-bold">Search for Product</span>
        <input
          type="text"
          className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
          className="bg-green-500 mx-10 text-white p-2 rounded-xl font-bold"
          onClick={handleSortStock}
        >
          Sort Stock
        </button>
        <button
          className="bg-green-500 mx-6 text-white p-2 rounded-xl font-bold"
          onClick={handleSortByName}
        >
          Sort Name
        </button>
        <button
          className="bg-green-200 border border-green-500 text-green-800 mx-6  p-2 rounded-xl font-bold"
          onClick={() => navigate("/updateStock")}
        >
          Update Stock
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;
