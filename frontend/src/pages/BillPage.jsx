import axios from "axios";
import { useEffect, useState } from "react";
const BillPage = () => {
  const [bills, setBills] = useState([]);
  const getBills = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/getAllBills");
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
