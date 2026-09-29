import { TEMPLATES, newId, SITE_TYPE_LABELS } from "@/data/outils/project-templates";
import type { Brief, ProjectPage, SiteType } from "@/lib/validations/design-project";
import { briefSchema } from "@/lib/validations/design-project";

export function emptyBrief(): Brief {
  return briefSchema.parse({});
}

export function templatePages(siteType: SiteType): ProjectPage[] {
  return TEMPLATES[siteType].pages.map((p) => ({
    id: newId(),
    name: p.name,
    goal: p.goal,
    priority: p.priority,
    sections: [...p.sections],
    contentReady: "no",
    content: "",
  }));
}

/** Brief initial d'un projet : pages et fonctionnalités du modèle */
export function briefFromTemplate(siteType: SiteType): Brief {
  const t = TEMPLATES[siteType];
  return { ...emptyBrief(), pages: templatePages(siteType), features: [...t.features] };
}

export interface CompletenessItem {
  id: string;
  label: string;
  block: string;
  done: boolean;
}

export function completenessItems(brief: Brief): CompletenessItem[] {
  const filled = (s: string) => s.trim().length > 0;
  return [
    { id: "pitch", label: "Pitch en une phrase", block: "identite", done: filled(brief.pitch) },
    { id: "sector", label: "Secteur / univers", block: "identite", done: filled(brief.sector) },
    { id: "audience", label: "Au moins un persona", block: "objectif", done: brief.audience.some((a) => filled(a.name)) },
    { id: "action", label: "Action principale du visiteur", block: "objectif", done: filled(brief.mainAction) },
    { id: "emotion", label: "Émotion recherchée", block: "objectif", done: filled(brief.emotion) },
    { id: "pages", label: "Au moins une page", block: "arborescence", done: brief.pages.length > 0 },
    { id: "goals", label: "Un objectif pour chaque page", block: "arborescence", done: brief.pages.length > 0 && brief.pages.every((p) => filled(p.goal)) },
    { id: "sections", label: "Des sections pour chaque page", block: "arborescence", done: brief.pages.length > 0 && brief.pages.every((p) => p.sections.length > 0) },
    { id: "mvp", label: "Au moins une page MVP", block: "arborescence", done: brief.pages.some((p) => p.priority === "mvp") },
    { id: "features", label: "Fonctionnalités choisies", block: "contenu", done: brief.features.length > 0 },
    { id: "content", label: "Contenu réel disponible (au moins une page)", block: "contenu", done: brief.pages.some((p) => p.contentReady !== "no") },
    { id: "lang", label: "Langues visées", block: "contraintes", done: filled(brief.constraints.languages) },
    { id: "identity", label: "Identité existante (couleurs, polices ou références)", block: "identite-visuelle", done: filled(brief.identity.colors) || filled(brief.identity.fonts) || brief.identity.refs.some((r) => filled(r.url)) },
  ];
}

export function completenessPct(brief: Brief): number {
  const items = completenessItems(brief);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

const PRIORITY_LABEL = { mvp: "MVP", later: "Plus tard" } as const;
const CONTENT_LABEL = { yes: "contenu prêt", partial: "contenu partiel", no: "contenu à écrire" } as const;
const A11Y_LABEL = { basic: "de base", aa: "WCAG AA", aaa: "WCAG AAA" } as const;
const DEVICE_LABEL = { mobile: "mobile d'abord", desktop: "desktop d'abord", both: "mobile et desktop à égalité" } as const;

/** Brief condensé, réutilisé dans le prompt de maquette (bloc [PROJET]) */
export function briefSummary(name: string, siteType: SiteType, brief: Brief): string {
  const lines: string[] = [];
  lines.push(`Nom : ${name} (${SITE_TYPE_LABELS[siteType].toLowerCase()})`);
  if (brief.pitch.trim()) lines.push(`Pitch : ${brief.pitch.trim()}`);
  if (brief.sector.trim()) lines.push(`Secteur : ${brief.sector.trim()}`);
  const personas = brief.audience.filter((a) => a.name.trim());
  if (personas.length) lines.push(`Public : ${personas.map((a) => (a.need.trim() ? `${a.name.trim()} (${a.need.trim()})` : a.name.trim())).join(" ; ")}`);
  if (brief.mainAction.trim()) lines.push(`Action principale : ${brief.mainAction.trim()}`);
  if (brief.emotion.trim()) lines.push(`Émotion recherchée : ${brief.emotion.trim()}`);
  if (brief.kpis.trim()) lines.push(`Critères de réussite : ${brief.kpis.trim()}`);
  const c = brief.constraints;
  const cons = [DEVICE_LABEL[c.priority], `accessibilité ${A11Y_LABEL[c.a11y]}`, c.languages.trim() && `langues : ${c.languages.trim()}`].filter(Boolean);
  lines.push(`Contraintes : ${cons.join(", ")}`);
  const idt: string[] = [];
  if (brief.identity.colors.trim()) idt.push(`couleurs imposées : ${brief.identity.colors.trim()}`);
  if (brief.identity.fonts.trim()) idt.push(`polices imposées : ${brief.identity.fonts.trim()}`);
  if (brief.identity.logo === "yes") idt.push("un logo existe (prévoir un emplacement)");
  if (idt.length) lines.push(`Identité existante : ${idt.join(" ; ")}`);
  return lines.join("\n");
}

/** Brief Markdown complet, copiable */
export function briefMarkdown(name: string, siteType: SiteType, brief: Brief): string {
  const out: string[] = [`# ${name}`, "", `_${SITE_TYPE_LABELS[siteType]}_`, ""];
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
  if (brief.pages.length) {
    out.push("## Arborescence", "");
    brief.pages.forEach((p, i) => {
      out.push(`### ${i + 1}. ${p.name || "Sans titre"} — ${PRIORITY_LABEL[p.priority]}`);
      if (p.goal.trim()) out.push(`Objectif : ${p.goal.trim()}`);
      if (p.sections.length) out.push(`Sections : ${p.sections.join(" → ")}`);
      out.push(`Contenu : ${CONTENT_LABEL[p.contentReady]}`);
      if (p.content.trim()) out.push("", p.content.trim());
      out.push("");
    });
  }
  sec("Fonctionnalités", brief.features.map((f) => `- ${f}`));
  const c = brief.constraints;
  sec("Contraintes", [
    `- Appareil : ${DEVICE_LABEL[c.priority]}`,
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
