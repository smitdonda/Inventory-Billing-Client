import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuToggle: false,
};

export const menuBar = createSlice({
  name: "menuToggle",
  initialState,
  reducers: {
    setMenuToggle: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.menuToggle = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMenuToggle } = menuBar.actions;

export default menuBar.reducer;
