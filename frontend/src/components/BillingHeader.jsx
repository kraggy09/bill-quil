import { useEffect, useRef, useState } from "react";
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
    measuring,
    barcode,
    name,
    price,
    mrp,
    type,
    piece,
    packet,
    box,
    discount,
    total,
    category,
    hi
  ) {
    this.id = id;
    this.boxQuantity = boxQuantity;
    this.packetQuantity = packetQuantity;
    this.retailPrice = retailPrice;
    this.barcode = barcode;
    this.measuring = measuring;
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
    this.category = category;
    this.hi = hi;
  }
}

const BillingHeader = ({
  billType,
  foundCustomer,
  reload,
  setFoundCustomer,
  purchased,
  setPurchased,
}) => {
  const bill = useSelector((store) => store.billId);
  const [visible, setVisible] = useState(true);
  const [productvisible, setProductVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [name, setName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const products = useSelector((store) => store.product.products);
  const customers = useSelector((store) => store.customer.customers);

  const findCustomer = (val) => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(val.toLowerCase())
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
      }, 100)
    );
  };

  const findProduct = (val) => {
    let temp = Number(val);
    if (billType !== "return") {
      if (!isNaN(temp)) {
        return products.filter((product) => {
          if (val === "") {
            return false; // Don't filter if the search value is empty
          }
          if (product.stock > 0 && product.barcode.includes(temp)) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return products.filter((product) => {
          if (val === "") {
            return false; // Don't filter if the search value is empty
          }
          if (
            product.stock > 0 &&
            product.name.toLowerCase().includes(val.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
    } else {
      if (!isNaN(temp)) {
        return products.filter((product) => {
          if (val === "") {
            return false; // Don't filter if the search value is empty
          }
          if (product.barcode.includes(temp)) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return products.filter((product) => {
          if (val === "") {
            return false; // Don't filter if the search value is empty
          }
          if (product.name.toLowerCase().includes(val.toLowerCase())) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
  };

  const handleCustomerSelection = (customer) => {
    setName(customer.name);
    setVisible(false);
    setFoundCustomer(customer);
  };

  const customerNameRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F2") {
        customerNameRef.current.focus();
      }
      if (event.key === "Enter") {
        if (customerNameRef.current === document.activeElement) {
          if (visible && name.trim().length > 0) {
            const filteredCustomers = findCustomer(name.trim());
            if (filteredCustomers.length === 1) {
              handleCustomerSelection(filteredCustomers[0]);
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [name, visible]);

  useEffect(() => {
    let updatedCustomer = findCustomer(name);
    if (foundCustomer?._id) {
      let id = foundCustomer?._id;
      let finalCustomer = updatedCustomer.filter((a) => a._id === id);
      setFoundCustomer(finalCustomer[0]);
    }
  }, [reload]);

  useEffect(() => {
    if (name.length === 0) {
      setFoundCustomer({});
    }
  }, [name]);

  const handleProductSelection = (product) => {
    setProductName("");
    const existingProduct = purchased.find((p) => p.name === product.name);
    if (!existingProduct) {
      const newProduct = new Product(
        product._id,
        product.packet,
        product.box,
        product.wholesalePrice,
        product.retailPrice,
        product.superWholesalePrice,
        product.measuring,
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
          : product.retailPrice) * 1,
        product.category,
        product.hi
      );
      setPurchased([...purchased, newProduct]);
    } else {
      const newPurchased = purchased.map((el) => {
        if (el.id === product._id) {
          return {
            ...el,
            piece: Number(el.piece) + 1,
            total: Number(el.total) + Number(el.price),
          };
        }
        return el;
      });

      setPurchased(newPurchased);
    }

    setProductVisible(false);
    setProductName("");
  };

  return (
    <header className="py-4">
      <div className="min-w-full mx-auto flex justify-around">
        <div className="flex flex-col mb-3">
          <p className="font-bold">Bill No.: {bill.id + 1}</p>
          <p className="font-bold">
            Bill Type:{" "}
            <i className="capitalize bg-green-500 px-2 py-1 text-white rounded-xl">
              {billType}
            </i>
          </p>
        </div>
        <span className="relative">
          <label htmlFor="customer_name">
            Customer Name
            <sup className="text-sm ml-2 rounded-full bg-green-300 px-2 py-1">
              F2
            </sup>
          </label>
          <input
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
            type="text"
            ref={customerNameRef}
            id="customer_name"
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                setFoundCustomer(null);
              }
            }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVisible(true);
            }}
          />
          <div className="min-w-[300px] max-h-[150px] overflow-auto absolute right-0 bg-gray-200 z-20 rounded-xl">
            {visible &&
              name !== "" &&
              findCustomer(name).map((d) => (
                <div
                  className="hover-bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:bg-green-400 hover:text-white"
                  onClick={() => handleCustomerSelection(d)}
                  key={d._id}
                >
                  {d.name}: {d.outstanding}
                </div>
              ))}
          </div>
        </span>
      </div>
      <div className="relative min-w-full flex items-center justify-center">
        Product:
        <span className="relative">
          <input
            className="border-b-2 border-green-600 mx-2 focus:bg-none px-4 font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none min-w-[450px]"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setProductVisible(true);
              delayedProductSearch(e.target.value);
            }}
          />
          <div className="min-w-[300px] absolute top-10 bg-gray-400 z-20 rounded-xl">
            {productvisible &&
              productName !== "" &&
              findProduct(productName).map((d) => (
                <div
                  className="hover-bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                  onClick={() => handleProductSelection(d)}
                  key={d._id}
                >
                  {d.name}: {d.mrp}₹
                </div>
              ))}
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
  foundCustomer: PropTypes.object.isRequired,
  reload: PropTypes.bool.isRequired,
};

export default BillingHeader;
