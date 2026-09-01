import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorBoundary from "./Components/ui/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import Main from "./Components/pages";

function App() {
  return (
    // Outside the router, so a crash in routing itself is still caught.
    <ErrorBoundary>
      {/* On react-router 7 the old v6 future flags are the defaults, so the
          opt-in prop they needed is gone. */}
      <BrowserRouter>
        <AuthProvider>
          <Main />
        </AuthProvider>
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
