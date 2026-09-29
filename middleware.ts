import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/config";
import { updateSession } from "./lib/auth/update-session";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// Espace privé /outils : réservé à l'admin (Supabase Auth, email = ADMIN_EMAIL).
const PUBLIC_TOOLS_PATHS = ["/outils/connexion", "/outils/auth/callback"];

async function toolsMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Anciennes URLs de la version statique
  if (pathname === "/outils/prompt-design" || pathname === "/outils/prompt-design.html") {
    return NextResponse.redirect(new URL("/outils/lexique", req.url), 308);
  }

  const { res, isAdmin } = await updateSession(req);

  if (!isAdmin && !PUBLIC_TOOLS_PATHS.includes(pathname.replace(/\/$/, ""))) {
    const login = new URL("/outils/connexion", req.url);
    if (pathname !== "/outils") login.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(login);
    res.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  }

  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/outils" || req.nextUrl.pathname.startsWith("/outils/")) {
    return toolsMiddleware(req);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\..*).*)", "/outils/:path*"],
};
