import React from "react";
import { Link } from "react-router-dom";
import cn from "./cn";
import { ChevronRightIcon } from "./Icons";

const compact = (value, money) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const prefix = money ? "₹" : "";
  if (Math.abs(n) >= 1_000_000)
    return `${prefix}${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (Math.abs(n) >= 10_000)
    return `${prefix}${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${prefix}${n.toLocaleString("en-IN")}`;
};

/**
 * Stat tile: label, value, optional caption. Wraps in a Link when `to` is set.
 * The value uses proportional figures — these are display-size, not a column.
 */
function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  to,
  loading = false,
  format = "number",
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-bg text-muted transition-colors group-hover:border-strong group-hover:text-fg">
            <Icon size={17} />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          {loading ? (
            <div className="skeleton h-8 w-16" />
          ) : (
            <span className="text-3xl font-semibold leading-none tracking-tight text-fg">
              {compact(value, format === "money")}
            </span>
          )}
          {caption && (
            <p className="mt-1.5 text-[12.5px] text-faint">{caption}</p>
          )}
        </div>
        {to && (
          <ChevronRightIcon
            size={18}
            className="mb-0.5 text-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-fg"
          />
        )}
      </div>
    </>
  );

  const classes = cn(
    "group card p-5 transition-[border-color,box-shadow,transform] duration-150",
    to && "hover:border-strong hover:shadow-soft focus-ring"
  );

  return to ? (
    <Link to={to} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export default StatCard;
