import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";

const BarcodePage = () => {
  const { products } = useSelector((store) => store.product);
  // console.log(products);

  const [barcode, setBarcode] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [quantity, setQuantity] = useState(0);
  console.log("Barcode", barcode);
  const [hidden, setHidden] = useState(true);
  const [query, setQuery] = useState("");
  const [productOptions, setProductOptions] = useState([]);

  const searchProduct = () => {
    return products.filter((product) => {
      const queryValue = Number(query);
      if (isNaN(queryValue)) {
        // Query is not a valid number, so search by name
        return product.name.toLowerCase().includes(query);
      } else {
        // Query is a valid number, so search by barcode
        return product.barcode.includes(queryValue);
      }
    });
  };
  useEffect(() => {
    const updatedOptions = searchProduct();
    setProductOptions(updatedOptions);

    if (updatedOptions.length === 1) {
      setSelectedProduct(updatedOptions[0]);
    } else {
      setSelectedProduct(null); // Handle the case where there are no or multiple options
    }
  }, [query]);

  return (
    <div className="min-w-[85vw]">
      {!hidden && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-slate-100 min-h-[30vh] min-w-[30vw] px-3 rounded-xl">
            <h1 className="font-semibold text-2xl my-2 text-center capitalize bg-green-400 text-white">
              {selectedProduct && selectedProduct.name}
            </h1>
            <div className="flex flex-col">
              <p className="font-semibold text-xl my-2">Barcode:</p>
              <div className="flex flex-wrap my-2">
                {selectedProduct &&
                  selectedProduct.barcode.map((b) => {
                    return (
                      <div
                        onClick={() => setSelectedBarcode(b)}
                        className={`${
                          selectedBarcode === b ? "bg-green-300 " : " bg-white"
                        } px-2 border hover:cursor-pointer  border-green-500 py-2 rounded-xl mx-2`}
                        key={b}
                      >
                        {b}
                      </div>
                    );
                  })}
              </div>
              <div className="flex my-3">
                <p>Number Of Barcode:</p>
                <input
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  type="number"
                  className="border-b-2 pl-3 outline-none border-green-500"
                />
              </div>
              <div className="min-w-full flex items-end justify-end">
                <button
                  className="bg-red-400  rounded-xl p-2 font-semibold text-xl"
                  onClick={() => setHidden(true)}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    barcode.push({
                      barcode: selectedBarcode,
                      quantity: parseInt(quantity, 10), // Convert quantity to a number
                    });
                    setSelectedProduct(null);
                    setSelectedBarcode(null);
                    setQuery("");
                    setSelectedBarcode(null);
                    setHidden(true);
                  }}
                  className="bg-green-400 ml-6  rounded-xl p-2 font-semibold text-xl"
                >
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <h1 className="text-3xl  text-center py-3 font-bold">
        <span className="px-6 border-b-2 border-green-600">BarcodePage</span>
      </h1> */}
      <div className="py-2 relative">
        <div className="flex min-w-full px-6 my-2 items-center justify-start ">
          <span className="px-16 text-2xl font-bold">Search for Product</span>
          <input
            type="text"
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
        {productOptions.length > 0 && (
          <div className="absolute z-10 left-96 max-h-72 overflow-y-scroll bg-gray-300  rounded-xl py-2 top-16 capitalize font-semibold">
            {productOptions.map((prod) => {
              return (
                <div
                  className="py-1 hover:bg-green-300 px-6 hover:cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setSelectedBarcode(prod.barcode[0]);
                    setProductOptions([]);
                    setHidden(false);
                  }}
                  key={prod._id}
                >
                  {prod.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-[85vw] mt-3 ml-3 flex flex-wrap">
        {barcode.map((bar) => {
          return Array(bar.quantity)
            .fill("")
            .map(() => {
              return (
                <Barcode
                  key={bar.barcode}
                  width={2}
                  value={bar.barcode}
                  height={30}
                  fontSize={12}
                />
              );
            });
        })}
      </div>
    </div>
  );
};

export default BarcodePage;
