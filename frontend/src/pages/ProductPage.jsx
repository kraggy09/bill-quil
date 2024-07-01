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
    <div className="pl-20 min-w-[90vw] max-w-full">
      {user.isAdmin && (
        <div className="pl-20 pt-3 min-w-full font-bold text-2xl ">
          Your Current Stock Value: ₹{calculateStock().toFixed(3)}
        </div>
      )}
      <div className="relative min-h-[90vh]  min-w-[85vw]">
        <ProductHeader
          setFilteredProducts={setFilteredProducts}
          filteredProducts={filteredProducts}
        />
        <ProductsTable
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
        <button
          className="rounded-xl  absolute bottom-10 right-8 font-bold hover:bg-green-200 px-5 py-3 bg-green-100 text-green-800 border border-green-100 text-3xl"
          onClick={() => navigate("/newProduct")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
