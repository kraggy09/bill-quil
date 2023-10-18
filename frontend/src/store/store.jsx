import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./customerSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
  },
});

export default store;
