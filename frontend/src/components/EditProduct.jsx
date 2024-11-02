import { useReducer, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { IoArrowBackOutline } from "react-icons/io5";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { apiUrl } from "../constant";
import Loading from "./Loading";
import apiCaller from "../libs/apiCaller";

const EditProduct = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const product = location.state;
  const initialState = {
    name: product.name,
    measuring: product.measuring,
    mrp: product.mrp,
    cp: product.costPrice,
    rp: product.retailPrice,
    wp: product.wholesalePrice,
    swp: product.superWholesalePrice,
    barcode: product.barcode,
    stock: product.stock,
    packet: product.packet,
    box: product.box,
    minQuantity: product.minQuantity,
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "updateField":
        return { ...state, [action.fieldName]: action.fieldValue };
      case "reset":
        return initialState;
      case "barcode":
        return { ...state, [action.fieldName]: action.fieldValue };
      default:
        return state;
    }
  };
  console.log(id);
  const navigate = useNavigate();
  const dispatchR = useDispatch();

  const [formData, dispatch] = useReducer(formReducer, initialState);
  console.log(formData);

  //   const [submitted, setSubmitted] = useState(false);

  const handleBarcode = (barcode, op) => {
    // Filter out the barcode to remove from the array
    let newBarcode;
    if (op === "delete") {
      newBarcode = formData.barcode.filter((b) => b !== barcode);
    } else {
      newBarcode = formData.barcode;
      newBarcode.push(barcode);
    }
    // Dispatch the updated barcode array
    dispatch({
      type: "updateField",
      fieldName: "barcode",
      fieldValue: newBarcode,
    });
  };

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
      barcode: formData.barcode,
      stock: parseFloat(formData.stock),
      packet: parseInt(formData.packet),
      box: parseInt(formData.box),
      minQuantity: parseInt(formData.minQuantity),
      _id: product._id,
    };
    if (formData2.barcode.length < 1) {
      toast.error("Ek barcode to daliye sir");
      setLoading(false);
      return;
    }

    // Send a POST request to your server with the form data
    apiCaller
      .post(apiUrl + "/products/updateProduct", {
        ...formData2,
        barcode: formData.barcode,
      })
      .then((response) => {
        // Handle a successful response from the server
        setLoading(false);
        console.log("Product created:", response.data);
        toast.success("Product Updated Successfully");
        toast.info("Naviagting to products page");
        dispatchR(fetchProducts());
        setTimeout(() => {
          navigate("/products");
        }, 3500);
      })
      .catch((error) => {
        // Handle errors, e.g., validation errors from the server
        setLoading(false);
        toast.error(error.response.data.msg);
        console.log("Error creating product:", error);
      });
  };

  const [query, setQuery] = useState("");
  const css = {
    input:
      "mx-auto outline-none focus:border-green-800 transtion-all duration-300 ease-linear   border-b-2 px-2 text-xl font-bold max-w-[300px]",
    label: "text-xl mx-3 font-bold",
    holder: "mx-auto ",
  };

  return (
    <div className="flex items-center   justify-center pt-3 ">
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
            Edit the Product Details
          </p>
        </h1>
        <div
          id="container"
          className="grid mt-16 grid-cols-2 mb-16 gap-y-10 justify-center items-center "
        >
          <div className={css.holder}>
            <label className={css.label} htmlFor="name">
              Name
            </label>
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
          </div>
          <div className={css.holder}>
            <label className={css.label} htmlFor="measuring">
              Type
            </label>
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
          </div>
          {/* <div className={css.holder}>
            <label className={css.label} htmlFor=""></label>
          </div> */}
          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              MRP
            </label>
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
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Cost Price
            </label>
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
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Retail Price
            </label>
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
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              WholeSale
            </label>
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
          </div>
          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Super Sale
            </label>
            <input
              className={css.input}
              required
              type="number"
              id="swp"
              name="swp"
              value={formData.swp}
              onChange={handleInputChange}
              placeholder="Enter the WholeSale Price"
            />
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className={`${css.holder} my-3 relative`}>
              <label className={css.label} htmlFor="">
                Barcode
              </label>

              <input
                className={css.input}
                // required
                type="number"
                id="barcode"
                name="barcode"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter the Barcode"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleBarcode(parseInt(query), "add");
                }}
                className="absolute right-0 bottom-2 rounded-xl font-bold bg-green-200 text-green-800 px-2 py-1 "
              >
                {" "}
                + Barcode
              </button>
            </div>
            <div>
              {formData.barcode &&
                formData.barcode.map((bar) => {
                  return (
                    <span
                      className="bg-green-200 text-green-700 rounded-xl px-3 py-2 mx-2 font-bold"
                      key={bar}
                    >
                      {bar}{" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleBarcode(bar, "delete");
                        }}
                        className="bg-red-200 ml-3 text-red-600 px-2 py-1 rounded-xl"
                      >
                        X
                      </button>
                    </span>
                  );
                })}
            </div>
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Stock
            </label>
            <input
              className={css.input}
              required
              type="number"
              disabled
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Enter the stock"
            />
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Pakcet
            </label>
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
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Box
            </label>
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
          </div>

          <div className={css.holder}>
            <label className={css.label} htmlFor="">
              Minimum
            </label>
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
          </div>

          <button
            type="submit"
            className="min-w-[300px] flex items-center justify-center mx-auto hover:bg-green-600 border-green-300 border duration-300 ease-linear transition-all py-2 hover:text-white font-bold rounded-xl text-xl "
          >
            <AiOutlinePlus className="font-bold" />
            Update
          </button>
          <ToastContainer autoClose={3000} />
        </div>
      </form>
      {loading && <Loading />}
    </div>
  );
};

export default EditProduct;
