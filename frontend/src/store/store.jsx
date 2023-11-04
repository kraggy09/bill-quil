import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./customerSlice";
import productSlice from "./productSlice";
import reportSlice from "./reportSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    product: productSlice,
    report: reportSlice,
  },
});

export default store;
