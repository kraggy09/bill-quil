import { useEffect, useReducer, useState } from "react";
import { FaCalculator } from "react-icons/fa";
import Calculator from "./Calculator";

import PropTypes from "prop-types";
import usePriceTag from "../hooks/usePriceTag";

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
  const { getPriceTag } = usePriceTag();

  // Use the reducer to manage state
  const [state, dispatch] = useReducer(reducer, initialState);
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [click, setClick] = useState(false);

  // Function to handle changes and dispatch actions
  const handleChange = (type, value, auto = true) => {
    setChange(true);
    dispatch({ type: `CHANGE_${type.toUpperCase()}`, value });

    if (auto) {
      // Call getPriceTag to get updated type and price
      const { type: updatedType, price: updatedPrice } = getPriceTag({
        piece: type === "piece" ? value : state.piece,
        packet: type === "packet" ? value : state.packet,
        box: type === "box" ? value : state.box,
        ...product, // Pass other necessary product details
      });

      // Dispatch actions to update type and price
      dispatch({ type: "CHANGE_PRICE", value: Number(updatedPrice) });
      dispatch({ type: "CHANGE_TYPE", value: updatedType });
    }
    // Optionally, you can calculate total here if needed
    calculateTotal(
      type === "piece" ? value : state.piece,
      type === "box" ? value : state.box,
      type === "packet" ? value : state.packet,
      state.price,
      state.discount,
      auto
    );
  };

  const calculateTotal = (piece, box, packet, price, discount, auto = true) => {
    let total =
      piece * price +
      box * product.boxQuantity * price +
      packet * product.packetQuantity * price -
      discount;

    if (!auto) {
      dispatch({ type: "CHANGE_TOTAL", value: total.toFixed(2) });
      return;
    }

    let totalPieces =
      piece + box * product.boxQuantity + packet * product.packetQuantity;
    const updated = getPriceTag(product, totalPieces);
    dispatch({ type: "CHANGE_TYPE", value: updated.type });
    dispatch({ type: "CHANGE_PRICE", value: updated.price });

    let newTotal = state.price * totalPieces;
    dispatch({ type: "CHANGE_TOTAL", value: newTotal.toFixed(2) });
  };

  useEffect(() => {
    calculateTotal(
      state.piece,
      state.box,
      state.packet,
      state.price,
      state.discount,
      false
    );
  }, [click]);

  useEffect(() => {
    calculateTotal(
      state.piece,
      state.box,
      state.packet,
      state.price,
      state.discount,
      true
    );
  }, [state.piece, state.box, state.packet, state.discount]);

  useEffect(() => {
    const updatedProduct = purchased.find((p) => p.id === product.id);
    if (updatedProduct && state.piece !== updatedProduct.piece) {
      setChange(false);
      const { type, price } = getPriceTag(updatedProduct);
      handleChange("type", type, false);
      handleChange("price", Number(price), false);
      dispatch({ type: "CHANGE_PIECE", value: updatedProduct.piece });
    }
  }, [product]);

  useEffect(() => {
    if (product !== undefined && change) {
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
          total: state.total,
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
    const newPurchased = purchased.filter((pr) => pr.id !== product.id);
    setPurchased(newPurchased);
  };

  return (
    <tr key={product.id} className="mb-3 border border-black">
      <td className="text-center font-semibold py-2">
        {product?.stock % 1 != 0 ? product?.stock.toFixed(2) : product?.stock}
      </td>

      <td onClick={handleRemoveProduct} className="text-center mx-auto py-2">
        <span className="text-red-600 hover:cursor-pointer font-bold bg-slate-200 px-2 py-1 rounded-full hover:text-red-800">
          X
        </span>
      </td>
      <td className="text-center capitalize font-semibold py-2">
        <span className="flex items-center justify-center">
          {product.name}
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
      <td className="text-center font-semibold py-2">
        {state.price % 1 != 0 ? state.price.toFixed(2) : state.price}₹
      </td>
      <td className="text-center font-semibold py-2">
        <div className="max-w-fit mx-auto border-green-500 border rounded-lg">
          <span
            onClick={() => {
              handleChange("type", "superWholesale", false);
              handleChange("price", Number(product.superWholesalePrice), false);
              setClick((prev) => !prev);
            }}
            className={`px-3 rounded-lg ${
              state.type === "superWholesale" ? "bg-green-500 text-white" : ""
            }`}
          >
            SWP
          </span>
          <span
            onClick={() => {
              handleChange("type", "wholesale", false);
              handleChange("price", Number(product.wholesalePrice), false);
              setClick((prev) => !prev);
            }}
            className={`px-2 rounded-lg ${
              state.type === "wholesale" ? "bg-green-500 text-white" : ""
            }`}
          >
            WP
          </span>
          <span
            onClick={async () => {
              handleChange("type", "retail", false);
              handleChange("price", Number(product.retailPrice), false);
              setClick((prev) => !prev);
            }}
            className={`px-3 rounded-lg ${
              state.type === "retail" ? "bg-green-500 text-white" : ""
            }`}
          >
            RP
          </span>
        </div>
      </td>
      <td className="text-center font-semibold py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.piece}
          onChange={(e) => {
            handleChange("piece", Number(e.target.value));
          }}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.packet}
          onChange={(e) => {
            if (state.packet == 0) {
              handleChange("piece", 0);
            }

            handleChange("packet", Number(e.target.value));
          }}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.box}
          onChange={(e) => {
            if (state.box == 0) {
              handleChange("packet", 0);
              handleChange("piece", 0);
            }

            handleChange("box", Number(e.target.value));
          }}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold py-2">
        <input
          onWheel={(e) => e.target.blur()}
          type="number"
          value={state.discount}
          onChange={(e) => handleChange("discount", Number(e.target.value))}
          className="max-w-[50px]"
        />
        ₹
      </td>
      <td className="text-center font-semibold py-2">{state.total}₹</td>
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
    stock: PropTypes.number.isRequired,
    retailPrice: PropTypes.number.isRequired,
    measuring: PropTypes.string.isRequired,
    superWholesalePrice: PropTypes.number.isRequired,
  }).isRequired,
  purchased: PropTypes.array.isRequired,
  setPurchased: PropTypes.func.isRequired,
};

export default BillProducts;
