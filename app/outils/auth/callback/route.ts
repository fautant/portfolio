import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { isAdminEmail } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/outils";
  const next = rawNext.startsWith("/outils") ? rawNext : "/outils";
  const fail = NextResponse.redirect(`${origin}/outils/connexion?erreur=1`);

  const supabase = await createSupabaseServerClient();
  if (!supabase || !code) return fail;

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut();
    return fail;
  }
  return NextResponse.redirect(`${origin}${next}`);
}
