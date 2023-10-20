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

const findCustomer = (customers, val) => {
  return customers.filter((customer) => {
    // console.log(customer);
    return customer.name.toLowerCase().includes(val);
  });
};

const findProduct = (products, val) => {
  const temp = Number(val);
  if (!isNaN(temp)) {
    // If val can be typecasted to a number, search for barcode
    return products.filter((product) => product.barcode == Number(temp));
  } else {
    // If val is not a number, search by name
    return products.filter((product) => {
      // console.log("Product name:", product.name); // Log the product name
      return product.name.toLowerCase().includes(val);
    });
  }
};

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
  const products = useSelector((store) => store.product.products);
  const customers = useSelector((store) => store.customer.customers);
  // console.log(foundCustomer);

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
            className="border-b-2 border-green-600 mx-2  focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none"
            type="text"
            id="customer_name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVisible(true);
            }}
          />
          <div className=" min-w-[300px] absolute right-0 bg-gray-400 z-20 rounded-xl ">
            {visible &&
              name != "" &&
              findCustomer(customers, name).map((d) => {
                // console.log(d);
                return (
                  <div
                    className="hover:bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                    onClick={() => {
                      setName(d.name);
                      setVisible(false);
                      setFoundCustomer(d);
                    }}
                    key={d._id}
                  >
                    {d.name}:{"    "}
                    {d.outstanding}
                  </div>
                );
              })}
          </div>
        </span>
      </div>
      <div className=" relative min-w-full flex items-center justify-center text-xl">
        Product:
        <span className="relative">
          <input
            className="border-b-2 border-green-600 mx-2  focus:bg-none px-4 text-xl font-bold capitalize py-1 focus:border-b-2 focus:border-green-600 outline-none min-w-[450px]"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setProductVisible(true);
            }}
          />
          <div className=" min-w-[300px] absolute top-10 bg-gray-400 z-20 rounded-xl ">
            {productvisible &&
              productName != "" &&
              findProduct(products, productName).map((d) => {
                // console.log(d);
                return (
                  <div
                    className="hover:bg-green-500 px-6 hover:cursor-pointer font-bold capitalize py-1 hover:text-white"
                    onClick={() => {
                      setProductName("");
                      const a = purchased.filter((p) => {
                        if (p.name == d.name) {
                          return p;
                        }
                      });
                      if (!a.length > 0) {
                        setPurchased([
                          ...purchased,
                          new Product(
                            d._id,
                            d.packet,
                            d.box,
                            d.wholesalePrice,
                            d.retailPrice,
                            d.barcode,
                            d.name,
                            billType === "wholesale"
                              ? d.wholesalePrice
                              : d.retailPrice,
                            d.mrp,
                            billType,
                            1,
                            0,
                            0,
                            0,
                            (billType === "wholesale"
                              ? d.wholesalePrice
                              : d.retailPrice) * 1
                          ),
                        ]);
                      }

                      setProductVisible(false);
                    }}
                    key={d._id}
                  >
                    {d.name}:{"    "}
                    {d.mrp}₹
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
  purchased: PropTypes.array.isRequired, // Change this line to PropTypes.array
  setPurchased: PropTypes.func.isRequired,
};

export default BillingHeader;
