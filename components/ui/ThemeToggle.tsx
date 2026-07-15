"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  className?: string;
}

// No dependency (no next-themes) — small enough to own directly, same
// approach as MobileNav/StoryCategoryNav elsewhere in this codebase.
//
// Initial state assumes "dark" (matching the no-JS/no-attribute default
// in styles/tokens.css) so the server-rendered and first-client-rendered
// icon always match — no hydration mismatch. The real theme (which may
// differ, e.g. a returning visitor who chose light) is read from the DOM
// in an effect and corrected post-mount; the inline script in
// app/layout.tsx already applied it to <html> before paint, this just
// syncs the icon.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Syncing React state with a DOM attribute the blocking inline script
    // in app/layout.tsx already set before hydration. Reading it in a
    // lazy useState initializer instead would cause a real hydration
    // mismatch: the server always renders "dark" (see comment above), so
    // the client's first hydration pass must too, and only correct
    // itself here, after mount.
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private browsing, disabled) — theme still
      // applies for this session via the DOM attribute above.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      className={cn("flex h-10 w-10 items-center justify-center text-foreground", className)}
    >
      {theme === "light" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path
            d="M12 2.5v2M12 19.5v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2.5 12h2M19.5 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
