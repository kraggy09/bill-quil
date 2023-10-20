import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCustomers } from "./store/customerSlice";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";

import HomePage from "./pages/HomePage";
import SideBar from "./components/SideBar";
import NewBillPage from "./pages/NewBillPage";
import { fetchProducts } from "./store/productSlice";

const App = () => {
  const customers = useSelector((store) => store.customer.customers);
  const products = useSelector((store) => store.product.products);

  console.log(products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, []);

  return (
    <div className="min-h-[100vh] flex w-full">
      <SideBar />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="newbill" element={<NewBillPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
