export type FieldType = "text" | "textarea" | "select" | "chips" | "list" | "toggle";

/** Valeur d'un champ : texte, liste (chips / une entrée par ligne) ou "yes" / "no" pour un interrupteur */
export type FieldValue = string | string[];
export type FieldValues = Record<string, FieldValue>;

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  /** select / chips */
  options?: readonly string[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  /** N'affiche le champ que si un autre champ a cette valeur (ou la contient, pour une liste) */
  showIf?: { field: string; equals: string };
}

export function isVisible(def: FieldDef, values: FieldValues): boolean {
  if (!def.showIf) return true;
  const v = values[def.showIf.field];
  return Array.isArray(v) ? v.includes(def.showIf.equals) : v === def.showIf.equals;
}

export function visibleFields(defs: readonly FieldDef[], values: FieldValues): FieldDef[] {
  return defs.filter((d) => isVisible(d, values));
}

export function isFilled(v: FieldValue | undefined): boolean {
  if (v === undefined) return false;
  return Array.isArray(v) ? v.some((x) => x.trim()) : v.trim().length > 0;
}

/** Ligne « Libellé : valeur » pour un prompt ; chaîne vide si le champ n'est pas renseigné */
export function fieldLine(def: FieldDef, v: FieldValue | undefined): string {
  if (v === undefined || !isFilled(v)) return "";
  if (def.type === "toggle") return `${def.label} : ${v === "yes" ? "oui" : "non"}`;
  if (Array.isArray(v)) return `${def.label} : ${v.map((x) => x.trim()).filter(Boolean).join(" ; ")}`;
  return `${def.label} : ${v.trim()}`;
}

/** Lignes des champs visibles et renseignés */
export function describeFields(defs: readonly FieldDef[], values: FieldValues): string[] {
  return visibleFields(defs, values)
    .map((d) => fieldLine(d, values[d.id]))
    .filter(Boolean);
}
