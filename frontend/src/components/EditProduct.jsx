import { useReducer } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice";

const EditProduct = () => {
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
      default:
        return state;
    }
  };
  console.log(product);
  console.log(id);
  const navigate = useNavigate();
  const dispatchR = useDispatch();
  const handleReset = () => {
    dispatch({ type: "reset" });
  };
  const [formData, dispatch] = useReducer(formReducer, initialState);
  //   const [submitted, setSubmitted] = useState(false);
  const apiUrl = "http://localhost:4000/api/v1/products/updateProduct";
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

    // Format the data to match your Mongoose schema
    const formData2 = {
      name: formData.name,
      mrp: parseInt(formData.mrp),
      costPrice: parseFloat(formData.cp),
      measuring: formData.measuring,
      retailPrice: parseInt(formData.rp),
      wholesalePrice: parseFloat(formData.wp),
      barcode: parseInt(formData.barcode),
      stock: parseInt(formData.stock),
      packet: parseInt(formData.packet),
      box: parseInt(formData.box),
      minQuantity: parseInt(formData.minQuantity),
      _id: product._id,
    };

    // Send a POST request to your server with the form data
    axios
      .post(apiUrl, formData2)
      .then((response) => {
        // Handle a successful response from the server
        console.log("Product created:", response.data);
        toast.success("Product Updated Successfully");

        toast.info("Naviagting to products page");
        dispatchR(fetchProducts());
        handleReset();
        setTimeout(() => {
          navigate("/products");
        }, 3500);
      })
      .catch((error) => {
        // Handle errors, e.g., validation errors from the server
        toast.error(error.response.data.msg);
        console.log("Error creating product:", error);
      });
  };
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
              disabled
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
              Barcode
            </label>
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
    </div>
  );
};

export default EditProduct;
