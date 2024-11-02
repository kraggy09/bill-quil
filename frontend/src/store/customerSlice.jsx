// customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { apiUrl } from "../constant";
import apiCaller from "../libs/apiCaller";

const initialState = {
  customers: [],
  loading: false,
  error: null,
};

console.log(initialState.customer);
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    const response = await apiCaller.get(apiUrl + "/getAllCustomers");

    return response.data.customers;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    updateOutstanding: (state, { payload }) => {
      const { customerId, newOutstanding } = payload;
      const customerToUpdate = state.customers.find(
        (customer) => customer.id === customerId
      );
      if (customerToUpdate) {
        customerToUpdate.outstanding = newOutstanding;
      }
    },

    findCustomer: (state, { payload }) => {
      return state.customers.filter((customer) =>
        customer.name.includes(payload.findName)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateOutstanding, findCustomer } = customerSlice.actions;

export default customerSlice.reducer;
