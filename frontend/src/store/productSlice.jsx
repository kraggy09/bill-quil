import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "../constant";
import apiCaller from "../libs/apiCaller";

const initialState = {
  products: [],
  loading: false,
  error: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await apiCaller.get(apiUrl + "/products");

    return res.data.products;
  }
);

const producSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default producSlice.reducer;
