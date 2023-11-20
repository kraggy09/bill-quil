import PropTypes from "prop-types";
import { useEffect, useState } from "react";
const Calculator = ({ product, setIsOpen, setQuantity, handleChange }) => {
  const [measure, setMeasure] = useState(0);
  const [change, setChange] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (change) {
      setChange(false);
      const gramperPrice = 1000 / product.price;
      const newGram = (gramperPrice * price).toFixed(2);
      setMeasure(newGram);
    }
  }, [price]);

  useEffect(() => {
    if (change) {
      const pricePerGram = product.price / 1000;
      const newPrice = pricePerGram * measure;
      setPrice(newPrice);
      setChange(false);
    }
  }, [measure]);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white min-w-[40vw] flex flex-col  rounded-xl min-h-[60vh]">
        <h1 className="mx-12 text-center my-6 rounded-xl text-3xl font-bold bg-green-500 text-white py-3 ">
          Measuring Calculator
        </h1>
        <h3 className="text-center my-3 text-2xl font-semibold capitalize">
          Product Name: {product.name}
        </h3>
        <h3 className="text-center my-3 text-2xl font-semibold capitalize">
          Product Price: {product.price}
        </h3>
        <span className="flex items-center justify-center min-w-full my-3">
          <label className="text-3xl mx-3" htmlFor="price">
            Price:
          </label>
          <input
            type="text"
            className="text-3xl outline-none border-b-4 focus:border-green-500"
            id="price"
            value={price}
            onChange={(e) => {
              setChange(true);
              setPrice(e.target.value);
            }}
          />
        </span>
        <span className="flex items-center justify-center min-w-full my-3">
          <label className="text-3xl mx-3" htmlFor="measure">
            Measure:
          </label>
          <input
            type="text"
            className="text-3xl outline-none border-b-4 focus:border-green-500"
            id="measure"
            value={(measure / 1000).toPrecision(4)}
            onChange={(e) => {
              setChange(true);
              setMeasure(e.target.value);
            }}
          />
        </span>

        <div className="flex text-xl justify-around my-6">
          <button
            onClick={() => {
              console.log("Button Clicked!");
              console.log("Setting Quantity:", measure);
              setQuantity(measure);
              handleChange("piece", measure / 1000);
              setIsOpen(false);
            }}
            className="bg-green-500 hover-bg-gray-600 min-w-[20vw] text-white font-bold py-2 px-4 rounded mt-4"
          >
            Set the Price
          </button>

          <button
            onClick={() => {
              console.log(measure);
              setQuantity(measure);

              setIsOpen(false);
            }}
            className="bg-gray-400 hover-bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

Calculator.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    measuring: PropTypes.string.isRequired,
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
    superWholesalePrice: PropTypes.number.isRequired,
  }).isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default Calculator;
