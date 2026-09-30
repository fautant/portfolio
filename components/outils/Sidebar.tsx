"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/outils/actions-auth";
import { ThemeButton } from "./ThemeButton";

export function Sidebar() {
  const pathname = usePathname();
  const cur = (href: string) => (pathname === href ? ({ "aria-current": "page" } as const) : {});

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
              <Link href="/outils" {...cur("/outils")}>
                <span>◧</span>Tableau de bord
              </Link>
            </li>
          </ul>
        </div>
        <div className="o-nav-group" style={{ marginTop: 18 }}>
          <b>Design</b>
          <ul className="o-nav">
            <li>
              <Link href="/outils/lexique" {...cur("/outils/lexique")}>
                <span>01</span>Lexique du prompt
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
