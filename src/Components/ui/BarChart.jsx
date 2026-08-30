import React, { useMemo, useState } from "react";
import cn from "./cn";
import { InboxIcon } from "./Icons";

/** Round a max up to a clean axis top so ticks land on readable numbers. */
const niceMax = (value) => {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
};

const compact = (value) =>
  Math.abs(value) >= 1000
    ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`
    : String(value);

/**
 * Horizontal bar chart for "compare magnitude across items".
 * One series, so length carries the value and a single ink colour carries the
 * mark — no legend, no per-hue palette. Long tails fold into "Other".
 */
function BarChart({
  data = [],
  maxItems = 8,
  valueLabel = "value",
  emptyText = "No data to plot yet.",
  className = "",
}) {
  const [hover, setHover] = useState(null);

  const rows = useMemo(() => {
    const clean = data
      .filter((d) => Number.isFinite(Number(d.value)))
      .map((d) => ({ label: String(d.label ?? "—"), value: Number(d.value) }))
      .sort((a, b) => b.value - a.value);

    if (clean.length <= maxItems) return clean;
    const head = clean.slice(0, maxItems - 1);
    const tail = clean.slice(maxItems - 1);
    return [
      ...head,
      {
        label: `Other (${tail.length})`,
        value: tail.reduce((sum, item) => sum + item.value, 0),
        isOther: true,
      },
    ];
  }, [data, maxItems]);

  const axisMax = niceMax(Math.max(...rows.map((r) => r.value), 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(axisMax * t));

  if (!rows.length) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 py-14 text-center text-muted",
          className
        )}
      >
        <InboxIcon size={22} className="text-faint" />
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-1">
        {rows.map((row, index) => {
          const pct = axisMax ? (row.value / axisMax) * 100 : 0;
          const active = hover === index;
          return (
            <div
              key={`${row.label}-${index}`}
              className="group grid grid-cols-[minmax(4rem,6rem)_1fr] items-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-elevated/60 sm:grid-cols-[minmax(7rem,11rem)_1fr]"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(null)}
              tabIndex={0}
            >
              <span
                className="truncate text-[13px] text-muted"
                title={row.label}
              >
                {row.label}
              </span>

              <div className="flex items-center gap-2.5">
                <div className="relative h-[18px] flex-1">
                  {/* recessive gridlines, hairline, solid */}
                  <div className="absolute inset-0 flex justify-between">
                    {ticks.map((_, t) => (
                      <span
                        key={t}
                        className={cn("w-px bg-line", t === 0 && "bg-strong")}
                      />
                    ))}
                  </div>
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full rounded-r transition-[width,opacity] duration-500 ease-out",
                      row.isOther ? "bg-faint" : "bg-fg",
                      active ? "opacity-100" : "opacity-90"
                    )}
                    style={{
                      width: `${Math.max(pct, row.value > 0 ? 1.5 : 0)}%`,
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-[12.5px] tabular-nums text-fg">
                  {compact(row.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* axis */}
      <div className="mt-2 grid grid-cols-[minmax(4rem,6rem)_1fr] gap-3 px-1 sm:grid-cols-[minmax(7rem,11rem)_1fr]">
        <span />
        <div className="flex items-center gap-2.5">
          <div className="flex flex-1 justify-between border-t border-line pt-1.5">
            {ticks.map((tick, t) => (
              <span
                key={t}
                className="font-mono text-[11px] tabular-nums text-faint"
              >
                {compact(tick)}
              </span>
            ))}
          </div>
          <span className="w-12 shrink-0" />
        </div>
      </div>

      <p className="mt-3 px-1 text-[12px] text-faint">
        Hover a row to highlight · values are {valueLabel}
      </p>
    </div>
  );
}

export default BarChart;
