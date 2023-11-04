import { useState } from "react";
import { useSelector } from "react-redux";
import { sortArray } from "../libs/constant";
import NewCustomer from "../components/NewCustomer";

// Define a generic sorting function

// Define the sorting function for sorting by name
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
  const customers = useSelector((store) => store.customer.customers);
  const [sortingType, setSortingType] = useState(null);
  let sortedCustomers = [...customers];
  if (sortingType === "name") {
    sortedCustomers = sortArray(sortedCustomers, sortCustomersByName);
  } else if (sortingType === "transaction") {
    sortedCustomers = sortArray(sortedCustomers, sortCustomerByTransaction);
  }

  console.log(customers);

  return (
    <div>
      <div>
        {" "}
        <button
          onClick={() => {
            setSortingType("name");
          }}
        >
          Sort by Name
        </button>
        <button
          onClick={() => {
            setSortingType("transaction");
          }}
        >
          Sort by Number of Transaction
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Bills</th>
            <th>Transactions</th>
            <th>Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map((customer) => {
            return (
              <tr key={customer._id}>
                <td className="text-center capitalize">{customer.name}</td>
                <td className="text-center">{customer.bills.length}</td>
                <td className="text-center">{customer.transactions.length}</td>
                <td className="text-center">{customer.outstanding}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerPage;
