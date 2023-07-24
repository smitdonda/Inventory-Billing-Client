import { createSlice } from "@reduxjs/toolkit";
// import {authServices} from "../services"
const initialState = {
  userInfo: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.userInfo = action.payload;
      // state.loading = true;
      // authServices.login(action.payload).then((res) => {
      //   console.log("res reducer", res)
      //   state.loading = false;
      //   state.userInfo = res.user;
      //   localStorage.setItem("token",res.token);
      // })
      // .catch((error) => {
      //   console.log("loginAction error", error);
      //   state.loading = false;
      //   toast.error(error.response.data.errors.msg);
      // })
    },
    signupAction: (state, action) => {
      state.userInfo = action.payload;
    },
    logoutAction: (state, action) => {
      state.userInfo = action.payload;
    },
    // forgotPasswordAction: (state, action) => {
    //   state.userInfo = action.payload;
    // },
    // extraReducers: {
    //   [loginAction.pending]: (state, { meta }) => {
    //     state.loading = true;
    //     console.log("------pending-------")
    //   },
    //   [loginAction.fulfilled]: (state, { meta, payload }) => {
    //     state.loading = false
    //     console.log("------success-------")
    //   },
    //   [loginAction.rejected]: (state, { meta, payload, error }) => {
    //     state.loading = false
    //     toast.error(payload.errors.msg);
    //     console.log("------rejected-------")
    //   },
  },
});

export const { loginAction, signupAction, logoutAction, forgotPasswordAction } =
  auth.actions;

export default auth.reducer;
