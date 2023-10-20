import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./customerSlice";
import productSlice from "./productSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    product: productSlice,
  },
});

export default store;
