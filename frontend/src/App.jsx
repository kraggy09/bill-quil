import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { fetchCustomers } from "./store/customerSlice";
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
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  // console.log(user);

  // const checkAuthentication = async () => {
  //   try {
  //     const res = await axios.get(apiUrl + "/checkAuth"); // Replace with your actual endpoint
  //     console.log(res);
  //     if (res) {
  //       dispatch(
  //         setUser({
  //           username: res.data.user.username,
  //           isAdmin: res.data.user.isAdmin,
  //           id: res.data.user._id,
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Authentication check failed:", error);
  //     // Handle authentication failure
  //   }
  // };

  // useEffect(() => {
  //   console.log("I was called");
  //   checkAuthentication();
  // }, []);
  // console.log(user);
  useEffect(() => {
    if (user.username) {
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
      dispatch(fetchDailyReport());
    }
  }, [user]);

  // Example of checking authentication on the frontend

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
        </Routes>
      </Router>
    </div>
  );
};

export default App;
