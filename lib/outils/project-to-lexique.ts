import type { Brief, SupportType } from "@/lib/validations/design-project";
import type { LexiqueState } from "@/data/outils/lexique-types";
import { SUPPORTS } from "@/data/outils/supports";
import { emptyState, filled, select, setNote } from "./lexique";
import { PARAMS } from "@/data/outils/lexique";

/** Pré-remplit les étapes `type` et `goal` d'un Lexique vide à partir du projet (correspondance définie dans `SUPPORTS`) */
export function suggestLexique(type: SupportType, brief: Brief): LexiqueState {
  let s = emptyState();
  const { type: lexType, goal } = SUPPORTS[type].lexique;
  if (lexType) s = select(s, "type", lexType).state;
  if (goal) s = select(s, "goal", goal).state;
  if (brief.pitch.trim()) s = setNote(s, "type", brief.pitch.trim());
  if (brief.mainAction.trim()) s = setNote(s, "goal", brief.mainAction.trim());
  return s;
}

export const isLexiqueEmpty = (s: LexiqueState): boolean => PARAMS.every((p) => !filled(s, p.id));
