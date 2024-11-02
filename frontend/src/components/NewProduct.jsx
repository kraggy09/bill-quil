import { useReducer, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

import { AiOutlinePlus } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { apiUrl } from "../constant";
import Loading from "./Loading";
import apiCaller from "../libs/apiCaller";

const initialState = {
  name: "",
  measuring: "none",
  mrp: "",
  cp: "",
  rp: "",
  wp: "",
  swp: "",
  barcode: "",
  stock: "",
  packet: 0,
  box: 0,
  minQuantity: 1,
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

const NewProduct = () => {
  const navigate = useNavigate();
  const dispatchR = useDispatch();
  const handleReset = () => {
    dispatch({ type: "reset" });
  };
  const [loading, setLoading] = useState(false);
  const [formData, dispatch] = useReducer(formReducer, initialState);
  //   const [submitted, setSubmitted] = useState(false);
  const apiUrl1 = "/products/newItem";
  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "name" || name == "measuring") {
      // Handle string input (e.g., "name")
      dispatch({ type: "updateField", fieldName: name, fieldValue: value });
    } else {
      value = Number(value);

      dispatch({
        type: "updateField",
        fieldName: name,
        fieldValue: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the data to match your Mongoose schema
    const formData2 = {
      name: formData.name,
      mrp: parseInt(formData.mrp),
      costPrice: parseFloat(formData.cp),
      measuring: formData.measuring,
      retailPrice: parseInt(formData.rp),
      wholesalePrice: parseFloat(formData.wp),
      superWholesalePrice: parseFloat(formData.swp),
      barcode: parseInt(formData.barcode),
      stock: parseFloat(formData.stock),
      packet: parseInt(formData.packet),
      box: parseInt(formData.box),
      minQuantity: parseInt(formData.minQuantity),
    };

    // Send a POST request to your server with the form data
    apiCaller
      .post(apiUrl + apiUrl1, formData2)
      .then((response) => {
        // Handle a successful response from the server
        console.log("Product created:", response.data);
        setLoading(false);
        toast.success("Product Created Successfully");

        toast.info("Naviagting to products page");
        dispatchR(fetchProducts());
        handleReset();

        setTimeout(() => {
          navigate("/products");
        }, 1500);

        // setTimeout(() => {
        // }, 3500);
      })
      .catch((error) => {
        setLoading(false);
        // Handle errors, e.g., validation errors from the server
        toast.error(error.response.data.msg);
        console.log("Error creating product:", error);
      });
  };
  const css = {
    input:
      "mx-auto outline-none focus:border-green-800 transtion-all duration-300 ease-linear   border-b-2 px-2 text-xl font-bold max-w-[300px]",
  };

  return (
    <div className="flex items-center   justify-center pt-3 ">
      {loading && <Loading />}
      <form
        className="shadow-xl shadow-gray-400 border-green-500 border-2 ml-3 min-w-[80vw] rounded-2xl max-w-[80vw]"
        onSubmit={handleSubmit}
      >
        <span className="text-4xl">
          <IoArrowBackOutline
            onClick={() => navigate("/products")}
            className="mx-6 mt-6 hover:cursor-pointer"
          />
        </span>
        <h1 className="text-center text-3xl font-bold">
          <p className="inline-block border-b-2 px-6 my-1 py-2 border-black">
            Create a New Product
          </p>
        </h1>
        <div
          id="container"
          className="grid mt-16 grid-cols-2 mb-16 gap-y-10 justify-center items-center "
        >
          <input
            className={css.input}
            required
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter the name"
          />

          <select
            value={formData.measuring}
            name="measuring"
            className="max-w-[300px] font-bold px-2 text-xl min-w-[300px] mx-auto"
            onChange={handleInputChange}
          >
            <option value="none">Select the Measuring Unit</option>
            <option value="kg">Kilogram</option>
            <option value="piece">Pieces</option>
          </select>

          <input
            className={css.input}
            required
            type="number"
            id="mrp"
            name="mrp"
            value={formData.mrp}
            onChange={handleInputChange}
            placeholder="MRP₹"
          />

          <input
            className={css.input}
            required
            type="number"
            id="cp"
            name="cp"
            value={formData.cp}
            onChange={handleInputChange}
            placeholder="Enter the Cost Price"
          />

          <input
            className={css.input}
            required
            type="number"
            id="rp"
            name="rp"
            value={formData.rp}
            onChange={handleInputChange}
            placeholder="Enter the Retail Price"
          />

          <input
            className={css.input}
            required
            type="number"
            id="wp"
            name="wp"
            value={formData.wp}
            onChange={handleInputChange}
            placeholder="Enter the WholeSale Price"
          />
          <input
            className={css.input}
            required
            type="number"
            id="swp"
            name="swp"
            value={formData.swp}
            onChange={handleInputChange}
            placeholder="Enter the Super WholeSale Price"
          />

          <input
            className={css.input}
            required
            type="number"
            id="barcode"
            name="barcode"
            value={formData.barcode}
            onChange={handleInputChange}
            placeholder="Enter the Barcode"
          />

          <input
            className={css.input}
            required
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Enter the stock"
          />

          <input
            className={css.input}
            required
            type="number"
            id="packet"
            name="packet"
            value={formData.packet}
            onChange={handleInputChange}
            placeholder="Number of pieces in packet"
          />

          <input
            className={css.input}
            required
            type="number"
            id="box"
            name="box"
            value={formData.box}
            onChange={handleInputChange}
            placeholder="Number of pieces in box"
          />

          <input
            className={css.input}
            required
            type="number"
            id="minQuantity"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleInputChange}
            placeholder="Min Number of Pieces"
          />

          <button
            type="submit"
            className="min-w-[300px] flex items-center justify-center mx-auto hover:bg-green-600 border-green-300 border duration-300 ease-linear transition-all py-2 hover:text-white font-bold rounded-xl text-xl "
          >
            <AiOutlinePlus className="font-bold" />
            Create
          </button>
          <ToastContainer autoClose={3000} />
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
