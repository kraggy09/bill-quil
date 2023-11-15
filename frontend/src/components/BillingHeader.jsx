import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

class Product {
  constructor(
    id,
    packetQuantity,
    boxQuantity,
    wholesalePrice,
    retailPrice,
    superWholesalePrice,
    barcode,
    name,
    price,
    mrp,
    type,
    piece,
    packet,
    box,
    discount,
    total
  ) {
    this.id = id;
    this.boxQuantity = boxQuantity;
    this.packetQuantity = packetQuantity;
    this.retailPrice = retailPrice;
    this.barcode = barcode;
    this.wholesalePrice = wholesalePrice;
    this.superWholesalePrice = superWholesalePrice;
    this.name = name;
    this.price = price;
    this.mrp = mrp;
    this.type = type;
    this.piece = piece;
    this.packet = packet;
    this.box = box;
    this.discount = discount;
    this.total = total;
  }
}

const BillingHeader = ({
  billType,
  setFoundCustomer,
  purchased,
  setPurchased,
}) => {
  const [visible, setVisible] = useState(true);
  const [productvisible, setProductVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [name, setName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const products = useSelector((store) => store.product.products);
  const customers = useSelector((store) => store.customer.customers);

  const findCustomer = (val) => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(val)
    );
  };

  const delayedProductSearch = (val) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        const foundProducts = findProduct(val);
        setProductVisible(true);

        if (foundProducts.length === 1) {
          handleProductSelection(foundProducts[0]);
        }
      }, 1000)
    );
  };

  const findProduct = (val) => {
    let temp = Number(val);
    if (!isNaN(temp)) {
      return products.filter((product) => {
        if (val === "") {
          return false; // Don't filter if the search value is empty
        }
        if (
          product.stock > 0 &&
          product.barcode.toString() === temp.toString()
        ) {
          return true;
        } else {
          // alert("Product is finished");
          return false;
        }
      });
    } else {
      return products.filter((product) => {
        if (val === "") {
          return false; // Don't filter if the search value is empty
        }
        if (product.stock > 0 && product.name.toLowerCase().includes(val)) {
          return true;
        } else {
          // alert("Product is finished");
          return false;
        }
      });
    }
  };

  const handleCustomerSelection = (customer) => {
    setName(customer.name);
    setVisible(false);
    setFoundCustomer(customer);
  };

  const handleProductSelection = (product) => {
    setProductName("");
    const existingProduct = purchased.find((p) => p.name === product.name);

    // id,
    // packetQuantity,
    // boxQuantity,
    // wholesalePrice,
    // retailPrice,
    // superWholesalePrice,
    // barcode,
    // name,
    // price,
    // mrp,
    // type,
    // piece,
    // packet,
    // box,
    // discount,
    // total
    if (!existingProduct) {
      const newProduct = new Product(
        product._id,
        product.packet,
        product.box,
        product.wholesalePrice,
        product.retailPrice,
        product.superWholesalePrice,
        product.barcode,
        product.name,
        billType === "wholesale"
          ? product.wholesalePrice
          : billType === "superWholesale"
          ? product.superWholesalePrice
          : product.retailPrice,
        product.mrp,
        billType,
        1,
        0,
        0,
        0,
        (billType === "wholesale"
          ? product.wholesalePrice
          : billType === "superWholesale"
          ? product.superWholesalePrice
          : product.retailPrice) * 1
      );
      setPurchased([...purchased, newProduct]);
    }
    setProductVisible(false);
    setProductName("");
  };

  return (
    <header className="py-4 ">
      <div className="min-w-full mx-auto flex justify-around">
        <div className="flex flex-col mb-3">
          <p className="text-xl font-bold">Bill No.:1</p>
          <p className="text-xl font-bold">
            Bill Type:{" "}
            <i className="capitalize bg-green-500 px-2 py-1 text-white rounded-xl">
              {billType}
            </i>
          </p>
        </div>
        <span className="relative text-xl">
          <label htmlFor="customer_name">Customer Name</label>
          <input
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
            type="text"
            id="customer_name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVisible(true);
            }}
          />
          <div className="min-w-[300px] absolute right-0 bg-gray-400 z-20 rounded-xl ">
            {visible &&
              name !== "" &&
              findCustomer(name).map((d) => (
                <div
                  className="hover-bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                  onClick={() => handleCustomerSelection(d)}
                  key={d._id}
                >
                  {d.name}: {d.outstanding}
                </div>
              ))}
          </div>
        </span>
      </div>
      <div className="relative min-w-full flex items-center justify-center text-xl">
        Product:
        <span className="relative">
          <input
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none min-w-[450px]"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setProductVisible(true);
              delayedProductSearch(e.target.value);
            }}
          />
          <div className="min-w-[300px] absolute top-10 bg-gray-400 z-20 rounded-xl ">
            {productvisible &&
              productName !== "" &&
              findProduct(productName).map((d) => {
                const foundProduct = findProduct(productName);
                if (foundProduct.length === 1) {
                  handleProductSelection(foundProduct[0]);
                }
                return (
                  <div
                    className="hover-bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                    onClick={() => handleProductSelection(d)}
                    key={d._id}
                  >
                    {d.name}: {d.mrp}₹
                  </div>
                );
              })}
          </div>
        </span>
      </div>
    </header>
  );
};

BillingHeader.propTypes = {
  billType: PropTypes.string.isRequired,
  setFoundCustomer: PropTypes.func.isRequired,
  purchased: PropTypes.array.isRequired,
  setPurchased: PropTypes.func.isRequired,
};

export default BillingHeader;
