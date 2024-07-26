import { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

const BarcodePage = () => {
  const { products } = useSelector((store) => store.product);
  const [barcode, setBarcode] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [query, setQuery] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const componentRef = useRef();

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
    <div className="pl-24 min-w-[95vw]">
      {!hidden && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-slate-100 min-h-[30vh] min-w-[30vw] px-3 rounded-xl">
            <h1 className="font-semibold my-2 text-center capitalize bg-green-400 text-white">
              {selectedProduct && selectedProduct.name}
            </h1>
            <div className="flex flex-col">
              <p className="font-semibold my-2">Barcode:</p>
              <div className="flex flex-wrap my-2">
                {selectedProduct &&
                  selectedProduct.barcode.map((b) => {
                    return (
                      <div
                        onClick={() => setSelectedBarcode(b)}
                        className={`${
                          selectedBarcode === b ? "bg-green-300 " : " bg-white"
                        } px-2 border hover:cursor-pointer border-green-500 py-2 rounded-xl mx-2`}
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
                  className="bg-red-400 rounded-xl p-2 font-semibold"
                  onClick={() => setHidden(true)}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    let newBarcode = [...barcode];

                    newBarcode.push({
                      barcode: selectedBarcode,
                      quantity: parseInt(quantity, 10), // Convert quantity to a number
                      name: selectedProduct.name, // Include the product name
                    });
                    setBarcode(newBarcode);
                    setSelectedProduct(null);
                    setSelectedBarcode(null);
                    setQuery("");
                    setHidden(true);
                  }}
                  className="bg-green-400 ml-6 rounded-xl p-2 font-semibold"
                >
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="py-2 relative">
        <div className="flex min-w-full px-6 my-2 items-center justify-start">
          <span className="px-16 font-bold">Search for Product</span>
          <input
            type="text"
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <ReactToPrint
            trigger={() => (
              <button className="bg-blue-500 mx-6 text-white p-2 rounded">
                Print Barcodes
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
        {productOptions.length > 0 && (
          <div className="absolute z-10 left-96 max-h-72 overflow-y-scroll bg-gray-300 rounded-xl py-2 top-16 capitalize font-semibold">
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

      <div className="max-w-[794px] ml-3 flex flex-wrap" ref={componentRef}>
        {barcode
          .reduce(
            (acc, bar, index) => {
              const barcodes = Array(bar.quantity)
                .fill("")
                .map((_, i) => ({
                  name: bar.name,
                  barcode: bar.barcode,
                  key: `${bar.barcode}-${index}-${i + acc.currentIndex}`,
                  index: acc.currentIndex + i,
                }));

              acc.currentIndex += bar.quantity;
              acc.barcodes.push(...barcodes);
              return acc;
            },
            { barcodes: [], currentIndex: 0 }
          )
          .barcodes.map((bar) => (
            <div
              className={`w-1/5 my-2 flex flex-col items-center justify-center ${
                bar.index % 65 <= 4 && "mt-9"
              }`}
              key={bar.key}
            >
              <span className="text-[10px] capitalize">{bar.name}</span>
              <Barcode
                width={1.4}
                value={bar.barcode}
                height={20}
                fontSize={10}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BarcodePage;
