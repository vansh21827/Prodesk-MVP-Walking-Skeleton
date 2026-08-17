import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.status = "authenticated";
      state.error = null;
    },

    setAuthLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },

    setAuthError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;