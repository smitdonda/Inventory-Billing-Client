import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customersInfo: {},
};

export const Products = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    seCustomersInfoAction: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.customersInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { seCustomersInfoAction } = Products.actions;

export default Products.reducer;
