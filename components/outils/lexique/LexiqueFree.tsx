"use client";

import { useCallback, useEffect, useState } from "react";
import type { LexiqueV2State } from "@/data/outils/lexique-types";
import { STORAGE_KEY, sanitize } from "@/lib/outils/lexique";
import { LexiqueApp } from "./LexiqueApp";

/** Lexique v2 : l'état (versionné `v: 2`) reste dans le navigateur */
export function LexiqueFree() {
  const [init, setInit] = useState<LexiqueV2State | null>(null);

  useEffect(() => {
    let state = sanitize(null);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) state = sanitize(JSON.parse(saved));
    } catch {
      /* état illisible : on repart de zéro */
    }
    setInit(state);
  }, []);

  const onChange = useCallback((state: LexiqueV2State) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  if (!init) return <div className="lex" aria-busy="true" />;
  return <LexiqueApp initialState={init} onChange={onChange} links={[{ href: "/outils", label: "← Mes outils" }]} />;
}
