import React from "react";
import { AlertTriangleIcon } from "./Icons";

/**
 * Catches render-time crashes so one broken screen does not leave the user
 * staring at a blank page. Deliberately a class — React has no hook for this.
 *
 * The recovery buttons use full page loads rather than router navigation: the
 * boundary sits outside the router, and a hard reload is the one thing certain
 * to clear whatever state caused the crash.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangleIcon size={22} />
          </span>

          <h1 className="mt-4 text-lg font-semibold tracking-tight text-fg">
            Something broke
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            This screen hit an error and stopped. Your data is untouched.
          </p>

          {/* The message helps when someone reports the problem; the stack
              stays in the console rather than on screen. */}
          <p className="mt-4 break-words rounded-lg border border-line bg-elevated px-3 py-2 text-left font-mono text-[12px] text-muted">
            {error.message || String(error)}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 focus-ring"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors hover:border-strong focus-ring"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
