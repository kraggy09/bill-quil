import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "../constant";
import apiCaller from "../libs/apiCaller";

const initialState = {
  id: null,
  loading: false,
  error: null,
};

export const fetchLastTransactionId = createAsyncThunk(
  "id/fetchLastTransactionId",
  async () => {
    const response = await apiCaller.get(apiUrl + "/getLatestTransactionId");
    console.log(response.data);

    return response.data.transactionId;
  }
);

const transactionId = createSlice({
  name: "transactionId",
  initialState,
  reducers: {
    // Action to set the loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Action to set the bill ID
    setTransactionId: (state, action) => {
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
      .addCase(fetchLastTransactionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastTransactionId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.id = action.payload;
      })
      .addCase(fetchLastTransactionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action creators
export const { setLoading, setTransactionId, setError } = transactionId.actions;

// Export the reducer
export default transactionId.reducer;
