import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";

import { fetchCustomers } from "./store/customerSlice";
import { fetchCategories } from "./store/categorySlice";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";

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
import { fetchDailyReport } from "./store/reportSlice";
import BarcodePage from "./components/BarcodePage";
import NewCustomer from "./components/NewCustomer";
import IndividualCustomer from "./components/IndividualCustomer";
import SingleBill from "./components/SingleBill";
import Protected from "./components/Protected";
import Login from "./components/Login";
import UpdateStockRequest from "./components/UpdateStockRequest";
import ReturnProduct from "./components/ReturnProduct";
import { fetchLastBillId } from "./store/billIdSlice";
import { Toaster } from "react-hot-toast";
import CategoriesPage from "./pages/CategoriesPage";
import NewTransaction from "./components/NewTransaction";
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user.username) {
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
      dispatch(fetchDailyReport());
      dispatch(fetchLastBillId());
      dispatch(fetchCategories());
    }
  }, [user]);

  return (
    <div className="min-h-[100vh] relative flex w-full">
      <Router>
        {user.username && <SideBar />}

        <Routes>
          {!user.username && <Route path="/login" element={<Login />} />}
          <Route path="/" element={<Protected Component={DashBoardPage} />} />
          <Route
            path="newbill"
            element={<Protected Component={NewBillPage} />}
          />
          <Route
            path="daily-report"
            element={<Protected Component={DailyReportPage} user />}
          />
          <Route
            path="transactions"
            element={<Protected Component={TransactionPage} />}
          />
          <Route path="bills" element={<Protected Component={BillPage} />} />
          <Route
            path="newproduct"
            element={<Protected Component={NewProduct} />}
          />
          <Route
            path="customers"
            element={<Protected Component={CustomerPage} />}
          />
          <Route
            path="products"
            element={<Protected Component={ProductPage} />}
          />
          <Route
            path="products/:id"
            element={<Protected Component={EditProduct} />}
          />
          <Route
            path="/products/updateStock/:id"
            element={<Protected Component={UpdateStock} />}
          />
          <Route
            path="/products/barcode/:id"
            element={<Protected Component={BarcodePage} />}
          />
          <Route
            path="newCustomer"
            element={<Protected Component={NewCustomer} />}
          />
          <Route
            path="/customers/:id"
            element={<Protected Component={IndividualCustomer} />}
          />
          <Route
            path="/bills/:id"
            element={<Protected Component={SingleBill} />}
          />
          <Route
            path="/print-barcode"
            element={<Protected Component={BarcodePage} />}
          />
          <Route
            path="/updateStock"
            element={<Protected Component={UpdateStockRequest} />}
          />
          <Route
            path="/return-product"
            element={<Protected Component={ReturnProduct} />}
          />
          <Route
            path="/categories"
            element={<Protected Component={CategoriesPage} />}
          />
          <Route
            path="/newTransaction"
            element={<Protected Component={NewTransaction} />}
          />
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
