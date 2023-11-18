import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./customerSlice";
import productSlice from "./productSlice";
import reportSlice from "./reportSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    product: productSlice,
    report: reportSlice,
    user: userSlice,
  },
});

export default store;
