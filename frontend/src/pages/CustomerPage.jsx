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
    <div>
      <div>
        {" "}
        <button
          className="bg-green-500 p-5 text-xl font-bold text-white rounded-2xl mx-6 my-6"
          onClick={() => {
            setSortingType("name");
          }}
        >
          Sort by Name
        </button>
        <button
          className="bg-green-500 p-5 text-xl font-bold text-white rounded-2xl mx-6 my-6"
          onClick={() => {
            setSortingType("transaction");
          }}
        >
          Sort by Number of Transaction
        </button>
        <button
          className="bg-green-500 p-5 text-xl font-bold text-white rounded-2xl mx-6 my-6"
          onClick={() => {
            setSortingType("outstanding");
          }}
        >
          Sort by Outstanding
        </button>
      </div>
      <table className="table-auto border-spacing-16 text-2xl border border-black ml-6 ">
        <thead className="text-2xl ">
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
                  className="text-center font-semibold text-xl capitalize px-16 py-3 "
                >
                  {customer.name}
                </td>
                <td className="text-center font-semibold text-xl px-16 py-3 ">
                  {customer.bills.length}
                </td>
                <td className="text-center font-semibold text-xl px-16 py-3 ">
                  {customer.transactions.length}
                </td>
                <td className="text-center font-semibold text-xl px-16 py-3 ">
                  {customer.outstanding}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to={"/newCustomer"}>
        <button className="flex text-white text-2xl rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
          <AiOutlinePlus className="text-2xl text-white font-extrabold" />
          New Customer
        </button>
      </Link>
    </div>
  );
};

export default CustomerPage;
