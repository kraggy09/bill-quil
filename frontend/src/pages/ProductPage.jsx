import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../components/ProductsTable";
import ProductHeader from "../components/ProductHeader";

const ProductPage = () => {
  const navigate = useNavigate();
  const products = useSelector((store) => store.product.products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);

  const totalStockValue = useMemo(() => {
    let total = 0;
    for (let i = 0; i < filteredProducts.length; i++) {
      let temp = filteredProducts[i].stock * filteredProducts[i].costPrice;
      total += temp;
    }
    return total;
  }, [filteredProducts]);
  return (
    <div className="pl-24 min-w-full max-w-full">
      <div className="relative">
        <ProductHeader
          setFilteredProducts={setFilteredProducts}
          filteredProducts={filteredProducts}
          totalStockValue={totalStockValue}
          setCurrentPage={setCurrentPage}
        />
        <ProductsTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
        <button
          className="rounded-xl  absolute bottom-4 right-6 font-bold hover:bg-green-200 px-5 py-3 bg-green-100 text-green-800 border border-green-100 text-3xl"
          onClick={() => navigate("/newProduct")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
