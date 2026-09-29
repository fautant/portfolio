import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erreur?: string }>;
}) {
  const { next, erreur } = await searchParams;
  const target = next?.startsWith("/outils") ? next : "/outils";
  if (await getAdmin()) redirect(target);

  return (
    <main className="o-center">
      <span className="o-tag">[ESPACE PRIVÉ]</span>
      <h1 className="o-h1">
        Mes <em>outils</em>
      </h1>
      <p className="o-lead">
        Accès réservé. Connecte-toi avec ton identifiant et ton mot de passe.
      </p>
      {erreur && <p className="o-msg error">Le lien est invalide ou a expiré. Demande-en un nouveau.</p>}
      <LoginForm next={target} />
      <p className="o-foot">
        <Link href="/">← Retour au portfolio</Link>
      </p>
    </main>
  );
}
