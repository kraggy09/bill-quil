import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "./Loading";
import { apiUrl } from "../constant";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UpdateStockRequest = () => {
  const { products } = useSelector((store) => store.product);
  const user = useSelector((store) => store.user);

  const [updatedProducts, setUpdatedProducts] = useState({
    createdBy: null,
    update: [],
  });
  const [query, setQuery] = useState("");
  console.log(updatedProducts);

  const [productOptions, setProductOptions] = useState(products);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  class Product {
    constructor(id, name, barcode, quantity, stock, piece, packet, box) {
      this.box = box;
      this.pieceQuantity = 0;
      this.packetQuantity = 0;
      this.boxQuantity = 0;
      this.name = name;
      this.quantity = quantity;
      this.packet = packet;
      this.piece = piece;
      this.id = id;
      this.barcode = barcode;
      this.stock = stock;
    }
  }

  const searchProduct = () => {
    return products.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        return product.name.toLowerCase().includes(query);
      } else {
        return product.barcode.includes(queryValue);
      }
    });
  };

  useEffect(() => {
    const updatedOptions = searchProduct();
    setProductOptions(updatedOptions);
    if (updatedOptions.length === 1) {
      const newProduct = new Product(
        updatedOptions[0]._id,
        updatedOptions[0].name,
        updatedOptions[0].barcode,
        0,
        updatedOptions[0].stock,
        updatedOptions[0].piece,
        updatedOptions[0].packet,
        updatedOptions[0].box
      );
      const newProductList = {
        createdBy: user.username,
        update: updatedProducts.update.map((prevProduct) => prevProduct),
      };
      newProductList.update.push(newProduct);
      setUpdatedProducts(newProductList);
      setQuery("");
    }
  }, [query]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        apiUrl + "/products/updateInventoryRequest",
        updatedProducts
      );
      if (res.data) {
        toast.success(res.data.msg);
      }
      setTimeout(() => {
        navigate("/products");
      }, 1500);
      setLoading(false);
    } catch (error) {
      toast.error("Error" + error.message);
      setLoading(false);

      console.log("Error", error);
    }
  };

  return (
    <div className="ml-24">
      {loading && <Loading />}
      <header className="min-w-[85vw] mt-3">
        <div className="flex ">
          <p className="text-xl font-semibold ml-6">Search for Products:</p>
          <span>
            <input
              className="outline-none ml-3 border-b-2 border-green-500 text-xl px-6 font-semibold"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            {query.length > 0 && (
              <div className="absolute z-10 left-72 max-h-72 overflow-y-scroll bg-gray-300  rounded-xl py-2 top-12 capitalize font-semibold">
                {productOptions.map((prod) => {
                  return (
                    <div
                      className="py-1 hover:bg-green-300 px-6 hover:cursor-pointer"
                      onClick={() => {
                        const newProduct = new Product(
                          prod._id,
                          prod.name,
                          prod.barcode,
                          0,
                          prod.stock,
                          prod.piece,
                          prod.packet,
                          prod.box
                        );
                        const newProductList = {
                          createdBy: user.username,
                          update: updatedProducts.update.map(
                            (prevProduct) => prevProduct
                          ),
                        };
                        newProductList.update.push(newProduct);
                        setUpdatedProducts(newProductList);
                        setQuery("");
                      }}
                      key={prod._id}
                    >
                      {prod.name}
                    </div>
                  );
                })}
              </div>
            )}
          </span>
        </div>
      </header>
      <main className="min-w-[85vw]  mt-16">
        {updatedProducts.update.length > 0 ? (
          <table className="min-w-[80vw] ml-8 mt-6">
            <thead className="border border-black rounded-xl">
              <tr>
                <th className="text-2xl ">Action</th>
                <th className="text-2xl">Name</th>
                <th className="text-2xl">Old Stock</th>
                <th className="text-2xl">Piece</th>
                <th className="text-2xl">Packet</th>
                <th className="text-2xl">Box</th>
                <th className="text-2xl">Quantity</th>
              </tr>
            </thead>
            <tbody className="mt-20 border border-black">
              {[...updatedProducts.update].reverse().map((prod) => {
                return (
                  <tr key={prod.id} className="border border-black">
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      <span
                        className="bg-red-200 p-4 text-red-800  hover:cursor-pointer rounded-full font-bold"
                        onClick={() => {
                          const updatedProductList = {
                            createdBy: user.username,
                            update: updatedProducts.update.filter(
                              (p) => p.id !== prod.id
                            ),
                          };
                          setUpdatedProducts(updatedProductList);
                        }}
                      >
                        X
                      </span>
                    </td>
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      {prod.name}
                    </td>
                    <td className="text-center flex flex-col capitalize font-semibold text-xl py-2">
                      <p> {prod.stock}</p>
                      <p className="text-[18px] rounded-xl bg-green-200  mt-2">
                        {calculateStock(prod)}
                      </p>
                    </td>
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      <input
                        type="number"
                        className="max-w-[50px] text-center outline-none border-b-2 border-green-800"
                        value={prod.pieceQuantity}
                        onChange={(e) => {
                          setUpdatedProducts((prevProducts) => {
                            const inputValue = parseInt(e.target.value, 10);
                            const updatedProductsList = {
                              createdBy: user.username,
                              update: prevProducts.update.map((prevProduct) => {
                                if (prevProduct.id === prod.id) {
                                  return {
                                    ...prevProduct,
                                    pieceQuantity: isNaN(inputValue)
                                      ? 0
                                      : inputValue,
                                    quantity:
                                      (isNaN(inputValue) ? 0 : inputValue) +
                                      prevProduct.boxQuantity *
                                        prevProduct.box +
                                      prevProduct.packetQuantity *
                                        prevProduct.packet,
                                  };
                                }
                                return prevProduct;
                              }),
                            };
                            return updatedProductsList;
                          });
                        }}
                      />
                      <p className="text-[18px] min-w-full mt-2 rounded-xl bg-yellow-200">
                        1 Piece
                      </p>
                    </td>
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      <input
                        type="number"
                        className="max-w-[50px] text-center outline-none border-b-2 border-green-800"
                        value={prod.packetQuantity}
                        onChange={(e) => {
                          setUpdatedProducts((prevProducts) => {
                            const inputValue = parseInt(e.target.value, 10);
                            const updatedProductsList = {
                              createdBy: user.username,
                              update: prevProducts.update.map((prevProduct) => {
                                if (prevProduct.id === prod.id) {
                                  return {
                                    ...prevProduct,
                                    packetQuantity: isNaN(inputValue)
                                      ? 0
                                      : inputValue,
                                    quantity:
                                      prevProduct.pieceQuantity +
                                      (isNaN(inputValue) ? 0 : inputValue) *
                                        prevProduct.packet +
                                      prevProduct.boxQuantity * prevProduct.box,
                                  };
                                }
                                return prevProduct;
                              }),
                            };
                            return updatedProductsList;
                          });
                        }}
                      />

                      <p className="text-[18px] min-w-full mt-2 rounded-xl bg-yellow-200">
                        {prod.packet} Pieces
                      </p>
                    </td>
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      <input
                        type="number"
                        className="max-w-[50px] text-center outline-none border-b-2 border-green-800"
                        value={prod.boxQuantity}
                        onChange={(e) => {
                          setUpdatedProducts((prevProducts) => {
                            const inputValue = parseInt(e.target.value, 10);
                            const updatedProductsList = {
                              createdBy: user.username,
                              update: prevProducts.update.map((prevProduct) => {
                                if (prevProduct.id === prod.id) {
                                  return {
                                    ...prevProduct,
                                    boxQuantity: isNaN(inputValue)
                                      ? 0
                                      : inputValue,
                                    quantity:
                                      prevProduct.pieceQuantity +
                                      prevProduct.packetQuantity *
                                        prevProduct.packet +
                                      (isNaN(inputValue) ? 0 : inputValue) *
                                        prevProduct.box,
                                  };
                                }
                                return prevProduct;
                              }),
                            };
                            return updatedProductsList;
                          });
                        }}
                      />
                      <p className="text-[18px] min-w-full mt-2 rounded-xl bg-yellow-200">
                        {prod.box} Pieces
                      </p>
                    </td>
                    <td className="text-center capitalize font-semibold text-xl py-2">
                      {prod.quantity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h1 className="text-center">
            <span className="bg-red-100 px-16 text-xl rounded-xl font-semibold text-red-800 py-2">
              Please Select the Products to configure them
            </span>
          </h1>
        )}
      </main>
      {updatedProducts.update.length > 0 && (
        <div className="min-w-full flex items-end justify-end">
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-green-200 border-green-400 text-xl mr-16 mt-6 px-4 py-2 rounded-xl font-semibold "
          >
            Update
          </button>
        </div>
      )}
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default UpdateStockRequest;
