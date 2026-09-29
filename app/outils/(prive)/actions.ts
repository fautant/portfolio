"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { briefFromTemplate } from "@/lib/outils/project";
import {
  briefSchema,
  createProjectSchema,
  lexiqueSchema,
  maquettesSchema,
  projectPartSchema,
  savePromptSchema,
  toProject,
  type Project,
  type ProjectRow,
  type PromptHistoryRow,
} from "@/lib/validations/design-project";

const importSchema = createProjectSchema.extend({
  brief: z.unknown().optional(),
  lexique: z.unknown().optional(),
  maquettes: z.unknown().optional(),
});

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

async function db() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  return supabase;
}

export async function listProjects(): Promise<Project[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("design_projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[outils] listProjects:", error.message);
    return [];
  }
  return (data as ProjectRow[]).map(toProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await db();
  const { data, error } = await supabase.from("design_projects").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return toProject(data as ProjectRow);
}

export async function createProject(input: { name: string; siteType: string }): Promise<ActionResult<{ id: string }>> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Nom ou type de projet invalide" };
  const supabase = await db();
  const { data, error } = await supabase
    .from("design_projects")
    .insert({
      name: parsed.data.name,
      site_type: parsed.data.siteType,
      brief: briefFromTemplate(parsed.data.siteType),
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Création impossible" };
  revalidatePath("/outils", "layout");
  return { ok: true, data: { id: (data as { id: string }).id } };
}

/** Change le nom et/ou le type de site (le brief est géré séparément par saveProjectPart) */
export async function updateProjectMeta(id: string, meta: { name?: string; siteType?: string }): Promise<ActionResult> {
  const patch: Record<string, string> = {};
  if (meta.name !== undefined) {
    const name = meta.name.trim().slice(0, 120);
    if (!name) return { ok: false, error: "Nom vide" };
    patch.name = name;
  }
  if (meta.siteType !== undefined) {
    const t = createProjectSchema.shape.siteType.safeParse(meta.siteType);
    if (!t.success) return { ok: false, error: "Type de site invalide" };
    patch.site_type = t.data;
  }
  if (!Object.keys(patch).length) return { ok: true };
  const supabase = await db();
  const { error } = await supabase.from("design_projects").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/outils", "layout");
  return { ok: true };
}

export async function duplicateProject(id: string): Promise<ActionResult<{ id: string }>> {
  const source = await getProject(id);
  if (!source) return { ok: false, error: "Projet introuvable" };
  const supabase = await db();
  const { data, error } = await supabase
    .from("design_projects")
    .insert({
      name: `${source.name} (copie)`.slice(0, 120),
      site_type: source.siteType,
      brief: source.brief,
      lexique: source.lexique,
      maquettes: { ...source.maquettes, done: [] },
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Duplication impossible" };
  revalidatePath("/outils", "layout");
  return { ok: true, data: { id: (data as { id: string }).id } };
}

export async function importProject(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = importSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Fichier de projet invalide" };
  const supabase = await db();
  const { data, error } = await supabase
    .from("design_projects")
    .insert({
      name: parsed.data.name,
      site_type: parsed.data.siteType,
      brief: briefSchema.parse(parsed.data.brief ?? {}),
      lexique: lexiqueSchema.parse(parsed.data.lexique ?? {}),
      maquettes: { ...maquettesSchema.parse(parsed.data.maquettes ?? {}), done: [] },
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Import impossible" };
  revalidatePath("/outils", "layout");
  return { ok: true, data: { id: (data as { id: string }).id } };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("design_projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/outils", "layout");
  return { ok: true };
}

/** Enregistre une des trois parties d'un projet (validation Zod côté serveur) */
export async function saveProjectPart(id: string, part: string, data: unknown): Promise<ActionResult> {
  const p = projectPartSchema.safeParse(part);
  if (!p.success) return { ok: false, error: "Partie inconnue" };
  const schema = { brief: briefSchema, lexique: lexiqueSchema, maquettes: maquettesSchema }[p.data];
  const value = schema.parse(data);
  const supabase = await db();
  const { error } = await supabase.from("design_projects").update({ [p.data]: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function savePrompt(input: unknown): Promise<ActionResult> {
  const parsed = savePromptSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Prompt invalide" };
  const supabase = await db();
  const { error } = await supabase.from("prompt_history").insert({
    project_id: parsed.data.projectId,
    kind: parsed.data.kind,
    label: parsed.data.label ?? null,
    prompt: parsed.data.prompt,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listPrompts(projectId: string): Promise<PromptHistoryRow[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("prompt_history")
    .select("id, project_id, kind, label, prompt, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return [];
  return data as PromptHistoryRow[];
}

export async function countPrompts(): Promise<Record<string, number>> {
  const supabase = await db();
  const { data } = await supabase.from("prompt_history").select("project_id").eq("kind", "maquette");
  const counts: Record<string, number> = {};
  (data as { project_id: string }[] | null)?.forEach((r) => {
    counts[r.project_id] = (counts[r.project_id] ?? 0) + 1;
  });
  return counts;
}
