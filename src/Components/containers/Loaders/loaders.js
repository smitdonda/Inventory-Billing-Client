import React from "react";

function Spin() {
  return (
    <div>
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
    </div>
  );
}

function SpinLoader() {
  return (
    <div>
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>{" "}
      Loading...
    </div>
  );
}
export { Spin, SpinLoader };
