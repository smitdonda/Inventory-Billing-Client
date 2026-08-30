import React, { useEffect, useId, useRef, useState } from "react";
import cn from "./cn";
import { ChevronDownIcon, XIcon } from "./Icons";

/**
 * Checkbox dropdown that returns the selected option objects.
 * `getKey` decides identity so callers can pass their own option shape.
 */
function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  getKey = (opt) => opt.title,
  getLabel = (opt) => opt.title,
  limit,
  placeholder = "Select...",
  error,
  touched,
  className = "",
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const showError = Boolean(touched && error);
  const selectedKeys = value.map(getKey);

  useEffect(() => {
    if (!open) return undefined;
    const onDocDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onEsc = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const toggle = (opt) => {
    const key = getKey(opt);
    const exists = selectedKeys.includes(key);
    if (exists) {
      onChange?.(value.filter((item) => getKey(item) !== key));
      return;
    }
    if (limit && value.length >= limit) return;
    onChange?.([...value, opt]);
  };

  const remove = (opt) =>
    onChange?.(value.filter((item) => getKey(item) !== getKey(opt)));

  const atLimit = Boolean(limit && value.length >= limit);

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={wrapRef}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-muted">
          {label}
          {limit && (
            <span className="ml-1.5 font-normal text-faint">(max {limit})</span>
          )}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex min-h-[2.75rem] w-full items-center justify-between gap-2 rounded-xl border bg-surface px-2.5 py-1.5 text-sm",
            "transition-[border-color,box-shadow] duration-150 focus-ring hover:border-strong",
            showError ? "border-danger" : "border-line",
            open && "border-fg ring-2 ring-fg/15"
          )}
        >
          {value.length ? (
            <span className="flex flex-wrap items-center gap-1.5">
              {value.map((opt) => (
                <span
                  key={getKey(opt)}
                  className="inline-flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-[12px] font-medium text-fg"
                >
                  {getLabel(opt)}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${getLabel(opt)}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(opt);
                    }}
                    className="cursor-pointer text-faint transition-colors hover:text-danger"
                  >
                    <XIcon size={12} />
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className="pl-1 text-faint">{placeholder}</span>
          )}
          <ChevronDownIcon
            size={16}
            className={cn(
              "shrink-0 text-faint transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div className="absolute z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-pop animate-scale-in">
            <ul role="listbox" className="max-h-56 overflow-y-auto p-1.5">
              {options.map((opt) => {
                const key = getKey(opt);
                const checked = selectedKeys.includes(key);
                const blocked = !checked && atLimit;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      disabled={blocked}
                      onClick={() => toggle(opt)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                        blocked
                          ? "cursor-not-allowed text-faint"
                          : checked
                            ? "bg-elevated font-medium text-fg"
                            : "text-muted hover:bg-elevated hover:text-fg"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          checked
                            ? "border-fg bg-fg text-bg"
                            : "border-strong bg-transparent"
                        )}
                      >
                        {checked && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </span>
                      {getLabel(opt)}
                    </button>
                  </li>
                );
              })}
            </ul>
            {atLimit && (
              <p className="border-t border-line px-3 py-2 text-[12px] text-faint">
                Limit of {limit} reached — remove one to pick another.
              </p>
            )}
          </div>
        )}
      </div>

      {showError && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export default MultiSelect;
