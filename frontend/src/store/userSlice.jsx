import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  username: null,
  isAdmin: false,
  id: "",
  pin: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.isAdmin = action.payload.isAdmin;
      state.pin = action.payload.pin;
      state.id = action.payload.id;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
