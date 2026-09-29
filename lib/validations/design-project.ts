import { z } from "zod";
import { keyFromLabel } from "@/data/outils/sections";

export const SUPPORT_TYPES = [
  "portfolio-dev",
  "portfolio-ux",
  "freelance",
  "landing",
  "ecommerce",
  "blog",
  "dashboard",
  "mobile",
  "cv",
  "lettre-motivation",
  "carte-visite",
  "flyer-affiche",
] as const;
export type SupportType = (typeof SUPPORT_TYPES)[number];

const str = (max = 2000) => z.string().max(max).catch("");
const id = () => z.string().max(60);

/** Valeur d'un champ de formulaire : texte, liste ou « yes » / « no » */
const fieldValue = z.union([z.string().max(4000), z.array(z.string().max(400)).max(30)]);
const values = () => z.record(z.string().max(60), fieldValue).catch({});

export const SECTION_STATUSES = ["todo", "copied", "ok", "retouch"] as const;
export type SectionStatus = (typeof SECTION_STATUSES)[number];

export const sectionSchema = z.object({
  id: id(),
  /** Clé du catalogue (`data/outils/sections.ts`), « custom » pour une section libre */
  key: z.string().max(60).catch("custom"),
  label: str(120),
  /** Variante de mise en page ; vide = première variante du catalogue */
  variant: z.string().max(40).catch(""),
  fields: values(),
  content: str(8000),
  status: z.enum(SECTION_STATUSES).catch("todo"),
});
export type SectionInstance = z.infer<typeof sectionSchema>;

/** Anciens projets : `sections` était une liste de libellés, convertie ici en sections structurées */
function migratePage(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const page = raw as { id?: unknown; sections?: unknown };
  if (!Array.isArray(page.sections)) return raw;
  const pid = typeof page.id === "string" ? page.id : "p";
  return {
    ...page,
    sections: page.sections.map((s, i) =>
      typeof s === "string" ? { id: `${pid}-s${i}`, key: keyFromLabel(s), label: s.slice(0, 120), variant: "", fields: {}, content: "", status: "todo" } : s,
    ),
  };
}

export const pageSchema = z.preprocess(
  migratePage,
  z.object({
    id: id(),
    name: str(120),
    goal: str(400),
    priority: z.enum(["mvp", "later"]).catch("mvp"),
    sections: z.array(sectionSchema).max(40).catch([]),
    contentReady: z.enum(["yes", "partial", "no"]).catch("no"),
    content: str(8000),
  }),
);
export type ProjectPage = z.infer<typeof pageSchema>;

export const personaSchema = z.object({ id: id(), name: str(120), need: str(400) });
export type Persona = z.infer<typeof personaSchema>;

export const refSchema = z.object({ id: id(), url: str(400), keep: str(300) });
export type Reference = z.infer<typeof refSchema>;

const DEFAULT_CONSTRAINTS = { priority: "both", languages: "", a11y: "aa", tech: "", deadline: "" } as const;
const DEFAULT_IDENTITY = { logo: "no", colors: "", fonts: "", refs: [] } as const;

export const briefSchema = z
  .object({
    pitch: str(400),
    sector: str(200),
    audience: z.array(personaSchema).max(10).catch([]),
    mainAction: str(300),
    emotion: str(300),
    kpis: str(600),
    /** Réponses au formulaire de contexte propre au support (`Support.contextFields`) */
    context: values(),
    pages: z.array(pageSchema).max(60).catch([]),
    features: z.array(z.string().max(80)).max(40).catch([]),
    constraints: z
      .object({
        priority: z.enum(["mobile", "desktop", "both"]).catch("both"),
        languages: str(120),
        a11y: z.enum(["basic", "aa", "aaa"]).catch("aa"),
        tech: str(200),
        deadline: str(120),
      })
      .catch({ ...DEFAULT_CONSTRAINTS }),
    identity: z
      .object({
        logo: z.enum(["yes", "no"]).catch("no"),
        colors: str(300),
        fonts: str(300),
        refs: z.array(refSchema).max(10).catch([]),
      })
      .catch({ ...DEFAULT_IDENTITY, refs: [] }),
  })
  .catch({
    pitch: "",
    sector: "",
    audience: [],
    mainAction: "",
    emotion: "",
    kpis: "",
    context: {},
    pages: [],
    features: [],
    constraints: { ...DEFAULT_CONSTRAINTS },
    identity: { ...DEFAULT_IDENTITY, refs: [] },
  });
export type Brief = z.infer<typeof briefSchema>;

export const lexiqueSchema = z
  .object({
    state: z
      .record(z.string(), z.object({ sel: z.array(z.string()).catch([]), note: z.string().max(600).catch("") }))
      .catch({}),
    tips: z.record(z.string(), z.boolean()).catch({}),
  })
  .catch({ state: {}, tips: {} });
export type LexiqueData = z.infer<typeof lexiqueSchema>;

/** Réglages de génération (colonne `maquettes` en base, nom conservé) */
export const buildSchema = z
  .object({
    fidelity: z.enum(["wireframe", "hifi"]).catch("hifi"),
    /** Clés de `Support.formats` ; vide = formats par défaut du support */
    formats: z.array(z.string().max(30)).max(10).catch([]),
    variants: z.number().int().min(1).max(3).catch(1),
    contentMode: z.enum(["real", "realistic"]).catch("realistic"),
    includeKit: z.boolean().catch(true),
    kitStatus: z.enum(["todo", "copied", "ok"]).catch("todo"),
    /** Description du système visuel obtenu, collée par l'utilisateur après le kit */
    anchor: str(6000),
  })
  .catch({ fidelity: "hifi", formats: [], variants: 1, contentMode: "realistic", includeKit: true, kitStatus: "todo", anchor: "" });
export type BuildConfig = z.infer<typeof buildSchema>;

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  siteType: z.enum(SUPPORT_TYPES),
});

export const projectPartSchema = z.enum(["brief", "lexique", "maquettes"]);
export type ProjectPart = z.infer<typeof projectPartSchema>;

export const promptKindSchema = z.enum(["lexique", "maquette", "kit", "section", "retouche", "final"]);
export type PromptKind = z.infer<typeof promptKindSchema>;
export const savePromptSchema = z.object({
  projectId: z.string().uuid(),
  kind: promptKindSchema,
  label: z.string().max(200).optional(),
  prompt: z.string().min(1).max(60000),
});

export interface ProjectRow {
  id: string;
  name: string;
  site_type: SupportType;
  brief: unknown;
  lexique: unknown;
  maquettes: unknown;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  siteType: SupportType;
  brief: Brief;
  lexique: LexiqueData;
  build: BuildConfig;
  createdAt: string;
  updatedAt: string;
}

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    siteType: row.site_type,
    brief: briefSchema.parse(row.brief ?? {}),
    lexique: lexiqueSchema.parse(row.lexique ?? {}),
    build: buildSchema.parse(row.maquettes ?? {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface PromptHistoryRow {
  id: string;
  project_id: string;
  kind: PromptKind;
  label: string | null;
  prompt: string;
  created_at: string;
}
