import axios from "axios";
axios.defaults.withCredentials = true;

import Loading from "./Loading";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../store/productSlice";
import { ToastContainer, toast } from "react-toastify";
import { apiUrl } from "../constant";

const apiUrl1 = "/products/updateStock";

const calculateStock = (product) => {
  let boxes = 0;
  let packets = 0;
  let remainingProduct = 0;
  if (product.box !== 0) {
    boxes = Math.floor(product.stock / product.box);
    remainingProduct = product.stock - boxes * product.box;
  }
  if (product.packet !== 0) {
    packets = Math.floor(remainingProduct / product.packet);
  }
  if (product.box === 0 && product.packet === 0) {
    remainingProduct = product.stock;
    return `${remainingProduct} Pieces`;
  } else {
    remainingProduct = remainingProduct - packets * product.packet;
    return `${boxes} Box ${packets} Packet ${remainingProduct} Pieces`;
  }
};

const UpdateStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state;
  const dispatch = useDispatch();
  const [box, setBox] = useState(0);
  const [packets, setPackets] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log(product);

  const handleSubmit = (e) => {
    setLoading(true);
    const id = product._id;
    e.preventDefault();
    axios
      .post(apiUrl + apiUrl1, { quantity, id })
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success("Product updated successfully");
        navigate("/products");
        dispatch(fetchProducts());
      })
      .then((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Error", err.msg);
      });
  };

  useEffect(() => {
    // Convert input values to numbers, or use 0 if conversion fails
    const boxValue = Math.max(0, parseInt(box, 10)) || 0;
    const packetsValue = Math.max(0, parseInt(packets, 10)) || 0;
    const piecesValue = Math.max(0, parseFloat(pieces, 10)) || 0;

    setQuantity(
      boxValue * product.box + packetsValue * product.packet + piecesValue
    );
  }, [box, packets, pieces]);

  return (
    <div className="min-w-[85vw] min-h-full flex items-center justify-center">
      <div className="min-h-[50vh] min-w-[50vw] rounded-xl shadow-xl shadow-gray-400">
        <h1 className="text-3xl text-center">Update Product Stock</h1>
        <p className="capitalize text-3xl text-center my-6 font-semibold">
          {product.name}
        </p>

        <p className="capitalize  text-3xl text-center my-6 font-semibold">
          Old Stock: {calculateStock(product)}
        </p>
        <div className="min-w-full mt-6 flex items-center justify-center">
          <span className="text-3xl font-bold min-w-[200px]">
            <p className="text-start">Boxes:</p>
            <input
              className="text-3xl outline-none border-b-2 border-green-600 pl-6 max-w-[150px] min-h-[50px]"
              type="number"
              value={box}
              onChange={(e) => setBox(parseInt(e.target.value))}
            />
          </span>
          <span className="text-3xl font-bold min-w-[200px]">
            <p className="text-start">Packets:</p>
            <input
              className="text-3xl outline-none border-b-2 border-green-600 pl-6 max-w-[150px] min-h-[50px]"
              type="number"
              value={packets}
              onChange={(e) => setPackets(parseInt(e.target.value))}
            />
          </span>
          <span className="text-3xl font-bold min-w-[200px]">
            <p className="text-start">Pieces:</p>
            <input
              className="text-3xl outline-none border-b-2 border-green-600 pl-6 max-w-[150px] min-h-[50px]"
              type="number"
              value={pieces}
              onChange={(e) => setPieces(parseFloat(e.target.value))}
            />
          </span>
        </div>
        <p>Total quantity to be updated:{quantity}</p>

        <div className="min-w-full flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-2xl font-semibold p-3 text-white rounded-xl my-6 mx-auto"
          >
            Update Stock
          </button>
          <ToastContainer autoClose={3000} />
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default UpdateStock;
