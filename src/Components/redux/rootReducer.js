import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";
import menuToggleReducer from "./menuToggle";
import customersInfoReducer from "./customersInfo";
const rootReducer = combineReducers({
  auth: authReducer,
  customers: customersInfoReducer,
  menuToggle: menuToggleReducer,
});

export default rootReducer;
