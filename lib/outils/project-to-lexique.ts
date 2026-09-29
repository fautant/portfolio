import type { Brief, SiteType } from "@/lib/validations/design-project";
import type { LexiqueState } from "@/data/outils/lexique-types";
import { emptyState, filled, select, setNote } from "./lexique";
import { PARAMS } from "@/data/outils/lexique";

/** Correspondance type de site → exemples des étapes « Type & contexte » et « Objectif & public » */
const TYPE_MAP: Record<SiteType, string | undefined> = {
  "portfolio-dev": "dev",
  "portfolio-ux": "ux",
  freelance: "freelance",
  landing: "landing",
  ecommerce: undefined,
  blog: "blog",
  dashboard: "dashboard",
  mobile: "dashboard",
};
const GOAL_MAP: Record<SiteType, string | undefined> = {
  "portfolio-dev": "recruiter",
  "portfolio-ux": "agency",
  freelance: "client",
  landing: "cta",
  ecommerce: "trust",
  blog: undefined,
  dashboard: undefined,
  mobile: undefined,
};

/** Pré-remplit les étapes `type` et `goal` d'un Lexique vide à partir du projet */
export function suggestLexique(siteType: SiteType, brief: Brief): LexiqueState {
  let s = emptyState();
  const type = TYPE_MAP[siteType];
  const goal = GOAL_MAP[siteType];
  if (type) s = select(s, "type", type).state;
  if (goal) s = select(s, "goal", goal).state;
  if (brief.pitch.trim()) s = setNote(s, "type", brief.pitch.trim());
  if (brief.mainAction.trim()) s = setNote(s, "goal", brief.mainAction.trim());
  return s;
}

export const isLexiqueEmpty = (s: LexiqueState): boolean => PARAMS.every((p) => !filled(s, p.id));
