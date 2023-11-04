import { useEffect, useState } from "react";
import { sortArray } from "../libs/constant";
import { useSelector } from "react-redux";

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

  const searchProduct = () => {
    return originalProducts.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        // Query is not a valid number, so search by name
        return product.name.toLowerCase().includes(query);
      } else {
        // Query is a valid number, so search by barcode
        return product.barcode === queryValue;
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
      <button onClick={handleSortStock}>Sort Stock</button>
      <button onClick={handleSortByName}>Sort Name</button>
      <input
        type="text"
        className="bg-gray-300 text-black"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
    </div>
  );
};

export default ProductHeader;
