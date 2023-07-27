import { combineReducers } from "@reduxjs/toolkit";
import customersInfoReducer from "./customersInfo";
const rootReducer = combineReducers({
  customers: customersInfoReducer,
});

export default rootReducer;
