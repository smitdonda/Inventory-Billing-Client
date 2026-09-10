import React from "react";
import cn from "./cn";

/*
 * Every loading indicator in the app.
 *
 * One spinner covered the buttons, but a button, a whole panel, a table and
 * the boot gate are four different waits, and a 16px spinner is only right
 * for the first. The rest are here so a screen can say "this is coming" in
 * the shape of the thing that is coming.
 *
 *   Crate         the app's mark; the default inline and in panels
 *   Spinner       the plain ring, kept for anywhere the crate is too much
 *   Dots / Bars   inline, for a wait with no fixed length
 *   ProgressBar   indeterminate strip, for the top of a panel or a route
 *   BlockLoader   centred in a panel, with a label
 *   PageLoader    the whole viewport, for the first paint
 *   Skeleton*     the shape of the content, for lists and forms
 *
 * The animations are cut by the global prefers-reduced-motion rule, so each
 * one still reads as "busy" when it is standing still.
 */

/**
 * The crate. The app's own loading mark, and the default everywhere.
 *
 * An isometric carton — the thing this app counts — with its three faces
 * catching the light in turn while the box breathes. Every face is
 * currentColor at a different opacity rather than three fixed tones, so the
 * same mark is white inside a filled button and accent on a panel, and it
 * needs nothing from the palette to stay legible.
 *
 * The faces are drawn back to front. The hairline gaps between them are the
 * geometry, not strokes, so they hold their weight at 16px.
 */
function Crate({ size = 18, className = "" }) {
  return (
    <svg
      className={cn("crate", className)}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <g className="crate-body">
        <polygon
          className="crate-face crate-top"
          points="24,4.2 37.4,11.9 24,19.6 10.6,11.9"
        />
        <polygon
          className="crate-face crate-right"
          points="38.2,13.1 38.2,28.4 24.8,36.1 24.8,20.8"
        />
        <polygon
          className="crate-face crate-left"
          points="9.8,13.1 23.2,20.8 23.2,36.1 9.8,28.4"
        />
      </g>
    </svg>
  );
}

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

/** Three dots in currentColor. Quieter than the spinner at small sizes. */
function Dots({ size = 5, className = "" }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block rounded-full bg-current"
          style={{
            width: size,
            height: size,
            animation: "loader-dot 1.05s ease-in-out infinite",
            animationDelay: `${i * 0.14}s`,
          }}
        />
      ))}
    </span>
  );
}

/** Four bars rising and falling. Reads as "working", not "stuck". */
function Bars({ size = 16, className = "" }) {
  return (
    <span
      className={cn("inline-flex items-end gap-[3px]", className)}
      style={{ height: size }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current"
          style={{
            height: "100%",
            transformOrigin: "bottom",
            animation: "loader-bar 1s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

/** A dot with a ring pulsing out of it. For "live" or "still connected". */
function PulseDot({ size = 8, className = "" }) {
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />
      <span className="relative inline-flex h-full w-full rounded-full bg-current" />
    </span>
  );
}

/**
 * Indeterminate strip. Sits at the top of a card or panel that already has
 * content on screen — a table reloading its next page, say — where swapping
 * the content for a spinner would throw the reader's place away.
 */
function ProgressBar({ className = "" }) {
  return (
    <span
      className={cn(
        "block h-[3px] w-full overflow-hidden rounded-full bg-line/70",
        className
      )}
      role="progressbar"
      aria-busy="true"
    >
      <span
        className="block h-full w-1/3 rounded-full bg-accent"
        style={{ animation: "loader-slide 1.25s ease-in-out infinite" }}
      />
    </span>
  );
}

const VARIANTS = {
  crate: (size) => <Crate size={size} />,
  spinner: (size) => <Spinner size={size} />,
  dots: (size) => <Dots size={Math.round(size / 4)} />,
  bars: (size) => <Bars size={size} />,
};

/** Centred block loader for whole panels. */
function BlockLoader({
  label = "Loading...",
  variant = "crate",
  size = 30,
  className = "",
}) {
  const render = VARIANTS[variant] || VARIANTS.crate;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-14 text-muted",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {render(size)}
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

/**
 * The first paint, before the app knows who is signed in. Holds the whole
 * viewport so the label does not sit against the top edge of a blank page.
 *
 * It builds its own stack rather than calling BlockLoader, because the mark
 * carries this screen alone: at accent on an empty page it has to be the
 * thing you look at, while the label underneath stays muted.
 */
function PageLoader({ label = "Loading...", variant = "crate", size = 56 }) {
  const render = VARIANTS[variant] || VARIANTS.crate;
  return (
    <div
      className="grid min-h-screen place-items-center bg-bg"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-accent">
        {render(size)}
        {label && <span className="text-sm text-muted">{label}</span>}
      </div>
    </div>
  );
}

/** A paragraph's worth of skeleton lines. The last one runs short. */
function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("skeleton h-3.5", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Stand-in for a form or a detail panel while its data is in flight. */
function SkeletonCard({ rows = 3, className = "" }) {
  return (
    <div className={cn("card space-y-4 p-6", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-11 w-full" />
      ))}
    </div>
  );
}

/**
 * Rows of a table that has not arrived. Keeps the page at the height it will
 * settle at, so the layout does not jump when the rows land.
 */
function SkeletonTable({ rows = 5, cols = 4, className = "" }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={cn("skeleton h-4", c === 0 ? "w-1/3" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  Crate,
  Spinner,
  Dots,
  Bars,
  PulseDot,
  ProgressBar,
  BlockLoader,
  PageLoader,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
};
export default Spinner;
