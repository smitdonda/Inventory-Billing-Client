import React from "react";

function Spin() {
  return (
    <div>
      <span
        class="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading...</span>
    </div>
  );
}

function SpinLoader() {
  return (
    <div>
      <span
        class="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>{" "}
      Loading...
    </div>
  );
}
export { Spin, SpinLoader };
