"use client";

import { useEffect, useRef, useState } from "react";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Navigation } from "./Navigation";

interface MobileNavProps {
  locale: EnabledLocale;
  className?: string;
}

// Toggle button + dropdown panel. Reuses Navigation for the link list —
// no duplicated nav markup between desktop and mobile.
//
// The panel is positioned `absolute inset-x-0 top-full` with no
// `relative` on this component's own wrapper, so it anchors to the
// nearest positioned ancestor: Header's `sticky` element (sticky
// establishes a positioning context the same way `relative` does).
// That makes the panel span the full header width regardless of this
// toggle button's own size/position.
export function MobileNav({ locale, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open]);

  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    } else if (hasOpenedRef.current) {
      // Only refocuses the toggle on an actual close — guarded so this
      // doesn't steal focus to the button on the page's initial mount,
      // when `open` starts `false` and nothing has happened yet.
      toggleRef.current?.focus();
    }
  }, [open]);

  return (
    <div className={className}>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-6 w-6"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-[var(--z-dropdown)] border-b border-border bg-background"
        >
          <Navigation
            locale={locale}
            onNavigate={() => setOpen(false)}
            className="flex-col items-start gap-1 px-[var(--spacing-gutter)] py-[var(--spacing-gutter)]"
          />
        </div>
      )}
    </div>
  );
}
