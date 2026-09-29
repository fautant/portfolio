"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { isAdminEmail } from "@/lib/auth/admin";

export interface LoginState {
  status: "idle" | "sent" | "error";
  message: string;
}

const emailSchema = z.string().trim().email();
const NEUTRAL = "Si cette adresse est autorisée, un lien de connexion vient d'être envoyé.";

export async function requestLoginLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { status: "error", message: "Adresse email invalide." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Supabase n'est pas configuré (variables d'environnement manquantes)." };
  }

  // Message identique dans tous les cas pour ne pas révéler l'email admin.
  if (isAdminEmail(parsed.data)) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    const rawNext = String(formData.get("next") ?? "/outils");
    const next = rawNext.startsWith("/outils") ? rawNext : "/outils";
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${proto}://${host}/outils/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) console.error("[outils] signInWithOtp:", error.message);
  }
  return { status: "sent", message: NEUTRAL };
}

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});
const BAD_CREDENTIALS = "Identifiant ou mot de passe incorrect.";

export async function signInWithPassword(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { status: "error", message: BAD_CREDENTIALS };

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Supabase n'est pas configuré (variables d'environnement manquantes)." };
  }

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // Même message que ce soit le compte, le mot de passe ou l'autorisation admin qui échoue.
  if (error || !isAdminEmail(data.user?.email)) {
    if (!error) await supabase.auth.signOut();
    return { status: "error", message: BAD_CREDENTIALS };
  }

  const rawNext = String(formData.get("next") ?? "/outils");
  redirect(rawNext.startsWith("/outils") ? rawNext : "/outils");
}
