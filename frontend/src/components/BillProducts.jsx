import { useEffect, useReducer, useState } from "react";
import { FaCalculator } from "react-icons/fa";
import Calculator from "./Calculator";

import PropTypes from "prop-types";

// Reducer function to manage state changes
const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_PRICE":
      return { ...state, price: action.value };
    case "CHANGE_PIECE":
      return { ...state, piece: action.value };
    case "CHANGE_PACKET":
      return { ...state, packet: action.value };
    case "CHANGE_BOX":
      return { ...state, box: action.value };
    case "CHANGE_DISCOUNT":
      return { ...state, discount: action.value };
    case "CHANGE_TYPE":
      return { ...state, type: action.value };
    case "CHANGE_TOTAL":
      return { ...state, total: Number(action.value) };
    default:
      return state;
  }
};

const BillProducts = ({ product, purchased, setPurchased }) => {
  // Define an initial state
  const initialState = {
    piece: product.piece,
    price: product.price,
    packet: product.packet,
    box: product.box,
    discount: product.discount,
    type: product.type,
    total: product.total,
  };

  // Use the reducer to manage state
  const [state, dispatch] = useReducer(reducer, initialState);
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  // Function to handle changes and dispatch actions
  const handleChange = (type, value) => {
    setChange(true);

    dispatch({ type: `CHANGE_${type.toUpperCase()}`, value });
    if (
      type === "piece" ||
      type === "packet" ||
      type === "box" ||
      type === "price" ||
      type === "discount"
    ) {
      calculateTotal(
        state.piece,
        state.box,
        state.packet,
        state.price,
        state.discount
      );
    }
  };

  const calculateTotal = (piece, box, packet, price, discount) => {
    let total =
      piece * price +
      box * product.boxQuantity * price +
      packet * product.packetQuantity * price -
      discount;
    total = Number(total);
    dispatch({ type: "CHANGE_TOTAL", value: total.toFixed() });
  };

  useEffect(() => {
    // console.log(1);
    calculateTotal(
      state.piece,
      state.box,
      state.packet,
      state.price,
      state.discount
    );
  }, [state.piece, state.box, state.packet, state.discount, state.price]);

  useEffect(() => {
    // console.log(2);
    const updatedProduct = purchased.find((p) => p.id === product.id);

    if (updatedProduct && state.piece !== updatedProduct.piece) {
      // handleChange("piece", updatedProduct.piece);
      setChange(false);

      dispatch({ type: "CHANGE_PIECE", value: updatedProduct.piece });
    }
  }, [product]);

  useEffect(() => {
    // console.log(3);
    if (product !== undefined && change) {
      // Create a new product object with the updated fields
      // console.log("Mujhe bulaye the");
      const foundProduct = purchased.find((pr) => pr.id === product.id);
      if (foundProduct) {
        const updatedProduct = {
          ...foundProduct,
          piece: Number(state.piece),
          price: Number(state.price),
          packet: Number(state.packet),
          box: Number(state.box),
          discount: Number(state.discount),
          type: state.type,
          total: Number(state.total),
        };
        const newPurchased = purchased.map((pr) => {
          if (pr.id === product.id) {
            return updatedProduct;
          }
          return pr;
        });
        setPurchased(newPurchased);
      }
    }
  }, [state]);

  const handleRemoveProduct = () => {
    // Create a new purchased array that excludes the product at the specified index
    const newPurchased = purchased.filter((pr) => pr.id !== product.id);
    setPurchased(newPurchased);
  };

  return (
    <tr key={product.id} className="mb-3 border border-black">
      <td
        onClick={handleRemoveProduct}
        className="text-center mx-auto  text-xl py-2"
      >
        <span className=" text-red-600 hover:cursor-pointer font-bold bg-gray-400 px-2 py-1 rounded-full hover:text-red-800">
          X
        </span>
      </td>
      <td className="text-center capitalize font-semibold text-xl py-2">
        <span className="flex items-center justify-center ">
          {product.name}{" "}
          {product.measuring === "kg" && (
            <FaCalculator
              onClick={() => setOpen(true)}
              className="mx-3 hover:cursor-pointer hover:text-green-500"
            />
          )}
          {open && (
            <Calculator
              product={product}
              setIsOpen={setOpen}
              handleChange={handleChange}
              setQuantity={setQuantity}
            />
          )}
        </span>
      </td>
      <td className="text-center font-semibold text-xl py-2">{state.price}₹</td>
      <td className="text-center font-semibold text-xl py-2">
        <div className="max-w-fit mx-auto border-green-500 border rounded-xl">
          <span
            onClick={() => {
              handleChange("type", "superWholesale");
              handleChange("price", Number(product.superWholesalePrice));
            }}
            className={`px-3 rounded-xl ${
              state.type === "superWholesale" ? "bg-green-500 text-white" : ""
            }`}
          >
            SWP
          </span>
          <span
            onClick={() => {
              handleChange("type", "wholesale");
              handleChange("price", Number(product.wholesalePrice));
            }}
            className={`px-2 rounded-xl ${
              state.type === "wholesale" ? "bg-green-500 text-white" : ""
            }`}
          >
            WP
          </span>
          <span
            onClick={() => {
              handleChange("type", "retail");
              handleChange("price", Number(product.retailPrice));
            }}
            className={`px-3 rounded-xl ${
              state.type === "retail" ? "bg-green-500 text-white" : ""
            }`}
          >
            RP
          </span>
        </div>
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.piece}
          onChange={(e) => handleChange("piece", Number(e.target.value))}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.packet}
          onChange={(e) => handleChange("packet", Number(e.target.value))}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.box}
          onChange={(e) => handleChange("box", Number(e.target.value))}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.discount}
          onChange={(e) => handleChange("discount", Number(e.target.value))}
          className="max-w-[50px]"
        />
        ₹
      </td>
      <td className="text-center font-semibold text-xl py-2">{state.total}₹</td>
    </tr>
  );
};

BillProducts.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    boxQuantity: PropTypes.number.isRequired,
    packetQuantity: PropTypes.number.isRequired,
    piece: PropTypes.number.isRequired,
    packet: PropTypes.number.isRequired,
    box: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    wholesalePrice: PropTypes.number.isRequired,
    retailPrice: PropTypes.number.isRequired,
    measuring: PropTypes.string.isRequired,
    superWholesalePrice: PropTypes.number.isRequired,
  }).isRequired,
  purchased: PropTypes.array.isRequired,
  setPurchased: PropTypes.func.isRequired,
};

export default BillProducts;
