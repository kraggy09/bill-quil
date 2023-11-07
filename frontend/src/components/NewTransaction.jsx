import { useReducer, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { fetchDailyReport } from "../store/reportSlice";
import { apiUrl } from "../constant";

import { fetchCustomers } from "../store/customerSlice";
const initialState = {
  name: "",
  purpose: "",
  amount: "",
  paymentMode: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "updateField":
      return { ...state, [action.fieldName]: action.fieldValue };

    case "reset":
      return initialState;
    default:
      return state;
  }
};

const findCustomer = (customers, val) => {
  return customers.filter((customer) => {
    // console.log(customer);
    return customer.name.includes(val);
  });
};

const NewTransaction = () => {
  const [taken, setTaken] = useState(!false);
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [visible, setVisible] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState({});
  console.log(foundCustomer);

  const customers = useSelector((store) => store.customer.customers);
  // console.log(customers);

  console.log(formData);

  const css = {
    input:
      "mx-auto capitalize outline-none focus:border-green-800 transtion-all duration-300 ease-linear   border-b-2 px-2 text-xl font-bold max-w-[300px]",
    label: "px-6 font-bold text-xl",
    inputContainer: "my-6",
    button: `min-w-[150px] my-6 flex items-center justify-center px-3 py-2 rounded-xl text-xl font-bold ${
      taken
        ? "hover:bg-red-500 hover:border-red-500"
        : "hover:border-green-500 hover:bg-green-500"
    } hover:text-white transition-all ease-linear duration-300 ${
      taken ? "border-red-600" : "border-green-600"
    } border-2 mx-auto`,
  };
  const dispatchR = useDispatch();

  const handleField = (e) => {
    let { name, value } = e.target;
    dispatch({ type: "updateField", fieldName: name, fieldValue: value });
  };

  const handleSubmit = async () => {
    if (!taken) {
      await axios
        .post(apiUrl + "/createPayment", {
          ...formData,
          id: foundCustomer._id,
        })
        .then((res) => {
          console.log(res);
          toast.success("Payment Recieved");
        })
        .catch((err) => console.log(err));
    } else {
      await axios
        .post(apiUrl + "/createTransation", {
          ...formData,
        })
        .then((res) => {
          console.log(res);
          toast.success("Cashout Done");
        })
        .catch((err) => console.log(err));
    }
    dispatchR(fetchCustomers());
    dispatchR(fetchDailyReport());
    dispatch({ type: "reset" });
    setFoundCustomer(null);
  };

  // console.log(foundCustomer);
  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="shadow-xl shadow-gray-400 min-w-[80vw] rounded-2xl max-w-[80vw]"
      >
        <h1 className="text-center text-3xl my-6 font-bold">
          <p className="inline-block border-b-2 px-6 my-1 py-2 border-black">
            Create a New {taken ? "Transaction" : "Payment"}
          </p>
        </h1>
        <div id="container" className="grid grid-cols-1 ">
          <div
            id="selector"
            className="mx-auto flex items-center justify-center rounded-xl"
          >
            <div className="rounded-xl border py-1 hover:cursor-pointer  border-green-600 px-[2px]">
              <span
                className={`rounded-xl px-3 py-1 tex-xl font-bold ${
                  taken ? " text-black bg-white" : "bg-green-600 text-white"
                }`}
                onClick={() => setTaken(false)}
              >
                Payment In
              </span>
              <span
                className={`rounded-xl px-3 py-1 tex-xl font-bold ${
                  taken ? "bg-red-500 text-white" : "bg-white text-black"
                }`}
                onClick={() => setTaken(true)}
              >
                Cashout
              </span>
            </div>
          </div>

          <span className="mx-auto my-3 relative">
            <label className={css.label} htmlFor="name">
              Name:
            </label>
            <input
              required
              className={css.input}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => {
                handleField(e);
                if (formData.name.length > 0) {
                  setVisible(true);
                } else {
                  setVisible(false);
                }
              }}
            />
            <div className="absolute min-w-[300px] -right-5 bg-gray-200 rounded-xl ">
              {!taken &&
                visible &&
                formData.name != "" &&
                findCustomer(customers, formData.name).map((d) => {
                  return (
                    <div
                      className="hover:bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                      onClick={() => {
                        dispatch({
                          type: "updateField",
                          fieldName: "name",
                          fieldValue: d.name,
                        });
                        setVisible(false);
                        setFoundCustomer(d);
                      }}
                      key={d._id}
                    >
                      {d.name}:{"    "}
                      {d.outstanding}
                    </div>
                  );
                })}
            </div>
          </span>
          <span className="mx-auto my-3">
            <label className={css.label} htmlFor="amount">
              Amount:
            </label>
            <input
              required
              className={css.input}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleField}
            />
          </span>
          <span className="mx-auto my-3">
            <label className={css.label} htmlFor="amount">
              Purpose:
            </label>
            {!taken ? (
              <input
                className={css.input}
                type="text"
                id="amount"
                name="amount"
                value={"Payment"}
                disabled
                onChange={handleField}
              />
            ) : (
              <select
                value={formData.measuring}
                name="purpose"
                className="max-w-[300px] font-bold px-2 text-xl min-w-[290px] mx-auto"
                onChange={handleField}
              >
                <option value="none">Select the Purpose</option>
                <option value="home">Home Purpose</option>
                <option value="party">Party Payment</option>
                <option value="cash">Cash Requirement</option>
              </select>
            )}
          </span>

          {!taken && (
            <span className="mx-auto my-3">
              <label className={css.label} htmlFor="outstanding">
                Outstanding:
              </label>

              <input
                required
                className={css.input}
                type="text"
                id="amount"
                name="amount"
                value={foundCustomer ? foundCustomer.outstanding : ""}
                disabled
                onChange={handleField}
              />
            </span>
          )}
          {!taken && (
            <span className="mx-auto my-3">
              <label className={css.label} htmlFor="payment">
                PaymentMode:
              </label>

              <select
                value={formData.paymentMode}
                name="paymentMode" // Corrected the name attribute
                className="max-w-[300px] font-bold px-2 text-xl min-w-[290px] mx-auto"
                onChange={handleField}
              >
                <option value="none">Select the Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </span>
          )}

          <button className={css.button} type="submit">
            Create {taken ? "Transaction" : "Payment"}
          </button>
        </div>
        <ToastContainer autoClose={3000} />
      </form>
    </div>
  );
};

export default NewTransaction;
