import React from "react";
import ReactDOM from "react-dom/client";

// react-toastify ships rules with the same specificity as the overrides in
// index.css, so it has to be loaded first for those overrides to win the tie.
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
