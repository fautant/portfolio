"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/** Enregistre `value` après `delay` ms sans changement ; vide la file au démontage et à la fermeture de l'onglet */
export function useAutosave<T>(save: (value: T) => Promise<{ ok: boolean; error?: string }>, delay = 800) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const saveRef = useRef(save);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<{ value: T } | null>(null);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const pending = latest.current;
    if (!pending) return;
    latest.current = null;
    try {
      const r = await saveRef.current(pending.value);
      setStatus(r.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      latest.current = { value };
      setStatus("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [delay, flush],
  );

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      void flush();
    };
  }, [flush]);

  return { schedule, flush, status };
}
