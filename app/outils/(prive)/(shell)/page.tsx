import Link from "next/link";
import { ProjectRows } from "@/components/outils/projets/ProjectList";
import { summarize } from "@/lib/outils/summary";
import { countPrompts, listProjects } from "../actions";

export default async function OutilsHome() {
  const [projects, prompts] = await Promise.all([listProjects(), countPrompts()]);
  const recent = projects.slice(0, 4).map((p) => summarize(p, prompts));

  return (
    <>
      <span className="o-tag">[ESPACE PRIVÉ]</span>
      <h1 className="o-h1">
        Mes <em>outils</em>
      </h1>
      <p className="o-lead">Les outils que j’utilise pour concevoir et prompter. Cette page n’est pas référencée et nécessite une connexion.</p>

      <section className="o-section" style={{ marginTop: 0 }}>
        <h2>Design</h2>
        <p>Du brief à la maquette : trois outils chaînés autour d’un même projet.</p>
        <div className="o-grid">
          <Link className="o-card" href="/outils/projets">
            <span className="n">01</span>
            <h3>Projet</h3>
            <p>Détailler le projet : cible, arborescence, contenus, contraintes. Un assistant suit la complétude du brief.</p>
            <span className="go">Ouvrir →</span>
          </Link>
          <Link className="o-card" href="/outils/lexique">
            <span className="n">02</span>
            <h3>Lexique du prompt design</h3>
            <p>Les 14 paramètres à donner à une IA pour concevoir une interface, avec exemples visuels et constructeur de prompt.</p>
            <span className="go">Ouvrir →</span>
          </Link>
          <Link className="o-card" href={projects[0] ? `/outils/projets/${projects[0].id}/maquettes` : "/outils/projets"}>
            <span className="n">03</span>
            <h3>Maquette</h3>
            <p>Choisir quoi générer (une page, les pages MVP, toutes, le kit UI…) et obtenir les prompts prêts à coller.</p>
            <span className="go">{projects[0] ? "Ouvrir →" : "Créer un projet d’abord →"}</span>
          </Link>
          <div className="o-card soon" aria-hidden="true">
            <span className="n">04</span>
            <h3>Bientôt</h3>
            <p>Contenus, design tokens, moodboard, revue de maquette…</p>
          </div>
        </div>
      </section>

      <section className="o-section">
        <h2>Projets récents</h2>
        <p>
          <Link href="/outils/projets" style={{ textDecoration: "underline" }}>
            Tous les projets
          </Link>
        </p>
        <ProjectRows projects={recent} compact />
      </section>
    </>
  );
}
