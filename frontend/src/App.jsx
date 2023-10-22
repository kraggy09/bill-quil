import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { fetchCustomers } from "./store/customerSlice";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";

import HomePage from "./pages/HomePage";
import SideBar from "./components/SideBar";
import NewBillPage from "./pages/NewBillPage";
import { fetchProducts } from "./store/productSlice";
import ProductPage from "./pages/ProductPage";
import CustomerPage from "./pages/CustomerPage";
import DailyReportPage from "./pages/DailyReportPage";
import TransactionPage from "./pages/TransactionPage";
import BillPage from "./pages/BillPage";
import NewProduct from "./components/NewProduct";
import EditProduct from "./components/EditProduct";
import UpdateStock from "./components/UpdateStock";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, []);

  return (
    <div className="min-h-[100vh] flex w-full">
      <Router>
        <SideBar NavLink={NavLink} />

        <Routes>
          <Route path="/" element={<DashBoardPage />} />
          <Route path="newbill" element={<NewBillPage />} />
          <Route path="daily-report" element={<DailyReportPage />} />
          <Route path="transactions" element={<TransactionPage />} />
          <Route path="bills" element={<BillPage />} />
          <Route path="newproduct" element={<NewProduct />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="/products/updateStock/:id" element={<UpdateStock />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
