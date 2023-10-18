import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomers } from "../store/customerSlice";
// import axios from "axios";
const BillingMain = () => {
  const dispatch = useDispatch();
  // const [products, setProducts] = useState([]);
  const customers = useSelector((store) => store.customer);
  const loading = useSelector((store) => store.loading);
  console.log(customers);
  useEffect(() => {
    dispatch(fetchCustomers());
  }, []);

  return <div>Hello</div>;
};

export default BillingMain;
