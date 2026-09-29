import { z } from "zod";

export const SITE_TYPES = [
  "portfolio-dev",
  "portfolio-ux",
  "freelance",
  "landing",
  "ecommerce",
  "blog",
  "dashboard",
  "mobile",
] as const;
export type SiteType = (typeof SITE_TYPES)[number];

const str = (max = 2000) => z.string().max(max).catch("");
const id = () => z.string().max(60);

export const pageSchema = z.object({
  id: id(),
  name: str(120),
  goal: str(400),
  priority: z.enum(["mvp", "later"]).catch("mvp"),
  sections: z.array(z.string().max(120)).max(40).catch([]),
  contentReady: z.enum(["yes", "partial", "no"]).catch("no"),
  content: str(8000),
});
export type ProjectPage = z.infer<typeof pageSchema>;

export const personaSchema = z.object({ id: id(), name: str(120), need: str(400) });
export type Persona = z.infer<typeof personaSchema>;

export const refSchema = z.object({ id: id(), url: str(400), keep: str(300) });
export type Reference = z.infer<typeof refSchema>;

export const briefSchema = z
  .object({
    pitch: str(400),
    sector: str(200),
    audience: z.array(personaSchema).max(10).catch([]),
    mainAction: str(300),
    emotion: str(300),
    kpis: str(600),
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
      .catch({ priority: "both", languages: "", a11y: "aa", tech: "", deadline: "" }),
    identity: z
      .object({
        logo: z.enum(["yes", "no"]).catch("no"),
        colors: str(300),
        fonts: str(300),
        refs: z.array(refSchema).max(10).catch([]),
      })
      .catch({ logo: "no", colors: "", fonts: "", refs: [] }),
  })
  .catch({
    pitch: "",
    sector: "",
    audience: [],
    mainAction: "",
    emotion: "",
    kpis: "",
    pages: [],
    features: [],
    constraints: { priority: "both", languages: "", a11y: "aa", tech: "", deadline: "" },
    identity: { logo: "no", colors: "", fonts: "", refs: [] },
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

export const maquettesSchema = z
  .object({
    scope: z.enum(["one", "mvp", "all", "custom", "kit"]).catch("mvp"),
    onePageId: z.string().catch(""),
    pageIds: z.array(z.string()).catch([]),
    fidelity: z.enum(["wireframe", "hifi"]).catch("hifi"),
    breakpoints: z.array(z.enum(["desktop", "tablet", "mobile"])).catch(["desktop", "mobile"]),
    variants: z.number().int().min(1).max(3).catch(1),
    content: z.enum(["real", "realistic"]).catch("realistic"),
    output: z.enum(["global", "sequence"]).catch("sequence"),
    states: z.array(z.string()).catch([]),
    includeKit: z.boolean().catch(false),
    disabledSections: z.record(z.string(), z.array(z.string())).catch({}),
    done: z.array(z.string()).catch([]),
  })
  .catch({
    scope: "mvp",
    onePageId: "",
    pageIds: [],
    fidelity: "hifi",
    breakpoints: ["desktop", "mobile"],
    variants: 1,
    content: "realistic",
    output: "sequence",
    states: [],
    includeKit: false,
    disabledSections: {},
    done: [],
  });
export type MaquettesConfig = z.infer<typeof maquettesSchema>;

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  siteType: z.enum(SITE_TYPES),
});

export const projectPartSchema = z.enum(["brief", "lexique", "maquettes"]);
export type ProjectPart = z.infer<typeof projectPartSchema>;

export const promptKindSchema = z.enum(["lexique", "maquette"]);
export const savePromptSchema = z.object({
  projectId: z.string().uuid(),
  kind: promptKindSchema,
  label: z.string().max(200).optional(),
  prompt: z.string().min(1).max(60000),
});

export interface ProjectRow {
  id: string;
  name: string;
  site_type: SiteType;
  brief: unknown;
  lexique: unknown;
  maquettes: unknown;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  siteType: SiteType;
  brief: Brief;
  lexique: LexiqueData;
  maquettes: MaquettesConfig;
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
    maquettes: maquettesSchema.parse(row.maquettes ?? {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface PromptHistoryRow {
  id: string;
  project_id: string;
  kind: "lexique" | "maquette";
  label: string | null;
  prompt: string;
  created_at: string;
}
