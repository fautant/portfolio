"use client";

import { useCallback, useEffect, useState } from "react";
import type { LexiqueState } from "@/data/outils/lexique-types";
import { STORAGE_KEY, defaultTips, sanitize, sanitizeTips } from "@/lib/outils/lexique";
import { LexiqueApp } from "./LexiqueApp";

/** Lexique « libre » (sans projet) : l'état reste dans le navigateur, comme l'ancienne page */
export function LexiqueFree() {
  const [init, setInit] = useState<{ state: LexiqueState; tips: Record<string, boolean> } | null>(null);

  useEffect(() => {
    let state = sanitize(null);
    let tips = defaultTips();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) state = sanitize(JSON.parse(saved));
      const t = localStorage.getItem(STORAGE_KEY + "-tips");
      if (t) tips = sanitizeTips(JSON.parse(t));
    } catch {
      /* état illisible : on repart de zéro */
    }
    setInit({ state, tips });
  }, []);

  const onChange = useCallback((state: LexiqueState, tips: Record<string, boolean>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(STORAGE_KEY + "-tips", JSON.stringify(tips));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  if (!init) return <div className="lex" aria-busy="true" />;
  return (
    <LexiqueApp
      initialState={init.state}
      initialTips={init.tips}
      onChange={onChange}
      stepKey={STORAGE_KEY + "-step"}
      brandSub="Mode libre : enregistré dans ce navigateur"
      links={[{ href: "/outils", label: "← Mes outils" }]}
    />
  );
}
