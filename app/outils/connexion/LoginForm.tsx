"use client";

import { useActionState, useState } from "react";
import { requestLoginLink, signInWithPassword, type LoginState } from "./actions";

const INITIAL: LoginState = { status: "idle", message: "" };

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signInWithPassword, INITIAL);
  const [linkState, linkAction, linkPending] = useActionState(requestLoginLink, INITIAL);
  const [showLink, setShowLink] = useState(false);

  return (
    <>
      <form action={action} className="o-login">
        <input type="hidden" name="next" value={next} />
        <label className="o-field">
          <span>Identifiant (email)</span>
          <input type="email" name="email" required autoComplete="username" placeholder="toi@exemple.com" />
        </label>
        <label className="o-field">
          <span>Mot de passe</span>
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <button className="o-btn primary" type="submit" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
        {state.status === "error" && (
          <p className="o-msg error" role="alert">
            {state.message}
          </p>
        )}
      </form>

      <div className="o-foot">
        {showLink ? (
          <form action={linkAction} className="o-login">
            <input type="hidden" name="next" value={next} />
            <label className="o-field">
              <span>Adresse email</span>
              <input type="email" name="email" required autoComplete="email" placeholder="toi@exemple.com" />
            </label>
            <button className="o-btn" type="submit" disabled={linkPending}>
              {linkPending ? "Envoi…" : "Recevoir un lien de connexion"}
            </button>
            {linkState.message && (
              <p className={`o-msg ${linkState.status}`} role="status">
                {linkState.message}
              </p>
            )}
          </form>
        ) : (
          <button type="button" onClick={() => setShowLink(true)} className="o-link-btn">
            Mot de passe oublié ? Recevoir un lien de connexion
          </button>
        )}
      </div>
    </>
  );
}
