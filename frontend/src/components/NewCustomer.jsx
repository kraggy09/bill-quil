import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../constant";

const initialState = {
  name: "",
  phone: "",
  outstanding: "",
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

const apiUrl1 = "/newCustomer";

const NewCustomer = () => {
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const myInputRef = useRef(null);

  useEffect(() => {
    myInputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name == "name") {
      dispatch({ type: "updateField", fieldName: name, fieldValue: value });
    } else {
      value = Number(value);

      dispatch({ type: "updateField", fieldName: name, fieldValue: value });
    }
  };

  const handleReset = () => {
    dispatch({ type: "reset" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData2 = {
      name: formData.name,
      phone: Number.parseInt(formData.phone),
      outstanding: Number.parseInt(formData.outstanding),
    };
    axios
      .post(apiUrl + apiUrl1, formData2)
      .then((res) => {
        console.log("Response", res);
        toast.success("customer created successfully");
        handleReset();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("Error");
        }

        // toast.error(err.response);
      });
  };

  const css = {
    input:
      "mx-auto outline-none focus:border-green-800 transtion-all duration-300 ease-linear   border-b-2 px-2 text-xl font-bold max-w-[300px]",
    label: "px-6 font-bold text-xl",
    inputContainer: "my-6",
    button:
      "min-w-[150px] flex items-center justify-center px-3 py-2 rounded-xl text-xl font-bold hover:border-green-500 hover:bg-green-500 hover:text-white transition-all ease-linear duration-300 border-green-600 border-2 mx-auto",
  };

  return (
    <div className="w-full flex min-h-[100vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className=" shadow-xl min-h-[20vw]  max-w-[50vw] shadow-gray-400 rounded-xl"
      >
        <h1 className="text-center text-3xl font-bold">
          <p className="inline-block border-b-2 px-6 my-6 py-2 border-black">
            Create a New Customer
          </p>
        </h1>
        <div id="container" className="grid my-6 grid-cols-1">
          <span className={css.inputContainer}>
            <label htmlFor="name" className={css.label}>
              Customer Name:
            </label>
            <input
              required
              ref={myInputRef}
              type="text"
              className={css.input}
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              id="name"
            />
          </span>
          <span className={css.inputContainer}>
            <label htmlFor="phone" className={css.label}>
              Customer Mobile:
            </label>
            <input
              required
              type="number"
              minLength={10}
              value={formData.phone}
              className={css.input}
              name="phone"
              onChange={handleInputChange}
              id="phone"
            />
          </span>
          <span className={css.inputContainer}>
            <label htmlFor="outstanding" className={css.label}>
              Customer Outstanding:
            </label>
            <input
              required
              type="number"
              minLength={10}
              value={formData.outstanding}
              className={css.input}
              name="outstanding"
              id="outstanding"
              onChange={handleInputChange}
            />
          </span>
          <button className={css.button} type="submit">
            <AiOutlinePlus /> Create Customer
          </button>
          <ToastContainer autoClose={3000} />
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;
