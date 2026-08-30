import React, { useCallback, useEffect, useRef } from "react";
import cn from "./cn";
import { XIcon } from "./Icons";
import { IconButton } from "./Button";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Centred dialog on >=sm, bottom sheet on phones.
 * Closes on Escape and on backdrop click; keeps focus inside while open.
 */
function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  className = "",
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  // Lock the page behind the dialog and restore focus on close.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector(
        "[data-autofocus], input, select, textarea, button"
      );
      target?.focus?.();
    }, 30);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative z-10 w-full bg-surface border border-line shadow-pop animate-scale-in",
          "rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col",
          "mx-0 sm:mx-4",
          SIZES[size] || SIZES.md,
          className
        )}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-base font-semibold tracking-tight text-fg truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-[13px] text-muted">{description}</p>
              )}
            </div>
            {onClose && (
              <IconButton icon={XIcon} label="Close" onClick={onClose} />
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
