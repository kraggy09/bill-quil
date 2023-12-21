import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../components/ProductsTable";
import ProductHeader from "../components/ProductHeader";

const ProductPage = () => {
  const navigate = useNavigate();
  const products = useSelector((store) => store.product.products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const user = useSelector((store) => store.user);

  const calculateStock = () => {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      let temp = products[i].stock * products[i].costPrice;
      total += temp;
    }
    return total;
  };
  return (
    <div className="ml-6">
      {user.isAdmin && (
        <div className="px-20 pt-3 min-w-full font-bold text-2xl ">
          Your Current Stock Value: ₹{calculateStock().toFixed(3)}
        </div>
      )}
      <div className="relative min-h-[95vh]  min-w-[85vw]">
        <ProductHeader
          setFilteredProducts={setFilteredProducts}
          filteredProducts={filteredProducts}
        />
        <ProductsTable
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
        <button
          className="rounded-full absolute bottom-28 right-8 font-bold hover:bg-green-700 p-5 bg-green-500 text-white text-3xl"
          onClick={() => navigate("/newProduct")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
