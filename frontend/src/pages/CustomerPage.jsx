import { useState } from "react";
import { useSelector } from "react-redux";
import { sortArray } from "../libs/constant";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

// Define a generic sorting function

// Define the sorting function for sorting by name
function sortCustomerByOutStanding(a, b) {
  return b.outstanding - a.outstanding;
}

function sortCustomersByName(a, b) {
  const nameA = a.name;
  const nameB = b.name;

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

// Define the sorting function for sorting by the number of bills
function sortCustomerByTransaction(a, b) {
  const aLength = a.transactions.length;
  const bLength = b.transactions.length;
  return aLength < bLength ? 1 : aLength > bLength ? -1 : 0;
}

const CustomerPage = () => {
  const navigate = useNavigate();
  const customers = useSelector((store) => store.customer.customers);
  const [sortingType, setSortingType] = useState(null);
  let sortedCustomers = [...customers];
  if (sortingType === "name") {
    sortedCustomers = sortArray(sortedCustomers, sortCustomersByName);
  } else if (sortingType === "transaction") {
    sortedCustomers = sortArray(sortedCustomers, sortCustomerByTransaction);
  } else if (sortingType === "outstanding") {
    sortedCustomers = sortArray(sortedCustomers, sortCustomerByOutStanding);
  }

  console.log(customers);

  return (
    <div className="min-w-[90vw]  ml-24 flex flex-col mb-36  justify-center">
      <div>
        {" "}
        <button
          className="bg-green-500 px-2 py-1  font-bold text-white rounded-lg mx-6 my-6"
          onClick={() => {
            setSortingType("name");
          }}
        >
          Sort by Name
        </button>
        <button
          className="bg-green-500 px-2 py-1  font-bold text-white rounded-lg mx-6 my-6"
          onClick={() => {
            setSortingType("transaction");
          }}
        >
          Sort by Number of Transaction
        </button>
        <button
          className="bg-green-500 px-2 py-1  font-bold text-white rounded-lg mx-6 my-6"
          onClick={() => {
            setSortingType("outstanding");
          }}
        >
          Sort by Outstanding
        </button>
      </div>
      <table className="table-auto border-spacing-16  border border-black ml-6 ">
        <thead className=" ">
          <tr>
            <th className="border border-black mx-6 px-8">Name</th>
            <th className="border border-black mx-6 px-8">Bills</th>
            <th className="border border-black mx-6 px-8">Transactions</th>
            <th className="border border-black mx-6 px-8">Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map((customer) => {
            return (
              <tr key={customer._id}>
                <td
                  onClick={() => {
                    navigate(`/customers/${customer._id}`, { state: customer });
                  }}
                  className="text-center font-semibold  capitalize px-16 py-3 "
                >
                  <span className="px-2 py-1 hover:bg-green-500 transition-all ease-in duration-200 rounded-lg hover:text-white  hover:cursor-pointer">
                    {customer.name}
                  </span>
                </td>
                <td className="text-center font-semibold  px-16 py-3 ">
                  {customer.bills.length}
                </td>
                <td className="text-center font-semibold  px-16 py-3 ">
                  {customer.transactions.length}
                </td>
                <td className="text-center font-semibold  px-16 py-3 ">
                  {customer.outstanding}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to={"/newCustomer"}>
        <button className="flex text-white  rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 px-2 py-1 bg-green-500">
          <AiOutlinePlus className=" text-white font-extrabold" />
          New Customer
        </button>
      </Link>
    </div>
  );
};

export default CustomerPage;
