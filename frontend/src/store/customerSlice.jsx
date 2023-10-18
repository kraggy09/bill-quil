// customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/getAllCustomers"
      ); // Adjust the URL as needed
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    updateOutstanding: (state, action) => {
      const { customerId, newOutstanding } = action.payload;
      const customerToUpdate = state.customers.find(
        (customer) => customer.id === customerId
      );
      if (customerToUpdate) {
        customerToUpdate.outstanding = newOutstanding;
      }
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

export const { updateOutstanding } = customerSlice.actions;
export default customerSlice.reducer;
