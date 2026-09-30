import Link from "next/link";

export default function OutilsHome() {
  return (
    <>
      <span className="o-tag">[ESPACE PRIVÉ]</span>
      <h1 className="o-h1">
        Mes <em>outils</em>
      </h1>
      <p className="o-lead">Les outils que j’utilise pour concevoir et prompter. Cette page n’est pas référencée et nécessite une connexion.</p>

      <section className="o-section" style={{ marginTop: 0 }}>
        <h2>Design</h2>
        <div className="o-grid">
          <Link className="o-card" href="/outils/lexique">
            <span className="n">01</span>
            <h3>Lexique du prompt design</h3>
            <p>Les 14 paramètres à donner à une IA pour concevoir une interface, avec exemples visuels et constructeur de prompt.</p>
            <span className="go">Ouvrir →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
