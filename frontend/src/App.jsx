import { useDispatch, useSelector } from "react-redux";
import NewCustomer from "./components/NewCustomer";
import NewProduct from "./components/NewProduct";
import NewTransaction from "./components/NewTransaction";
import { useEffect } from "react";
import { fetchCustomers } from "./store/customerSlice";

const App = () => {
  const customers = useSelector((store) => store.customer.customers);
  console.log(customers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCustomers());
    // const a = async () => {
    //   const data = await axios.get(
    //     "http://localhost:4000/api/v1/getAllCustomers"
    //   );
    //   console.log(data);
    // };
    // a();
  }, []);

  return (
    <div className="min-h-[100vh] w-full">
      <NewTransaction />
      <div>
        <NewCustomer />
        <NewProduct />
      </div>
    </div>
  );
};

export default App;
