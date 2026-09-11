import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import ErrorBoundary from "./Components/ui/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import Main from "./Components/pages";

// The palette is light-only, so the toasts are pinned to it rather than
// following the system preference into a theme the app does not have.
const TOAST_DURATION = 3500;

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
        <Toaster
          position="top-right"
          theme="light"
          duration={TOAST_DURATION}
          closeButton
          expand
          toastOptions={{
            // Handed to the CSS so the timer bar empties on the same clock
            // sonner dismisses by.
            style: { "--toast-duration": `${TOAST_DURATION}ms` },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
