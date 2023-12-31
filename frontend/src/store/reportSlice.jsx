import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../constant";
axios.defaults.withCredentials = true;

const initialState = {
  report: null,
  loading: false,
  error: null,
};

export const fetchDailyReport = createAsyncThunk(
  "report/fetchDailyReport",
  async () => {
    const res = await axios.get(apiUrl + "/dailyReport");
    console.log(res.data.dailyReport[0]);

    return res.data.dailyReport[0];
  }
);

const reportSlice = createSlice({
  name: "dailyreport",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.report = action.payload;
      })
      .addCase(fetchDailyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;
