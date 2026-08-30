import React from "react";
import { Link } from "react-router-dom";
import cn from "./cn";
import { Spinner } from "./Spinner";

const VARIANTS = {
  primary:
    "bg-accent text-accent-fg border border-transparent hover:opacity-90 active:opacity-80",
  secondary:
    "bg-surface text-fg border border-line hover:bg-elevated hover:border-strong",
  ghost:
    "bg-transparent text-muted border border-transparent hover:bg-elevated hover:text-fg",
  danger:
    "bg-transparent text-danger border border-danger/30 hover:bg-danger/10 hover:border-danger/60",
  warning:
    "bg-transparent text-warning border border-warning/40 hover:bg-warning/10 hover:border-warning/70",
  solidDanger:
    "bg-danger text-white border border-transparent hover:opacity-90 active:opacity-80",
};

const SIZES = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-11 px-5 text-[15px] gap-2 rounded-xl",
  icon: "h-9 w-9 justify-center rounded-lg",
  iconSm: "h-8 w-8 justify-center rounded-lg",
};

const base =
  "inline-flex items-center justify-center font-medium select-none whitespace-nowrap " +
  "transition-[background-color,border-color,color,opacity,transform] duration-150 " +
  "focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985]";

function Button({
  as,
  to,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  icon: Icon,
  iconRight: IconRight,
  className = "",
  children,
  disabled,
  ...rest
}) {
  const classes = cn(
    base,
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className
  );

  const content = (
    <>
      {loading ? (
        <Spinner />
      ) : (
        Icon && <Icon size={size === "sm" || size === "iconSm" ? 15 : 17} />
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && IconRight && <IconRight size={16} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const Tag = as || "button";
  return (
    <Tag
      className={classes}
      disabled={Tag === "button" ? disabled || loading : undefined}
      {...rest}
    >
      {content}
    </Tag>
  );
}

/** Square, borderless action button used inside table rows. */
function IconButton({
  icon: Icon,
  label,
  tone = "default",
  className = "",
  ...rest
}) {
  const tones = {
    default: "text-muted hover:text-fg hover:bg-elevated",
    danger: "text-muted hover:text-danger hover:bg-danger/10",
    accent: "text-muted hover:text-fg hover:bg-elevated",
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent",
        "transition-colors duration-150 focus-ring active:scale-95",
        tones[tone] || tones.default,
        className
      )}
      {...rest}
    >
      <Icon size={16} />
    </button>
  );
}

export { Button, IconButton };
export default Button;
