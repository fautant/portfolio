"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/outils/actions-auth";
import { ThemeButton } from "./ThemeButton";

function useProjectId(): string | null {
  const m = usePathname().match(/^\/outils\/projets\/([^/]+)/);
  return m?.[1] ?? null;
}

export function Sidebar() {
  const pathname = usePathname();
  const projectId = useProjectId();
  const cur = (href: string, exact = false) =>
    (exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")) ? ({ "aria-current": "page" } as const) : {};

  return (
    <aside className="o-side" aria-label="Navigation des outils">
      <Link className="o-brand" href="/outils">
        Mes <em>outils</em>
      </Link>
      <nav>
        <div className="o-nav-group">
          <b>Général</b>
          <ul className="o-nav">
            <li>
              <Link href="/outils" {...cur("/outils", true)}>
                <span>◧</span>Tableau de bord
              </Link>
            </li>
            <li>
              <Link href="/outils/projets" {...cur("/outils/projets", !!projectId)}>
                <span>▤</span>Mes projets
              </Link>
            </li>
          </ul>
        </div>
        <div className="o-nav-group" style={{ marginTop: 18 }}>
          <b>Design</b>
          <ul className="o-nav">
            <li>
              <Link href={projectId ? `/outils/projets/${projectId}` : "/outils/projets"} {...cur(projectId ? `/outils/projets/${projectId}` : "/x", true)}>
                <span>01</span>Projet
              </Link>
            </li>
            <li>
              <Link href={projectId ? `/outils/projets/${projectId}/lexique` : "/outils/lexique"} {...(pathname.endsWith("/lexique") ? ({ "aria-current": "page" } as const) : {})}>
                <span>02</span>Lexique du prompt
              </Link>
            </li>
            <li>
              <Link
                className={projectId ? "" : "off"}
                aria-disabled={!projectId}
                tabIndex={projectId ? 0 : -1}
                href={projectId ? `/outils/projets/${projectId}/maquettes` : "/outils/projets"}
                {...(pathname.endsWith("/maquettes") ? ({ "aria-current": "page" } as const) : {})}
              >
                <span>03</span>Maquette
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="o-side-foot">
        <ThemeButton />
        <Link className="o-btn sm" href="/">
          ← Portfolio
        </Link>
        <form action={signOut}>
          <button className="o-btn sm danger" type="submit">
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
