import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorBoundary from "./Components/ui/ErrorBoundary";
import Main from "./Components/pages";

function App() {
  return (
    // Outside the router, so a crash in routing itself is still caught.
    <ErrorBoundary>
      {/* Opt into the v7 behaviours now — they are what this app already
          assumes, and it keeps the console free of upgrade warnings. */}
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Main />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          icon
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
