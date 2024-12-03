import { useEffect, useState } from "react";
import { apiUrl } from "../constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { AiFillEye, AiOutlineArrowUp } from "react-icons/ai";
import { FaEyeSlash, FaLock, FaPercentage } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import BillStrap from "../components/BillStrap";
import { calculateDate, calculateTime } from "../libs/constant";
import { useNavigate } from "react-router-dom";
import apiCaller from "../libs/apiCaller";
const apiUrl1 = "/getAllBills";

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dataObj, setDataObj] = useState(null);
  const [filter, setFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [pin, setPin] = useState("");
  const [isQueryProgrammaticChange, setIsQueryProgrammaticChange] =
    useState(false);

  const daily = useSelector((store) => store.report.report);
  const user = useSelector((store) => store.user);
  const { products } = useSelector((store) => store.product);
  console.log("Products", products);

  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [quantity, setQuantity] = useState(0);
  // const [hidden, setHidden] = useState(true);
  const [query, setQuery] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const navigate = useNavigate();

  const searchProduct = () => {
    return products.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        // Query is not a valid number, so search by name
        return product.name.toLowerCase().includes(query);
      } else {
        // Query is a valid number, so search by barcode
        return product.barcode.includes(queryValue);
      }
    });
  };
  useEffect(() => {
    if (isQueryProgrammaticChange) {
      const updatedOptions = searchProduct();
      setProductOptions(updatedOptions);

      if (updatedOptions.length === 1) {
        setSelectedProduct(updatedOptions[0]);
        setProductOptions([]);
      } else {
        setSelectedProduct(null); // Handle the case where there are no or multiple options
      }
    }
  }, [query]);

  useEffect(() => {
    setQuery(selectedProduct?.name);
  }, [selectedProduct]);

  const getBills = async () => {
    try {
      setLoading(true);
      const res = await apiCaller.get(apiUrl + apiUrl1, {
        params: {
          startDate,
          endDate,
        },
      });
      if (res) {
        const temp = res.data;
        console.log("Data", temp);
        setBills(temp.bills);
        toast.success(`Bills Found Successfully`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while getting bills", startDate);
      setLoading(false);
    }
  };

  const getBillByProductName = async () => {
    try {
      setLoading(true);
      const res = await apiCaller.get(apiUrl + "/getBillByProductName", {
        params: {
          product: selectedProduct,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
      if (res) {
        console.log(res.data);
        setFilter(res.data.result);
        toast.success("Got the bills for you ");
      } else {
        toast.info("No such bills found");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error while getting data");
    }
  };

  useEffect(() => {
    let temp =
      bills &&
      bills.reduce(
        (acc, currentBill) => {
          const temp = currentBill.items.reduce(
            (ac, item) => {
              if (item.product?.costPrice === undefined) {
                console.log(
                  `Item without product.costPrice in bill ID ${currentBill._id},total:${currentBill.total}`
                );
              }

              return {
                billAmount: ac.billAmount + item.total,
                investment:
                  ac.investment +
                  item.quantity * (item.product?.costPrice ?? 0),
              };
            },
            { billAmount: 0, investment: 0 }
          );

          const payment = currentBill.payment ?? 0;
          if (currentBill._id === undefined) {
            console.log("Bill without _id");
          }

          return {
            totalBillAmount: acc.totalBillAmount + temp.billAmount,
            totalPayment: acc.totalPayment + payment,
            totalInvestment: acc.totalInvestment + temp.investment,
          };
        },
        { totalBillAmount: 0, totalPayment: 0, totalInvestment: 0 }
      );

    // Optional chaining check for setDataObj
    setDataObj(
      temp ?? { totalBillAmount: 0, totalPayment: 0, totalInvestment: 0 }
    );

    console.log(temp);
  }, [bills]);

  useEffect(() => {
    if (daily) {
      setBills(daily.bills);
    }
  }, [daily]);

  const handleSubmit = () => {
    if (selectedProduct) {
      getBillByProductName();
    } else {
      getBills();
    }
  };

  return (
    <div className="min-w-full">
      <header className="ml-9">
        <p className=" text-center my-3 font-bold">Search the bills here</p>
        <div className="min-w-full flex items-center justify-center">
          <div className="py-2 relative">
            <div className="flex min-w-full px-6 my-2 items-center justify-start ">
              <span className="px-16  font-bold">Search for Product</span>
              <input
                type="text"
                className="border-b-2 border-green-600 mx-2 focus:bg-none px-4  font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
                value={query}
                onChange={(e) => {
                  setIsQueryProgrammaticChange(true);
                  setQuery(e.target.value);
                }}
              />
            </div>
            {productOptions.length > 0 && (
              <div className="absolute z-10 left-96 max-h-72 overflow-y-scroll bg-gray-300 rounded-xl py-2 top-16 capitalize font-semibold">
                {productOptions.map((prod) => (
                  <div
                    className="py-1 hover:bg-green-300 px-6 hover:cursor-pointer"
                    onClick={() => {
                      setQuery(prod.name);
                      setIsQueryProgrammaticChange(!true);
                      setSelectedProduct(prod);
                      setProductOptions([]);
                    }}
                    key={prod._id}
                  >
                    {prod.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex min-w-[90vw] my-3 justify-around">
          <span className="flex items-center justify-center ">
            <p className="mr-3">Start Date: </p>
            <input
              type="date"
              className="bg-gray-300 px-3 rounded-xl hover:cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </span>
          <span className="flex items-center justify-center ">
            <p className="mr-3">End Date:</p>
            <input
              type="date"
              className="bg-gray-300 px-3 rounded-xl hover:cursor-pointer"
              value={endDate}
              onChange={(e) => {
                // console.log(e.target.value);
                setEndDate(e.target.value);
              }}
            />
          </span>
          <button
            className="bg-green-500 p-2 font-semibold  rounded-xl text-white"
            onClick={() => handleSubmit()}
          >
            Get the bills
          </button>
        </div>
      </header>
      {user.isAdmin && show && (
        <article className="flex min-w-full items-center justify-center my-6">
          <div className="min-w-[150px] min-h-[70px] border-2 border-green-500 rounded-3xl text-3xl font-bold text-green-900 flex items-center justify-center  px-6 mx-6 bg-green-200 ">
            <FaIndianRupeeSign className="mx-1 font-extrabold" />
            {dataObj &&
              (dataObj.totalBillAmount - dataObj.totalInvestment).toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-red-500 rounded-3xl text-3xl font-bold text-red-900 flex items-center justify-center px-6 bg-red-200">
            <AiOutlineArrowUp className="mx-1 font-extrabold" />₹
            {dataObj && dataObj.totalBillAmount.toFixed(1)}
          </div>
          <div className="min-w-[150px] min-h-[70px] border-2  mx-6 border-yellow-300 rounded-3xl text-3xl font-bold text-yellow-800 flex items-center justify-center px-6 bg-yellow-200">
            <FaPercentage className="mx-1 font-extrabold" />
            {dataObj &&
              (
                ((dataObj.totalBillAmount - dataObj.totalInvestment) /
                  dataObj.totalBillAmount) *
                100
              ).toFixed(1)}
          </div>
        </article>
      )}
      {user.isAdmin && (
        <div className="flex  min-w-full items-center justify-center">
          {!show ? (
            <div className="flex flex-col items-center justify-center gap-y-2">
              <h1>Please enter the pin</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pin === user.pin) {
                    setShow(true);
                    setPin("");
                  }
                }}
                className="flex items-center justify-center"
              >
                <FaLock />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    let a = e.target.value;
                    setPin(a);
                  }}
                  className="border-x-0 outline-none border-t-0 border-b-2 ml-6"
                />
                <button className="ml-6 bg-green-200 px-2 py-1 rounded-lg font-bold">
                  Check
                </button>
              </form>
            </div>
          ) : (
            <FaEyeSlash
              onClick={() => {
                setShow(false);
              }}
              className="hover:text-red-500 hover:cursor-pointer"
            />
          )}
        </div>
      )}
      <main className="min-w-[90vw] flex items-center justify-center">
        {!filter ? (
          <table className="table-auto border-spacing-x-60  border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black">Time</th>
                <th className="border border-black">Bill Id</th>
                <th className="border border-black px-0">Bill Amount</th>
                <th className="border border-black px-6">Outstanding</th>
                <th className="border border-black px-6">Payment</th>
                <th className="border border-black">Total</th>
                <th className="border border-black">View</th>
              </tr>
            </thead>
            <tbody>
              {bills &&
                [...bills].reverse().map((bill) => {
                  return <BillStrap key={bill._id} bill={bill} />;
                })}
            </tbody>
          </table>
        ) : (
          <table className="table-auto border-spacing-x-60  border border-black ml-6 ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black mx-6">Date</th>
                <th className="border border-black">Time</th>
                <th className="border border-black">Customer Name</th>
                <th className="border border-black">Prev. Quan</th>

                <th className="border border-black">Quantity </th>
                <th className="border border-black">New. Quan</th>

                <th className="border border-black">Total Price </th>
                <th className="border border-black">View</th>
              </tr>
            </thead>
            <tbody>
              {filter.map((p) => {
                return (
                  <tr key={p._id}>
                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {calculateDate(new Date(p.createdAt))}
                    </td>
                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {calculateTime(new Date(p.createdAt))}
                    </td>

                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {p.customer.name}
                    </td>
                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {p.items[0].previousQuantity ?? "Old"}
                    </td>
                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {p.items[0].quantity}
                    </td>

                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {p.items[0].newQuantity ?? "Old"}
                    </td>
                    <td className="px-16 py-3 capitalize font-semibold text-lg">
                      {" "}
                      {p.items[0].total - p.items[0].discount}
                    </td>
                    <td
                      onClick={() => {
                        navigate(`/bills/${p._id}`);
                      }}
                      className="px-6 text-3xl hover:cursor-pointer hover:text-green-500 py-3"
                    >
                      <AiFillEye />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
      {loading && <Loading />}
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default BillPage;
