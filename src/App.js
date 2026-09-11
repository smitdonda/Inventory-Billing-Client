import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import ErrorBoundary from "./Components/ui/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import Main from "./Components/pages";
import useMediaQuery from "./hooks/useMediaQuery";

// The palette is light-only, so the toasts are pinned to it rather than
// following the system preference into a theme the app does not have.
const TOAST_DURATION = 3500;

// sonner's own breakpoint for going full-width, reused so the stack changes
// shape at the same place the toast does.
const PHONE = "(max-width: 600px)";

function App() {
  const isPhone = useMediaQuery(PHONE);

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
          // Fanned out on a pointer device, where hovering the stack is what
          // expands it anyway. A phone has no hover to offer, but it also has
          // no room: three toasts fanned out cover the top third of the
          // screen, so there they stay stacked.
          expand={!isPhone}
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
