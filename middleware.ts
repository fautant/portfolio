import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// Espace privé /outils : protégé par HTTP Basic Auth.
// Identifiants définis dans les variables d'environnement TOOLS_USER et TOOLS_PASSWORD ;
// sans elles, l'accès est refusé à tout le monde.
function isAuthorized(req: NextRequest): boolean {
  const user = process.env.TOOLS_USER;
  const password = process.env.TOOLS_PASSWORD;
  if (!user || !password) return false;

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  try {
    const [u, ...rest] = atob(header.slice(6)).split(":");
    return u === user && rest.join(":") === password;
  } catch {
    return false;
  }
}

function toolsMiddleware(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse("Accès réservé.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Outils", charset="UTF-8"',
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // URLs propres : /outils → /outils/index.html, /outils/prompt-design → /outils/prompt-design.html
  const { pathname } = req.nextUrl;
  let res: NextResponse;
  if (pathname === "/outils" || pathname === "/outils/") {
    res = NextResponse.rewrite(new URL("/outils/index.html", req.url));
  } else if (!pathname.split("/").pop()?.includes(".")) {
    res = NextResponse.rewrite(new URL(`${pathname.replace(/\/$/, "")}.html`, req.url));
  } else {
    res = NextResponse.next();
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
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/outils/:path*"],
};
