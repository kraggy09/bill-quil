import { useEffect, useReducer } from "react";
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
      return { ...state, total: action.value };
    default:
      return state;
  }
};

const BillProducts = ({ product, index, purchased, setPurchased }) => {
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

  // Function to handle changes and dispatch actions
  const handleChange = (type, value) => {
    dispatch({ type: `CHANGE_${type.toUpperCase()}`, value });
    if (
      type === "piece" ||
      type === "packet" ||
      type === "box" ||
      type === "price" ||
      type === "discount"
    ) {
      calculateTotal();
    }
  };
  const calculateTotal = () => {
    const total =
      state.piece * state.price +
      state.box * product.boxQuantity * state.price +
      state.packet * product.packetQuantity * state.price -
      state.discount;
    handleChange("total", total.toFixed(2));
  };

  useEffect(() => {
    calculateTotal();
  }, [state.piece, state.box, state.packet, state.price, state.discount]);

  useEffect(() => {
    if (index !== undefined) {
      // Create a new product object with the updated fields
      const updatedProduct = {
        ...purchased[index],
        piece: Number(state.piece),
        price: Number(state.price),
        packet: Number(state.packet),
        box: Number(state.box),
        discount: Number(state.discount),
        type: state.type,
        total: Number(state.total),
      };

      // Update the purchased array with the updated product
      setPurchased((prevPurchased) => {
        const newPurchased = [...prevPurchased];
        newPurchased[index] = updatedProduct;
        return newPurchased;
      });
    }
  }, [state]);
  const handleRemoveProduct = () => {
    // Create a new purchased array that excludes the product at the specified index
    const newPurchased = purchased.filter((pr) => pr.name !== product.name);
    setPurchased(newPurchased);
  };

  return (
    <tr key={product.id} className="mb-3">
      <td
        onClick={handleRemoveProduct}
        className="text-center mx-auto  text-xl py-2"
      >
        <span className=" text-red-600 hover:cursor-pointer font-bold bg-gray-400 px-2 py-1 rounded-full hover:text-red-800">
          X
        </span>
      </td>
      <td className="text-center capitalize font-semibold text-xl py-2">
        {product.name}
      </td>
      <td className="text-center font-semibold text-xl py-2">{state.price}₹</td>
      <td className="text-center font-semibold text-xl py-2">
        <div className="max-w-fit mx-auto border-green-500 border rounded-xl">
          <span
            onClick={() => {
              handleChange("type", "wholesale");
              handleChange("price", product.wholesalePrice);
            }}
            className={`px-2 rounded-xl ${
              state.type === "wholesale" ? "bg-green-500 text-white" : ""
            }`}
          >
            Wholesale
          </span>
          <span
            onClick={() => {
              handleChange("type", "retail");
              handleChange("price", product.retailPrice);
            }}
            className={`px-3 rounded-xl ${
              state.type === "retail" ? "bg-green-500 text-white" : ""
            }`}
          >
            Retail
          </span>
        </div>
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          type="number"
          value={state.piece}
          onChange={(e) => handleChange("piece", e.target.value)}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          type="number"
          value={state.packet}
          onChange={(e) => handleChange("packet", e.target.value)}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          type="number"
          value={state.box}
          onChange={(e) => handleChange("box", e.target.value)}
          className="max-w-[50px]"
        />
      </td>
      <td className="text-center font-semibold text-xl py-2">
        <input
          type="number"
          value={state.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
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
  }).isRequired,
  index: PropTypes.number.isRequired,
  purchased: PropTypes.array.isRequired,
  setPurchased: PropTypes.func.isRequired,
};

export default BillProducts;
