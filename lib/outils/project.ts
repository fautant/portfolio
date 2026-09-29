import { describeFields, isFilled, visibleFields } from "@/data/outils/form-fields";
import { defaultVariant, getSectionDef } from "@/data/outils/sections";
import { SUPPORTS, newId } from "@/data/outils/supports";
import type { Brief, ProjectPage, SectionInstance, SupportType } from "@/lib/validations/design-project";
import { briefSchema } from "@/lib/validations/design-project";

export function emptyBrief(): Brief {
  return briefSchema.parse({});
}

/** Nouvelle section à partir du catalogue (`label` pour une section libre) */
export function makeSection(key: string, label?: string): SectionInstance {
  return { id: newId(), key, label: label ?? getSectionDef(key).label, variant: "", fields: {}, content: "", status: "todo" };
}

export function templatePages(type: SupportType): ProjectPage[] {
  return SUPPORTS[type].pages.map((p) => ({
    id: newId(),
    name: p.name,
    goal: p.goal,
    priority: p.priority,
    sections: p.sections.map((k) => makeSection(k)),
    contentReady: "no",
    content: "",
  }));
}

/** Brief initial d'un projet : pages, sections et fonctionnalités du modèle du support */
export function briefFromSupport(type: SupportType): Brief {
  return { ...emptyBrief(), pages: templatePages(type), features: [...SUPPORTS[type].features] };
}

/** Variante réellement utilisée par une section (la première du catalogue par défaut) */
export function effectiveVariant(s: SectionInstance): { k: string; label: string; desc: string } | null {
  const def = getSectionDef(s.key);
  const k = s.variant || defaultVariant(def);
  return def.variants.find((v) => v.k === k) ?? null;
}

export interface CompletenessItem {
  id: string;
  label: string;
  /** Étape où corriger : la structure ou le contexte */
  step: "structure" | "contexte";
  block: string;
  done: boolean;
}

export function completenessItems(brief: Brief, type: SupportType): CompletenessItem[] {
  const filled = (s: string) => s.trim().length > 0;
  const support = SUPPORTS[type];
  const required = visibleFields(support.contextFields, brief.context).filter((f) => f.required);
  return [
    { id: "pitch", label: "Pitch en une phrase", step: "contexte", block: "identite", done: filled(brief.pitch) },
    { id: "sector", label: "Secteur / univers", step: "contexte", block: "identite", done: filled(brief.sector) },
    { id: "audience", label: "Au moins un persona", step: "contexte", block: "objectif", done: brief.audience.some((a) => filled(a.name)) },
    { id: "action", label: "Action principale du lecteur", step: "contexte", block: "objectif", done: filled(brief.mainAction) },
    { id: "emotion", label: "Émotion recherchée", step: "contexte", block: "objectif", done: filled(brief.emotion) },
    ...required.map((f) => ({ id: `ctx-${f.id}`, label: f.label, step: "contexte" as const, block: "specifique", done: isFilled(brief.context[f.id]) })),
    { id: "pages", label: `Au moins ${support.multiPage ? "une " + support.unit : "une page"}`, step: "structure", block: "structure", done: brief.pages.length > 0 },
    { id: "goals", label: "Un objectif pour chaque page", step: "structure", block: "structure", done: brief.pages.length > 0 && brief.pages.every((p) => filled(p.goal)) },
    { id: "sections", label: "Des sections pour chaque page", step: "structure", block: "structure", done: brief.pages.length > 0 && brief.pages.every((p) => p.sections.length > 0) },
    { id: "lang", label: "Langues visées", step: "contexte", block: "contraintes", done: filled(brief.constraints.languages) },
    { id: "identity", label: "Identité existante (couleurs, polices ou références)", step: "contexte", block: "identite-visuelle", done: filled(brief.identity.colors) || filled(brief.identity.fonts) || brief.identity.refs.some((r) => filled(r.url)) },
  ];
}

export function completenessPct(brief: Brief, type: SupportType): number {
  const items = completenessItems(brief, type);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

/** Avancement de la génération : sections validées / total */
export function sectionProgress(brief: Brief): { ok: number; copied: number; total: number } {
  const all = brief.pages.flatMap((p) => p.sections);
  return { ok: all.filter((s) => s.status === "ok").length, copied: all.filter((s) => s.status === "copied" || s.status === "retouch").length, total: all.length };
}

const PRIORITY_LABEL = { mvp: "MVP", later: "Plus tard" } as const;
const A11Y_LABEL = { basic: "de base", aa: "WCAG AA", aaa: "WCAG AAA" } as const;
const DEVICE_LABEL = { mobile: "mobile d'abord", desktop: "desktop d'abord", both: "mobile et desktop à égalité" } as const;

/** Brief condensé, réutilisé dans chaque prompt (bloc [PROJET]) */
export function briefSummary(name: string, type: SupportType, brief: Brief): string {
  const support = SUPPORTS[type];
  const lines: string[] = [];
  lines.push(`Nom : ${name} (${support.label.toLowerCase()})`);
  if (brief.pitch.trim()) lines.push(`Pitch : ${brief.pitch.trim()}`);
  if (brief.sector.trim()) lines.push(`Secteur : ${brief.sector.trim()}`);
  const personas = brief.audience.filter((a) => a.name.trim());
  if (personas.length) lines.push(`Public : ${personas.map((a) => (a.need.trim() ? `${a.name.trim()} (${a.need.trim()})` : a.name.trim())).join(" ; ")}`);
  if (brief.mainAction.trim()) lines.push(`Action principale : ${brief.mainAction.trim()}`);
  if (brief.emotion.trim()) lines.push(`Émotion recherchée : ${brief.emotion.trim()}`);
  if (brief.kpis.trim()) lines.push(`Critères de réussite : ${brief.kpis.trim()}`);
  lines.push(...describeFields(support.contextFields, brief.context));
  const c = brief.constraints;
  const cons = [support.family === "web" && DEVICE_LABEL[c.priority], `accessibilité ${A11Y_LABEL[c.a11y]}`, c.languages.trim() && `langues : ${c.languages.trim()}`].filter(Boolean);
  lines.push(`Contraintes : ${cons.join(", ")}`);
  const idt: string[] = [];
  if (brief.identity.colors.trim()) idt.push(`couleurs imposées : ${brief.identity.colors.trim()}`);
  if (brief.identity.fonts.trim()) idt.push(`polices imposées : ${brief.identity.fonts.trim()}`);
  if (brief.identity.logo === "yes") idt.push("un logo existe (prévoir un emplacement)");
  if (idt.length) lines.push(`Identité existante : ${idt.join(" ; ")}`);
  return lines.join("\n");
}

/** Brief Markdown complet, copiable */
export function briefMarkdown(name: string, type: SupportType, brief: Brief): string {
  const support = SUPPORTS[type];
  const out: string[] = [`# ${name}`, "", `_${support.label}_`, ""];
  const sec = (title: string, body: string[]) => {
    const b = body.filter((l) => l !== "");
    if (b.length) out.push(`## ${title}`, "", ...b, "");
  };
  sec("Identité", [brief.pitch.trim() && `**Pitch :** ${brief.pitch.trim()}`, brief.sector.trim() && `**Secteur :** ${brief.sector.trim()}`].map((l) => l || ""));
  sec("Objectif & cible", [
    ...brief.audience.filter((a) => a.name.trim()).map((a) => `- **${a.name.trim()}**${a.need.trim() ? ` : ${a.need.trim()}` : ""}`),
    brief.mainAction.trim() ? `**Action principale :** ${brief.mainAction.trim()}` : "",
    brief.emotion.trim() ? `**Émotion recherchée :** ${brief.emotion.trim()}` : "",
    brief.kpis.trim() ? `**Critères de réussite :** ${brief.kpis.trim()}` : "",
  ]);
  sec("Contexte", describeFields(support.contextFields, brief.context).map((l) => `- ${l}`));
  if (brief.pages.length) {
    out.push("## Structure", "");
    brief.pages.forEach((p, i) => {
      out.push(`### ${i + 1}. ${p.name || "Sans titre"} — ${PRIORITY_LABEL[p.priority]}`);
      if (p.goal.trim()) out.push(`Objectif : ${p.goal.trim()}`);
      p.sections.forEach((s, k) => {
        const v = effectiveVariant(s);
        out.push(`${k + 1}. ${s.label}${v ? ` (${v.label})` : ""}`);
      });
      out.push("");
    });
  }
  if (support.family === "web") sec("Fonctionnalités", brief.features.map((f) => `- ${f}`));
  const c = brief.constraints;
  sec("Contraintes", [
    support.family === "web" ? `- Appareil : ${DEVICE_LABEL[c.priority]}` : "",
    `- Accessibilité : ${A11Y_LABEL[c.a11y]}`,
    c.languages.trim() ? `- Langues : ${c.languages.trim()}` : "",
    c.tech.trim() ? `- Techno cible : ${c.tech.trim()}` : "",
    c.deadline.trim() ? `- Échéance : ${c.deadline.trim()}` : "",
  ]);
  sec("Identité existante", [
    `- Logo : ${brief.identity.logo === "yes" ? "oui" : "non"}`,
    brief.identity.colors.trim() ? `- Couleurs : ${brief.identity.colors.trim()}` : "",
    brief.identity.fonts.trim() ? `- Polices : ${brief.identity.fonts.trim()}` : "",
    ...brief.identity.refs.filter((r) => r.url.trim()).map((r) => `- Référence : ${r.url.trim()}${r.keep.trim() ? ` — à retenir : ${r.keep.trim()}` : ""}`),
  ]);
  return out.join("\n").trim() + "\n";
}
