import React from "react";
import cn from "./cn";

function Spinner({ size = 16, className = "" }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Centred block spinner for whole panels. */
function BlockLoader({ label = "Loading...", className = "" }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-14 text-muted",
        className
      )}
    >
      <Spinner size={26} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export { Spinner, BlockLoader };
export default Spinner;
