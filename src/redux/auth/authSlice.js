import { createSlice } from "@reduxjs/toolkit";
import { loginMessage, errorMessage } from "../toasts";
import { loginApi, signUpApi, updateUserDataApi } from "./authApis";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateCart: (state, action) => {
      if (state.user) {
        state.user.cartInfo = action.payload;
      }
    },
    clearCart: (state) => {
      if (state.user) {
        state.user.cartInfo = {
          cart: [],
          isEmpty: true,
          totalPrice: 0,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(signUpApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        loginMessage("Registration successful");
      })
      .addCase(signUpApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        errorMessage("Failed to register :(");
      })

      // Login
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        loginMessage("Login successful");
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        errorMessage("Failed to login :(");
      })

      // Update User
      .addCase(updateUserDataApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDataApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        loginMessage("User data updated successfully");
      })
      .addCase(updateUserDataApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        errorMessage("Failed to update user data");
      });
  },
});

export const { clearError, logout, updateCart, clearCart } = authSlice.actions;
export default authSlice.reducer;
