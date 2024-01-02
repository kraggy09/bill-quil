import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "../constant";
import axios from "axios";

const initialState = {
  id: null,
  loading: false,
  error: null,
};

export const fetchLastBillId = createAsyncThunk(
  "id/fetchLastBillId",
  async () => {
    const response = await axios.get(apiUrl + "/getLatestBillId");
    console.log(response.data);

    return response.data.billId;
  }
);

const billIdSlice = createSlice({
  name: "billId",
  initialState,
  reducers: {
    // Action to set the loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Action to set the bill ID
    setBillId: (state, action) => {
      state.id = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Action to set an error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastBillId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastBillId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.id = action.payload;
      })
      .addCase(fetchLastBillId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action creators
export const { setLoading, setBillId, setError } = billIdSlice.actions;

// Export the reducer
export default billIdSlice.reducer;
