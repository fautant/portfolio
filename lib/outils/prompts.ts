import { describeFields } from "@/data/outils/form-fields";
import { getSectionDef } from "@/data/outils/sections";
import { SUPPORTS, unitWords, type Support } from "@/data/outils/supports";
import type { BuildConfig, Brief, ProjectPage, SectionInstance, SupportType } from "@/lib/validations/design-project";
import { briefSummary, completenessPct, effectiveVariant } from "./project";

export interface PromptCtx {
  name: string;
  type: SupportType;
  brief: Brief;
  /** Prompt de direction artistique produit par le Lexique (peut être vide) */
  lexiquePrompt: string;
  config: BuildConfig;
}

export interface GeneratedPrompt {
  /** "kit", "final" ou l'id de la section */
  id: string;
  title: string;
  body: string;
}

export interface FlatSection {
  page: ProjectPage;
  section: SectionInstance;
  /** Position dans la page (à partir de 0) et nombre de sections de la page */
  index: number;
  total: number;
  /** Position dans l'ordre global de génération (à partir de 0) */
  order: number;
}

/** Toutes les sections du projet, dans l'ordre de génération */
export function flattenSections(brief: Brief): FlatSection[] {
  const out: FlatSection[] = [];
  brief.pages.forEach((page) => {
    page.sections.forEach((section, index) => out.push({ page, section, index, total: page.sections.length, order: out.length }));
  });
  return out;
}

const RECALL = "Reprends exactement le même système visuel que les éléments précédents de cette conversation (palette, typographies, composants, espacements, ton).";

export const RETOUCH_CHIPS = [
  "Plus aéré (espacements plus généreux)",
  "Plus compact",
  "Hiérarchie visuelle plus forte",
  "Plus de contraste",
  "Moins de texte",
  "Éléments plus grands et plus lisibles",
  "Plus proche de la direction artistique",
  "Propose une autre variante de mise en page",
] as const;

/** Règles d'impression + règles dépendant des réponses du contexte */
function technicalRules(support: Support, brief: Brief): string[] {
  const rules = [...support.printRules];
  if (support.type === "cv" && brief.context.ats === "yes") {
    rules.push("Structure linéaire lisible par un logiciel de tri (ATS) : pas de tableau complexe, aucune information uniquement dans une icône ou une image");
  }
  return rules;
}

/** Formats retenus : ceux du réglage, sinon ceux par défaut du support */
export function activeFormats(support: Support, config: BuildConfig): string[] {
  const chosen = config.formats.filter((k) => support.formats.some((f) => f.k === k));
  const keys = chosen.length ? chosen : support.defaultFormats;
  return support.formats.filter((f) => keys.includes(f.k)).map((f) => f.label);
}

function supportBlock(ctx: PromptCtx): string {
  const support = SUPPORTS[ctx.type];
  const formats = activeFormats(support, ctx.config);
  const lines = ["[SUPPORT]", `Type : ${support.label} (${support.family === "web" ? "interface à l'écran" : "document imprimé"}).`, `Format${formats.length > 1 ? "s" : ""} : ${formats.join(", ")}.`];
  const rules = technicalRules(support, ctx.brief);
  if (rules.length) lines.push("Contraintes techniques :", ...rules.map((r) => `- ${r}`));
  return lines.join("\n");
}

/** Bloc d'ouverture : le projet, puis la direction artistique (premier prompt) ou le rappel du système visuel */
function head(ctx: PromptCtx, order: number): string {
  const project = `[PROJET]\n${briefSummary(ctx.name, ctx.type, ctx.brief)}`;
  const anchor = ctx.config.anchor.trim();
  if (anchor) return `${project}\n\n[SYSTÈME VISUEL ÉTABLI]\n${anchor}\n\n${RECALL}`;
  if (order > 0) return `${project}\n\n${RECALL}`;
  const art = ctx.lexiquePrompt.trim();
  return art ? `${project}\n\n[DIRECTION ARTISTIQUE]\n${art}` : project;
}

function fidelityLine(config: BuildConfig): string {
  return config.fidelity === "wireframe" ? "wireframe basse fidélité (niveaux de gris, blocs et textes réalistes, pas d'images finales)" : "maquette haute fidélité (couleurs, typographies et images finales)";
}

function deliverable(ctx: PromptCtx, last: string): string {
  const { config } = ctx;
  const content = config.contentMode === "real" ? "utilise en priorité les contenus réels fournis ; complète le reste avec du texte crédible" : "utilise un contenu réaliste et crédible";
  return [
    "[LIVRABLE]",
    `- Fidélité : ${fidelityLine(config)}.`,
    `- Variantes : ${config.variants === 1 ? "une seule proposition" : `${config.variants} directions clairement différentes`}.`,
    `- Contenu : ${content}, jamais de lorem ipsum.`,
    `- ${last}`,
  ].join("\n");
}

const KIT_WEB = [
  "[KIT UI]",
  "Conçois d'abord le système visuel du projet, sans page complète :",
  "- palette (valeurs hex, rôles, contrastes vérifiés) et échelle typographique ;",
  "- espacements, rayons, ombres ou bordures ;",
  "- boutons (états normal, survol, focus, désactivé), champs de formulaire, cartes, navigation, badges ;",
  "- un exemple de composition qui montre l'ensemble en situation.",
].join("\n");

const KIT_PRINT = [
  "[KIT DE STYLE]",
  "Conçois d'abord le système visuel du document, sans mise en page complète :",
  "- palette (valeurs hex, rôles, contrastes vérifiés) et deux typographies au maximum ;",
  "- styles de titres, sous-titres, texte courant et légendes, avec tailles en points ;",
  "- filets, puces, icônes et éléments décoratifs récurrents ;",
  "- grille de mise en page et marges ;",
  "- un exemple de composition qui montre l'ensemble en situation.",
].join("\n");

/** Étape 0 : fixe le système visuel avant les sections */
export function buildKitPrompt(ctx: PromptCtx): GeneratedPrompt {
  const family = SUPPORTS[ctx.type].family;
  const body = [head(ctx, 0), supportBlock(ctx), family === "web" ? KIT_WEB : KIT_PRINT, deliverable(ctx, "Ne génère que le système visuel : il servira de référence pour toutes les sections suivantes.")].join("\n\n");
  return { id: "kit", title: family === "web" ? "Kit UI / système visuel" : "Kit de style", body };
}

function positionBlock(ctx: PromptCtx, item: FlatSection): string {
  const support = SUPPORTS[ctx.type];
  const { page, index, total } = item;
  const prev = page.sections[index - 1];
  const next = page.sections[index + 1];
  const where = support.multiPage ? `de ${unitWords(support).le} « ${page.name.trim() || "Sans titre"} »` : "du document";
  const around = [prev && `précédée de « ${prev.label} »`, next && `suivie de « ${next.label} »`].filter(Boolean).join(", ");
  return ["[POSITION]", `Section ${index + 1}/${total} ${where}${around ? ` — ${around}` : ""}.`, page.goal.trim() && `Objectif ${support.multiPage ? `de ${unitWords(support).le}` : "du document"} : ${page.goal.trim()}`].filter(Boolean).join("\n");
}

/** Prompt d'une section, avec sa place dans le support pour que les raccords fonctionnent */
export function buildSectionPrompt(ctx: PromptCtx, sectionId: string): GeneratedPrompt | null {
  const flat = flattenSections(ctx.brief);
  const item = flat.find((f) => f.section.id === sectionId);
  if (!item) return null;
  const support = SUPPORTS[ctx.type];
  const { section, page } = item;
  const def = getSectionDef(section.key);
  const variant = effectiveVariant(section);
  const order = item.order + (ctx.config.includeKit ? 1 : 0);

  const lines = [`[SECTION À GÉNÉRER — ${section.label}]`];
  if (def.description && section.key !== "custom") lines.push(`Rôle : ${def.description}`);
  if (variant) lines.push(`Variante de mise en page : ${variant.label} — ${variant.desc}.`);
  lines.push(...describeFields(def.fields, section.fields));
  const real = ctx.config.contentMode === "real";
  if (section.content.trim()) lines.push(real ? "Contenu à utiliser tel quel :" : "Repères de contenu :", section.content.trim());
  if (real && item.index === 0 && page.content.trim()) lines.push("Contenu de la page (à répartir dans ses sections) :", page.content.trim());
  if (support.states.length && ["table", "kpis", "cart", "contact", "filters"].includes(section.key)) lines.push(`États à prévoir : ${support.states.join(", ")}.`);

  const parts = [head(ctx, order), supportBlock(ctx), positionBlock(ctx, item), lines.join("\n")];
  if (def.checklist.length) parts.push(["[CRITÈRES]", ...def.checklist.map((c) => `- ${c}`)].join("\n"));
  parts.push(
    deliverable(ctx, support.family === "web" ? "Génère uniquement cette section, pleine largeur, sans le reste de la page : elle sera assemblée avec les autres." : "Génère uniquement cette zone du document, à l'échelle du format indiqué : elle sera assemblée avec les autres."),
  );
  return { id: section.id, title: `${section.label} (${item.index + 1}/${item.total}${support.multiPage ? ` · ${page.name.trim() || "Sans titre"}` : ""})`, body: parts.join("\n\n") };
}

/** Prompt de retouche d'une section déjà générée */
export function buildRetouchPrompt(ctx: PromptCtx, sectionId: string, chips: string[], note: string): GeneratedPrompt | null {
  const item = flattenSections(ctx.brief).find((f) => f.section.id === sectionId);
  if (!item) return null;
  const changes = [...chips, note.trim()].filter(Boolean);
  const body = [
    `Retouche la section « ${item.section.label} » que tu viens de générer, sans modifier le reste du système visuel (palette, typographies, composants).`,
    changes.length ? ["Modifications demandées :", ...changes.map((c) => `- ${c}`)].join("\n") : "",
    positionBlock(ctx, item),
    "Conserve le contenu et la place de la section. Génère uniquement la section corrigée.",
  ]
    .filter(Boolean)
    .join("\n\n");
  return { id: `${sectionId}:retouche`, title: `Retouche — ${item.section.label}`, body };
}

/** Prompt final : assemble les sections générées en un support complet */
export function buildAssemblyPrompt(ctx: PromptCtx): GeneratedPrompt {
  const support = SUPPORTS[ctx.type];
  const web = support.family === "web";
  const anchor = ctx.config.anchor.trim();
  const structure = ctx.brief.pages.map((p) => {
    const rows = p.sections.map((s, i) => {
      const v = effectiveVariant(s);
      return `${i + 1}. ${s.label}${v ? ` (${v.label})` : ""}`;
    });
    const title = support.multiPage ? `${unitWords(support).sing.replace(/^./, (c) => c.toUpperCase())} « ${p.name.trim() || "Sans titre"} »${p.goal.trim() ? ` — ${p.goal.trim()}` : ""}` : "Document";
    return [title, ...rows].join("\n");
  });
  const harmonize = [
    "[HARMONISATION]",
    "- rythme vertical régulier : mêmes espacements entre sections, alternance des fonds maîtrisée ;",
    "- mêmes composants partout (boutons, cartes, champs, puces) avec les mêmes rayons et les mêmes ombres ;",
    "- une seule hiérarchie typographique, sans variation d'une section à l'autre ;",
    "- transitions cohérentes entre sections voisines (fond, séparateurs, alignements) ;",
    "- corrige toute incohérence de couleur, de taille ou d'espacement entre les blocs déjà générés.",
  ].join("\n");
  const layout = web
    ? ["[RESPONSIVE]", `Formats : ${activeFormats(support, ctx.config).join(", ")}.`, "- navigation adaptée à chaque format, grilles qui se réduisent proprement, zones tactiles ≥ 44 px."].join("\n")
    : ["[MISE EN PAGE]", ...technicalRules(support, ctx.brief).map((r) => `- ${r}`), `- format : ${activeFormats(support, ctx.config).join(", ")}.`].join("\n");
  const checks = ["[VÉRIFICATIONS]", "- contraste suffisant partout (WCAG AA minimum) ;", "- aucun texte coupé, aucun débordement ;", web ? "- états de survol, focus et actif cohérents." : "- lisible en noir et blanc, marges et zones de sécurité respectées."].join("\n");
  const body = [
    "[ASSEMBLAGE FINAL]",
    `Tu as généré séparément les sections du projet. Assemble-les maintenant en ${web ? "un rendu complet et cohérent" : "un document complet et cohérent"}, dans l'ordre ci-dessous, sans redessiner ce qui a déjà été validé.`,
    `[PROJET]\n${briefSummary(ctx.name, ctx.type, ctx.brief)}`,
    anchor ? `[SYSTÈME VISUEL ÉTABLI]\n${anchor}` : "",
    `[STRUCTURE]\n${structure.join("\n\n")}`,
    harmonize,
    layout,
    checks,
    deliverable(ctx, web ? "Présente l'ensemble assemblé, puis prépare l'export (HTML/CSS ou lien de prévisualisation)." : "Présente l'ensemble assemblé, puis prépare l'export PDF haute définition aux dimensions exactes."),
  ]
    .filter(Boolean)
    .join("\n\n");
  return { id: "final", title: "Prompt final d'assemblage", body };
}

export interface Warning {
  id: string;
  text: string;
  href?: string;
  cta?: string;
}

export function sectionWarnings(ctx: PromptCtx, projectId: string): Warning[] {
  const w: Warning[] = [];
  const { brief, config } = ctx;
  if (!ctx.lexiquePrompt.trim() && !config.anchor.trim()) w.push({ id: "lexique", text: "Le Lexique est vide : les sections n'auront aucune direction artistique.", href: `/outils/projets/${projectId}/lexique`, cta: "Compléter le Lexique" });
  const pct = completenessPct(brief, ctx.type);
  if (pct < 60) w.push({ id: "brief", text: `Le contexte n'est complet qu'à ${pct} %.`, href: `/outils/projets/${projectId}/contexte`, cta: "Compléter le contexte" });
  const flat = flattenSections(brief);
  if (!flat.length) w.push({ id: "sections", text: "Le projet n'a encore aucune section.", href: `/outils/projets/${projectId}`, cta: "Choisir des sections" });
  const bare = flat.filter((f) => !f.section.content.trim()).length;
  if (config.contentMode === "real" && bare > 0) w.push({ id: "content", text: `${bare} section${bare > 1 ? "s n'ont" : " n'a"} pas de contenu réel : du texte crédible sera généré à la place.`, href: `/outils/projets/${projectId}/contexte`, cta: "Renseigner les contenus" });
  return w;
}
