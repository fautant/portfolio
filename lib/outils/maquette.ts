import { TEMPLATES } from "@/data/outils/project-templates";
import type { Brief, MaquettesConfig, ProjectPage, SiteType } from "@/lib/validations/design-project";
import { briefSummary, completenessPct } from "./project";

export const SCOPE_LABELS: Record<MaquettesConfig["scope"], string> = {
  one: "Une seule page",
  mvp: "Pages MVP",
  all: "Toutes les pages",
  custom: "Sélection personnalisée",
  kit: "Kit UI seul",
};

export const BREAKPOINTS = {
  desktop: "desktop (1440 px)",
  tablet: "tablette (768 px)",
  mobile: "mobile (375 px)",
} as const;

/** Pages concernées par la génération, selon la portée choisie */
export function resolvePages(brief: Brief, config: MaquettesConfig): ProjectPage[] {
  switch (config.scope) {
    case "one": {
      const p = brief.pages.find((x) => x.id === config.onePageId) ?? brief.pages[0];
      return p ? [p] : [];
    }
    case "mvp":
      return brief.pages.filter((p) => p.priority === "mvp");
    case "all":
      return brief.pages;
    case "custom":
      return brief.pages.filter((p) => config.pageIds.includes(p.id));
    case "kit":
      return [];
  }
}

/** Retire de la configuration les pages qui n'existent plus dans le projet */
export function reconcile(config: MaquettesConfig, brief: Brief): { config: MaquettesConfig; removed: number } {
  const ids = new Set(brief.pages.map((p) => p.id));
  const pageIds = config.pageIds.filter((id) => ids.has(id));
  const removed = config.pageIds.length - pageIds.length + (config.onePageId && !ids.has(config.onePageId) ? 1 : 0);
  const disabledSections = Object.fromEntries(Object.entries(config.disabledSections).filter(([id]) => ids.has(id)));
  const done = config.done.filter((id) => id === "kit" || ids.has(id));
  return {
    config: { ...config, pageIds, onePageId: ids.has(config.onePageId) ? config.onePageId : (brief.pages[0]?.id ?? ""), disabledSections, done },
    removed,
  };
}

export interface GeneratedPrompt {
  /** "kit" ou l'id de la page ; "all" pour le prompt global */
  id: string;
  title: string;
  body: string;
}

interface BuildInput {
  name: string;
  siteType: SiteType;
  brief: Brief;
  /** Prompt de direction artistique produit par le Lexique (peut être vide) */
  lexiquePrompt: string;
  config: MaquettesConfig;
}

const RECALL = "Reprends exactement le même système visuel que les maquettes précédentes de cette conversation (palette, typographies, composants, espacements, ton).";

function deliverable(config: MaquettesConfig): string {
  const fid = config.fidelity === "wireframe" ? "wireframe basse fidélité (niveaux de gris, blocs et textes réalistes, pas d'images finales)" : "maquette haute fidélité (couleurs, typographies et images finales)";
  const bps = config.breakpoints.length ? config.breakpoints.map((b) => BREAKPOINTS[b]).join(", ") : BREAKPOINTS.desktop;
  const content = config.content === "real" ? "utilise en priorité les contenus réels fournis ; complète le reste avec du texte crédible" : "utilise un contenu réaliste et crédible";
  return [
    "[LIVRABLE]",
    `- Fidélité : ${fid}.`,
    `- Formats : ${bps}.`,
    `- Variantes : ${config.variants === 1 ? "une seule proposition" : `${config.variants} directions clairement différentes`}.`,
    `- Contenu : ${content}, jamais de lorem ipsum.`,
  ].join("\n");
}

function pageBlock(page: ProjectPage, index: number, total: number, unit: string, config: MaquettesConfig, states: string[]): string {
  const off = new Set(config.disabledSections[page.id] ?? []);
  const sections = page.sections.filter((s) => !off.has(s));
  const lines = [`[${unit.toUpperCase()} ${index}/${total} — ${page.name.trim() || "Sans titre"}] (${page.priority === "mvp" ? "MVP" : "plus tard"})`];
  if (page.goal.trim()) lines.push(`Objectif : ${page.goal.trim()}`);
  if (sections.length) lines.push("Sections, dans l'ordre :", ...sections.map((s, i) => `${i + 1}. ${s}`));
  if (config.content === "real" && page.content.trim()) lines.push("Contenu à utiliser :", page.content.trim());
  if (states.length) lines.push(`États à prévoir : ${states.join(", ")}.`);
  return lines.join("\n");
}

const KIT_BLOCK = [
  "[KIT UI]",
  "Conçois d'abord le système visuel du projet, sans page complète :",
  "- palette (valeurs hex, rôles, contrastes vérifiés) et échelle typographique ;",
  "- espacements, rayons, ombres ou bordures ;",
  "- boutons (états normal, survol, focus, désactivé), champs de formulaire, cartes, navigation, badges ;",
  "- un exemple de composition qui montre l'ensemble en situation.",
].join("\n");

/** Assemble les prompts à copier dans Claude Design */
export function buildMaquettePrompts({ name, siteType, brief, lexiquePrompt, config }: BuildInput): GeneratedPrompt[] {
  const tpl = TEMPLATES[siteType];
  const pages = resolvePages(brief, config);
  const wantsKit = config.scope === "kit" || config.includeKit;
  const states = config.states.filter((s) => tpl.states.includes(s));
  const project = `[PROJET]\n${briefSummary(name, siteType, brief)}`;
  const art = lexiquePrompt.trim() ? `[DIRECTION ARTISTIQUE]\n${lexiquePrompt.trim()}` : "";
  const head = [project, art].filter(Boolean).join("\n\n");
  const live = deliverable(config);

  if (config.output === "global") {
    const parts = [head];
    if (wantsKit) parts.push(KIT_BLOCK);
    if (pages.length) parts.push(`[MAQUETTES À GÉNÉRER — ${pages.length} ${tpl.unit}${pages.length > 1 ? "s" : ""}]\n\n` + pages.map((p, i) => pageBlock(p, i + 1, pages.length, tpl.unit, config, states)).join("\n\n"));
    parts.push(live, "Garde une cohérence visuelle stricte entre toutes les " + (tpl.unit === "page" ? "pages" : "écrans") + ".");
    return pages.length || wantsKit ? [{ id: "all", title: "Prompt global", body: parts.join("\n\n") }] : [];
  }

  // Séquence : le premier prompt fixe le système visuel, les suivants le reprennent
  const out: GeneratedPrompt[] = [];
  let established = false;
  const intro = () => (established ? `${project}\n\n${RECALL}` : head);
  if (wantsKit) {
    out.push({ id: "kit", title: "Kit UI / design system", body: [head, KIT_BLOCK, live].join("\n\n") });
    established = true;
  }
  pages.forEach((p, i) => {
    out.push({
      id: p.id,
      title: `${p.name.trim() || "Sans titre"} (${i + 1}/${pages.length})`,
      body: [intro(), `[MAQUETTE À GÉNÉRER]\n\n${pageBlock(p, i + 1, pages.length, tpl.unit, config, states)}`, live].join("\n\n"),
    });
    established = true;
  });
  return out;
}

export interface Warning {
  id: string;
  text: string;
  href?: string;
  cta?: string;
}

export function maquetteWarnings(brief: Brief, hasLexique: boolean, config: MaquettesConfig, projectId: string, removed: number): Warning[] {
  const w: Warning[] = [];
  if (!hasLexique) w.push({ id: "lexique", text: "Le Lexique est vide : les maquettes n'auront aucune direction artistique.", href: `/outils/projets/${projectId}/lexique`, cta: "Compléter le Lexique" });
  const pct = completenessPct(brief);
  if (pct < 60) w.push({ id: "brief", text: `Le brief n'est complet qu'à ${pct} %.`, href: `/outils/projets/${projectId}`, cta: "Compléter le projet" });
  if (!brief.pages.length) w.push({ id: "pages", text: "Le projet n'a encore aucune page.", href: `/outils/projets/${projectId}#arborescence`, cta: "Ajouter des pages" });
  if (config.scope === "mvp" && brief.pages.length && !brief.pages.some((p) => p.priority === "mvp")) w.push({ id: "mvp", text: "Aucune page n'est marquée MVP : choisis une autre portée ou marque des pages MVP." });
  if (removed > 0) w.push({ id: "removed", text: `${removed} page${removed > 1 ? "s" : ""} supprimée${removed > 1 ? "s" : ""} du projet ${removed > 1 ? "ont" : "a"} été retirée${removed > 1 ? "s" : ""} de la sélection.` });
  return w;
}
