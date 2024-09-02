import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { axiosClient } from "../utils/axiosClient";

const initialState = {
  user: null,
  pending: false,
};

export const checkUser = createAsyncThunk("user/checkUser", async () => {
  console.log(user);
  const user = await axiosClient.post("/auth/get-user", {
    access_token: window.localStorage.getItem("access_token"),
  });

  return user.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      console.log(payload.refresh_token);
      console.log(payload.access_token);

      window.localStorage.setItem("acces_token", payload.access_token);
      window.localStorage.setItem("refresh_token", payload.refresh_token);
      state.user = payload; // User ma'lumotlarini saqlash
    },
    logout: (state) => {
      state.user = null;
      window.localStorage.removeItem("acces_token");
      window.localStorage.removeItem("refresh_token");
    },
    register: (state, { payload }) => {
      state.user = payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(checkUser.pending, (state) => {
      state.pending = true;
    });

    builder.addCase(checkUser.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.pending = false;
    });

    builder.addCase(checkUser.rejected, (state, { payload }) => {
      console.log(payload);
      state.pending = false;
    });
  },
});

export const { login, logout, register } = userSlice.actions;

export default userSlice.reducer;
