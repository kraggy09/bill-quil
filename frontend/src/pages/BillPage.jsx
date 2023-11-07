import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../constant";
const BillPage = () => {
  const [bills, setBills] = useState([]);
  const apiUrl1 = "/getAllBills";
  const getBills = async () => {
    try {
      const res = await axios.get(apiUrl + apiUrl1);
      if (res) {
        const temp = res.data;
        console.log(temp);
        setBills(temp);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBills();
  }, []);
  return <div>BillPage</div>;
};

export default BillPage;
