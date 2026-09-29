"use client";

import { useEffect, useState, type CSSProperties } from "react";

const THEME_KEY = "outils-theme";

export function ThemeButton({ className = "o-btn sm", style }: { className?: string; style?: CSSProperties }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") apply(saved);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  function apply(t: "light" | "dark") {
    document.querySelector<HTMLElement>(".outils-root")?.setAttribute("data-theme", t);
    setTheme(t);
  }

  function toggle() {
    const root = document.querySelector<HTMLElement>(".outils-root");
    const current = root?.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignoré */
    }
  }

  return (
    <button className={className} style={style} type="button" onClick={toggle} aria-pressed={theme === "dark"}>
      ◐ Thème
    </button>
  );
}
