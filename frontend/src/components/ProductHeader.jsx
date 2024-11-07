import { useCallback, useEffect, useState } from "react";
import { sortArray } from "../libs/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

const sortByLessStock = (a, b) => {
  const diffA = Number(a.stock);
  const diffB = b.stock;
  return diffA - diffB;
};

const sortByName = (a, b) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

const ProductHeader = ({
  filteredProducts,
  setFilteredProducts,
  setCurrentPage,
  totalStockValue,
}) => {
  const [query, setQuery] = useState("");
  const product = useSelector((store) => store.product.products);
  const categories = useSelector((store) => store.categories.categories);
  // console.log(categories);

  const user = useSelector((store) => store.user);
  const [currentCategory, setCurrentCategory] = useState(["all"]);
  console.log(currentCategory, "Currentcategory");

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "all") {
      setCurrentCategory(["all"]);
    } else {
      setCurrentPage(1);
      if (currentCategory.includes("all")) {
        setCurrentCategory([categoryName]);
      } else {
        setCurrentCategory((prevCategories) => {
          // Check if the category already exists to prevent duplicates
          if (prevCategories.includes(categoryName)) return prevCategories;
          return [...prevCategories, categoryName];
        });
      }
    }
  };

  const handleCategoryRemove = (categoryName) => {
    if (currentCategory.length === 1) {
      setCurrentCategory(["all"]);
      return;
    }
    setCurrentCategory((prevCategories) =>
      prevCategories.filter((cat) => cat !== categoryName)
    );
  };

  useEffect(() => {
    if (currentCategory.includes("all")) {
      console.log(product, "Product");

      setFilteredProducts(product);
    } else {
      let newProducts = product.filter((p) => {
        if (currentCategory.includes(p.category)) {
          return p;
        }
      });
      setFilteredProducts(newProducts);
    }
  }, [currentCategory, product, setFilteredProducts]);
  const originalProducts = product;
  const navigate = useNavigate();

  // Memoized search function
  const searchProduct = useCallback(() => {
    return originalProducts.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        return product.name.toLowerCase().includes(query.toLowerCase());
      } else {
        return product.barcode.includes(queryValue);
      }
    });
  }, [originalProducts, query]);

  // Update filtered products when query changes
  useEffect(() => {
    if (query.length === 0) {
      setCurrentPage(1);
      setFilteredProducts(originalProducts);
    } else {
      const products = searchProduct();
      setFilteredProducts(products);
    }
  }, [query, originalProducts, setFilteredProducts, searchProduct]);

  // Sort handlers
  const handleSortStock = () => {
    const sortedProducts = sortArray([...filteredProducts], sortByLessStock);
    setFilteredProducts(sortedProducts);
  };

  const handleSortByName = () => {
    const sortedProducts = sortArray([...filteredProducts], sortByName);
    setFilteredProducts(sortedProducts);
  };

  // Handle dropdown selection change
  const handleSortChange = (e) => {
    const sortOption = e.target.value;
    if (sortOption === "Stock") {
      handleSortStock();
    } else if (sortOption === "Name") {
      handleSortByName();
    }
  };

  return (
    <div className="pr-6 mt-1 flex flex-col pb-4 gap-y-3">
      <div
        id="filters"
        className="flex font-semibold items-center justify-between"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search for the product"
            className="bg-slate-100 border-black border rounded-lg focus:border-green-700 outline-none p-1 pl-8 min-w-[350px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IoSearch className="absolute left-2 top-1.5 font-bold" size={20} />
        </div>
        {user.isAdmin && (
          <h3 className="text-lg">
            Stock:
            <span className="ml-2 bg-green-300 text-green-700 px-2 py-1 rounded-lg font-semibold">
              {totalStockValue.toFixed(2)}
            </span>
          </h3>
        )}

        <div id="filter-buttons" className="flex gap-x-6">
          <select
            onChange={handleSortChange}
            defaultValue=""
            className="bg-slate-100 border border-black rounded-lg px-3 py-1 focus:outline-none focus:border-green-700 text-gray-700"
          >
            <option value="" disabled className="text-gray-400">
              Sort By
            </option>
            <option value="Stock">Stock</option>
            <option value="Name">Name</option>
          </select>

          <button
            className="bg-green-400 text-green-800 px-3 py-1 rounded-lg"
            onClick={() => navigate("/updateStock")}
          >
            Update Stock
          </button>
        </div>
      </div>
      <div
        id="category-holder"
        className="flex gap-x-5 my-3 overflow-x-auto scrollbar-hide"
      >
        <p
          onClick={(e) => {
            e.stopPropagation();
            handleCategoryClick("all");
          }}
          className={` capitalize  px-4 py-2 rounded-lg ${
            currentCategory.includes("all")
              ? "bg-green-300 text-green-800 font-semibold flex justify-center items-center gap-x-2"
              : "bg-slate-200"
          }`}
          key={"all"}
        >
          <span>All</span>
        </p>
        {categories &&
          categories.map((cat) => {
            return (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(cat.name.toLowerCase());
                }}
                className={`hover:cursor-pointer capitalize  px-4 py-2 rounded-lg ${
                  currentCategory.includes(cat.name)
                    ? "bg-green-300 text-green-800 font-semibold flex items-center gap-x-2"
                    : "bg-slate-200"
                }`}
                key={cat._id}
              >
                <span>{cat.name}</span>
                {currentCategory.includes(cat.name) && (
                  <MdOutlineCancel
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryRemove(cat.name);
                    }}
                    className="hover:cursor-pointer text-gray-400 hover:text-red-500"
                    size={23}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

ProductHeader.propTypes = {
  filteredProducts: PropTypes.array,
  setFilteredProducts: PropTypes.func,
  setCurrentPage: PropTypes.func,
  totalStockValue: PropTypes.number,
};

export default ProductHeader;
