import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase-server";
import { isAdminEmail } from "./admin";

export async function getAdmin(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return isAdminEmail(data.user?.email) ? data.user : null;
}

export async function requireAdmin(): Promise<User> {
  const admin = await getAdmin();
  if (!admin) redirect("/outils/connexion");
  return admin;
}
