"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PARAMS, PRESETS, TIPS, VG } from "@/data/outils/lexique";
import type { LexiqueState } from "@/data/outils/lexique-types";
import {
  activeTensions, buildPrompt, chooseFor, deselect, emptyState, example, filled, lbl, maxOf, pad, presetState, q, select,
  selectAll, selIds, setNote, setSel, slot, surprise,
} from "@/lib/outils/lexique";
import { ThemeButton } from "../ThemeButton";
import { ParamStep, type Pending } from "./ParamStep";

const LAST = PARAMS.length + 1; // 0 = accueil, 1..14 = paramètres, 15 = finaliser
const stepName = (n: number) => (n === 0 ? "Accueil" : n === LAST ? "Finaliser" : (PARAMS[n - 1]?.title ?? ""));

export interface LexiqueAppProps {
  initialState: LexiqueState;
  initialTips: Record<string, boolean>;
  onChange?: (state: LexiqueState, tips: Record<string, boolean>) => void;
  /** Appelé quand le prompt est copié (historique) */
  onCopy?: (prompt: string) => void;
  /** Clé localStorage pour mémoriser l'étape courante */
  stepKey: string;
  brandSub?: string;
  links?: { href: string; label: string }[];
  status?: ReactNode;
}

export function LexiqueApp({ initialState, initialTips, onChange, onCopy, stepKey, brandSub, links, status }: LexiqueAppProps) {
  const [state, setState] = useState<LexiqueState>(initialState);
  const [tipsOn, setTipsOn] = useState<Record<string, boolean>>(initialTips);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState<Pending | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [adv, setAdv] = useState<{ to: number; key: number } | null>(null);
  const advTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  const outRef = useRef<HTMLTextAreaElement>(null);

  const prompt = buildPrompt(state, tipsOn);
  const ids = selIds(state);

  /* Sauvegarde (le premier rendu ne déclenche rien) */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange?.(state, tipsOn);
  }, [state, tipsOn, onChange]);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2000);
  }, []);

  const cancelAdvance = useCallback(() => {
    if (advTimer.current) clearTimeout(advTimer.current);
    advTimer.current = null;
    setAdv(null);
  }, []);

  const goTo = useCallback(
    (raw: number) => {
      const n = Math.max(0, Math.min(LAST, Math.trunc(raw)));
      cancelAdvance();
      setPending(null);
      setStep(n);
      window.scrollTo(0, 0);
      try {
        history.replaceState(null, "", `#etape-${n}`);
        localStorage.setItem(stepKey, String(n));
      } catch {
        /* stockage indisponible */
      }
    },
    [cancelAdvance, stepKey],
  );

  /* Étape de départ : #etape-n dans l'adresse, sinon la dernière étape visitée */
  useEffect(() => {
    let n = 0;
    const m = /etape-(\d+)/.exec(location.hash || "");
    if (m) n = Number(m[1]);
    else {
      try {
        const v = localStorage.getItem(stepKey);
        if (v !== null) n = Number(v);
      } catch {
        /* ignoré */
      }
    }
    setStep(Number.isNaN(n) ? 0 : Math.max(0, Math.min(LAST, n)));
  }, [stepKey]);

  useEffect(() => () => {
    if (advTimer.current) clearTimeout(advTimer.current);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /* Flèches gauche / droite + Échap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuilderOpen(false);
      if (e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement).closest("input,textarea")) return;
      if (e.key === "ArrowRight") goTo(step + 1);
      else if (e.key === "ArrowLeft") goTo(step - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goTo, step]);

  /* Sur petit écran, le constructeur s'ouvre sur « Finaliser » */
  useEffect(() => {
    if (step === LAST && window.innerWidth <= 1240 && ids.length) setBuilderOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const scheduleAdvance = (pid: string) => {
    const i = PARAMS.findIndex((p) => p.id === pid) + 1;
    if (i !== step) return;
    cancelAdvance();
    setAdv({ to: i + 1, key: Date.now() });
    advTimer.current = setTimeout(() => {
      setAdv(null);
      goTo(i + 1);
    }, 1500);
  };

  const toggle = (pid: string, k: string) => {
    if (pending && pending.pid === pid) setPending(null); // modification manuelle : proposition acceptée telle quelle
    const cur = slot(state, pid).sel;
    if (cur.includes(k)) {
      cancelAdvance();
      setState(deselect(state, pid, k));
      return;
    }
    const { state: ns, replaced } = select(state, pid, k);
    setState(ns);
    if (replaced.length) toast(`${q(example(pid, k)?.l ?? k)} remplace ${replaced.map(q).join(", ")}`);
    if (maxOf(pid) !== Infinity && slot(ns, pid).sel.length >= maxOf(pid)) scheduleAdvance(pid);
  };

  const autoPick = (pid: string) => {
    cancelAdvance();
    const prev = pending && pending.pid === pid ? pending.prev : [...slot(state, pid).sel];
    const { chosen, guides } = chooseFor(state, pid, true, true);
    setState(setSel(state, pid, chosen));
    setPending({ pid, prev, chosen, guides });
  };

  const onAll = (pid: string) => {
    const r = selectAll(state, pid);
    setState(r.state);
    if (r.cleared) toast("Tout désélectionné");
    else
      toast(
        r.skipped.length
          ? `${r.count} sélectionnés · non retenu${r.skipped.length > 1 ? "s" : ""} car en contradiction avec tes choix : ${r.skipped.map((k) => q(example(pid, k)?.l ?? k)).join(", ")}`
          : `Les ${r.count} éléments sont sélectionnés`,
      );
  };

  const copy = (text: string) => {
    if (!text) {
      toast("Sélectionne au moins un exemple");
      return;
    }
    const done = () => {
      toast("Prompt copié dans le presse-papiers");
      onCopy?.(text);
    };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch {
        toast("Copie impossible : sélectionne le texte manuellement");
      }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  };

  /* ---------- Valeurs dérivées ---------- */
  const doneCount = PARAMS.filter((p) => filled(state, p.id)).length;
  const missing = PARAMS.length - doneCount;
  const tens = activeTensions(state);
  const nt = TIPS.filter((t) => tipsOn[t.k]).length;
  let count = 0;
  PARAMS.forEach((p) => {
    const st = slot(state, p.id);
    count += st.sel.length + (st.note.trim() ? 1 : 0);
  });

  const pendingIdx = pending ? PARAMS.findIndex((p) => p.id === pending.pid) : -1;
  const pendingParam = pendingIdx >= 0 ? PARAMS[pendingIdx] : undefined;

  return (
    <div className="lex">
      <div className="app">
        <nav className="nav" aria-label="Sommaire">
          <p className="brand">Lexique du prompt design</p>
          <p className="brand-sub">{brandSub ?? "14 paramètres pour briefer une IA"}</p>
          {links?.map((l) => (
            <Link key={l.href} className="home-link" href={l.href}>
              {l.label}
            </Link>
          ))}
          <div className="prog" aria-live="polite">
            <span>
              {doneCount}/{PARAMS.length} étapes validées
            </span>
            <i>
              <b style={{ width: `${(doneCount / PARAMS.length) * 100}%` }} />
            </i>
          </div>
          <ol>
            <li>
              <a href="#etape-0" className={step === 0 ? "active" : ""} aria-current={step === 0 ? "step" : undefined} onClick={(e) => { e.preventDefault(); setBuilderOpen(false); goTo(0); }}>
                <span>—</span>Accueil &amp; exemples
              </a>
            </li>
            {PARAMS.map((p, i) => {
              const ok = filled(state, p.id);
              return (
                <li key={p.id}>
                  <a
                    href={`#etape-${i + 1}`}
                    className={`${step === i + 1 ? "active" : ""} ${ok ? "done" : ""}`}
                    aria-current={step === i + 1 ? "step" : undefined}
                    onClick={(e) => { e.preventDefault(); setBuilderOpen(false); goTo(i + 1); }}
                  >
                    <span>{ok ? "✓" : pad(i + 1)}</span>
                    {p.title}
                  </a>
                </li>
              );
            })}
            <li>
              <a href={`#etape-${LAST}`} className={step === LAST ? "active" : ""} aria-current={step === LAST ? "step" : undefined} onClick={(e) => { e.preventDefault(); setBuilderOpen(false); goTo(LAST); }}>
                <span>→</span>Finaliser
              </a>
            </li>
          </ol>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22, flexWrap: "wrap" }}>
            <ThemeButton className="theme-btn" style={{ marginTop: 0, flex: 1 }} />
          </div>
          {status && <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-3)" }}>{status}</div>}
        </nav>

        <main id="main">
          {step === 0 && (
            <>
              <section className="hero is-current" id="intro">
                <h1>
                  Ce qu’il faut <em>dire</em> à une IA pour obtenir un vrai design
                </h1>
                <p>
                  « Moderne et épuré », c’est ce que l’IA fait déjà par défaut. Pour obtenir une direction artistique originale, il faut des mots précis, des valeurs concrètes (codes hex, tailles, durées) et des références. Chaque paramètre ci-dessous est expliqué, puis illustré par des exemples que tu peux reprendre tels quels.
                </p>
                <div className="formula">
                  {PARAMS.map((p, i) => (
                    <span key={p.id} style={{ display: "contents" }}>
                      {i > 0 && <span className="plus">+</span>}
                      <a href={`#etape-${i + 1}`} className={p.added ? "new" : ""} onClick={(e) => { e.preventDefault(); goTo(i + 1); }}>
                        [{p.tag}]
                      </a>
                    </span>
                  ))}
                </div>
                <div className="steps">
                  <div className="step">
                    <b>01 — PARCOURIR</b>
                    <p>Lis ce que contrôle chaque paramètre et regarde les aperçus visuels. Les démos d’interaction réagissent à la souris.</p>
                  </div>
                  <div className="step">
                    <b>02 — SÉLECTIONNER</b>
                    <p>Clique sur les exemples qui te parlent (+). Ajoute ta propre précision sous chaque section.</p>
                  </div>
                  <div className="step">
                    <b>03 — COPIER</b>
                    <p>Le panneau « Ton prompt » assemble tout dans le bon format. Copie-le, puis colle-le dans Claude Design.</p>
                  </div>
                </div>
                <p className="legend">
                  <span className="dash">[pointillés]</span> = paramètres ajoutés à ta formule d’origine, recommandés dans les guides de prompting UI.
                </p>
                <div className="rules">
                  <div className="r1"><b>Choix limités</b>Chaque paramètre a un maximum (1/2, 2/3…). Une sélection de trop remplace la plus ancienne.</div>
                  <div className="r2"><b>Contradictions</b>Deux choix impossibles à tenir ensemble (angles vifs + très arrondi) se remplacent automatiquement.</div>
                  <div className="r3"><b>Tensions</b>Un mélange audacieux mais possible est signalé en orange. À toi de préciser ce qui domine.</div>
                </div>
              </section>
              <section className="block is-current" id="presets-sec">
                <span className="tag">[EXEMPLES COMPLETS]</span>
                <h2>Trois directions pour un portfolio</h2>
                <p className="lead" style={{ marginTop: 12 }}>
                  Trois prompts complets et très différents, construits avec les paramètres de cette page. Charge-en un dans le constructeur, puis modifie-le paramètre par paramètre.
                </p>
                <div className="presets">
                  {PRESETS.map((pr) => {
                    const cols = example("color", pr.sel.color?.[0] ?? "")?.pv?.c ?? [];
                    return (
                      <article className="preset" key={pr.name}>
                        <div className="pv" dangerouslySetInnerHTML={{ __html: VG[pr.vg] ?? "" }} />
                        <div className="preset-body">
                          <h3>{pr.name}</h3>
                          <div className="sw">{cols.map((c) => <i key={c} style={{ background: c }} />)}</div>
                          <p>{pr.desc}</p>
                          <div className="row">
                            <button className="btn accent" type="button" onClick={() => { setState(presetState(pr.sel)); goTo(LAST); toast("Exemple chargé : modifie une étape via le menu"); }}>
                              Charger dans le constructeur
                            </button>
                            <button className="btn" type="button" onClick={() => copy(buildPrompt(presetState(pr.sel), tipsOn))}>
                              Copier
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="step-nav">
                  <span />
                  <button className="btn primary" type="button" onClick={() => goTo(1)}>
                    Commencer par l’étape 1 : Type &amp; contexte →
                  </button>
                </div>
              </section>
            </>
          )}

          {step >= 1 && step <= PARAMS.length && PARAMS[step - 1] && (
            <ParamStep
              key={PARAMS[step - 1]!.id}
              index={step - 1}
              param={PARAMS[step - 1]!}
              state={state}
              pending={pending}
              onToggle={toggle}
              onNote={(pid, v) => { cancelAdvance(); setState((s) => setNote(s, pid, v)); }}
              onAuto={autoPick}
              onAll={onAll}
              onPrev={() => goTo(step - 1)}
              onNext={() => goTo(step + 1)}
            />
          )}

          {step === LAST && (
            <>
              <section className="block is-current" id="final">
                <span className="tag">[FINALISER]</span>
                <h2>{!doneCount ? "Rien de sélectionné pour l’instant" : missing ? `Ton prompt est prêt à ${Math.round((doneCount / PARAMS.length) * 100)} %` : "Ton prompt est prêt"}</h2>
                <p className="lead" style={{ marginTop: 12 }}>
                  {missing
                    ? `${doneCount} étape${doneCount > 1 ? "s" : ""} sur ${PARAMS.length} remplie${doneCount > 1 ? "s" : ""}. Tu peux copier le prompt tel quel, ou compléter les étapes restantes.`
                    : "Les 14 étapes sont remplies. Copie le prompt et colle-le dans Claude Design."}
                </p>
                <div className="recap">
                  {PARAMS.map((p, i) => {
                    const ok = filled(state, p.id);
                    const labels = slot(state, p.id).sel.map((k) => example(p.id, k)?.l ?? k).join(", ");
                    return (
                      <button key={p.id} type="button" className={`rc ${ok ? "ok" : ""}`} onClick={() => goTo(i + 1)}>
                        <span>{ok ? "✓" : pad(i + 1)}</span>
                        {p.title}
                        <em>{ok ? labels || "Précision libre" : "À compléter"}</em>
                      </button>
                    );
                  })}
                </div>
                <div className="row">
                  <button className="btn primary" type="button" onClick={() => copy(prompt)}>Copier le prompt</button>
                  <button className="btn" type="button" onClick={() => { setBuilderOpen(true); outRef.current?.focus(); }}>Voir le prompt complet</button>
                </div>
              </section>
              <section className="block is-current" id="tips" style={{ marginTop: 48 }}>
                <span className="tag">[MÉTHODE]</span>
                <h2>Astuces pour de meilleurs résultats</h2>
                <p className="lead" style={{ marginTop: 12 }}>Même un prompt riche peut donner un résultat générique. Ces réflexes font la différence.</p>
                <div className={`tips-banner ${nt ? "" : "none"}`} role="status">
                  {nt ? (
                    <>
                      <strong>✓ {nt} consigne{nt > 1 ? "s" : ""} sur {TIPS.length} intégrée{nt > 1 ? "s" : ""} automatiquement à ton prompt</strong>
                      Elles apparaissent à la fin, dans un bloc [MÉTHODE]. Clique sur une carte pour la retirer ou la remettre.
                    </>
                  ) : (
                    <>
                      <strong>Aucune consigne intégrée</strong>
                      Clique sur une carte pour l’ajouter au bloc [MÉTHODE] de ton prompt.
                    </>
                  )}
                </div>
                <div className="tips">
                  {TIPS.map((t, i) => {
                    const on = !!tipsOn[t.k];
                    return (
                      <button
                        key={t.k}
                        className={`tip-card ${on ? "" : "off"}`}
                        type="button"
                        aria-pressed={on}
                        onClick={() => { setTipsOn({ ...tipsOn, [t.k]: !on }); toast(!on ? "Consigne ajoutée au prompt" : "Consigne retirée du prompt"); }}
                      >
                        <b><span>{pad(i + 1)}</span>{t.t}</b>
                        {t.d}
                        <em>Ajouté au prompt : « {t.p} »</em>
                        <span className="tip-state">{on ? "✓ Inclus dans le prompt" : "Non inclus — clique pour l’ajouter"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="step-nav">
                  <button className="btn" type="button" onClick={() => goTo(step - 1)}>← Étape précédente</button>
                  <span />
                </div>
              </section>
            </>
          )}
        </main>

        <aside className={`builder ${builderOpen ? "open" : ""}`} aria-label="Constructeur de prompt">
          <div className="b-head">
            <h2>Ton prompt</h2>
            <span className="b-count">{count} élément{count > 1 ? "s" : ""}</span>
            <button className="b-close" type="button" aria-label="Fermer" onClick={() => setBuilderOpen(false)}>×</button>
          </div>
          <div className="b-chips">
            {count === 0 && <p className="b-empty">Aucun élément pour l’instant. Clique sur les exemples (+) ou charge un exemple complet.</p>}
            {PARAMS.filter((p) => slot(state, p.id).sel.length || slot(state, p.id).note.trim()).map((p) => {
              const st = slot(state, p.id);
              const note = st.note.trim();
              return (
                <div className="b-group" key={p.id}>
                  <b>[{p.tag}]</b>
                  <div>
                    {st.sel.map((k) => (
                      <span className="chip" key={k}>
                        {example(p.id, k)?.l}
                        <button type="button" aria-label={`Retirer ${example(p.id, k)?.l}`} onClick={() => toggle(p.id, k)}>✕</button>
                      </span>
                    ))}
                    {note && (
                      <span className="chip">
                        « {note.slice(0, 28)}{note.length > 28 ? "…" : ""} »
                        <button type="button" aria-label="Retirer la précision" onClick={() => setState(setNote(state, p.id, ""))}>✕</button>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`coh ${!ids.length ? "" : tens.length ? "warn" : "ok"}`} aria-live="polite">
            {ids.length > 0 && (tens.length ? (
              <>
                <strong>⚠ {tens.length} tension{tens.length > 1 ? "s" : ""} à arbitrer</strong>
                <ul>
                  {tens.map(([a, b, m]) => (
                    <li key={a + b}>{q(lbl(a))} + {q(lbl(b))} <span>: {m}</span></li>
                  ))}
                </ul>
                <p>Précise dans ta note ce qui domine, ou retire l’un des deux.</p>
              </>
            ) : (
              <>
                <strong>✓ Sélection cohérente</strong>Aucune contradiction ni tension détectée.
              </>
            ))}
          </div>
          <a className="b-tips" href={`#etape-${LAST}`} onClick={(e) => { e.preventDefault(); goTo(LAST); }}>
            {nt ? `+ ${nt} consigne${nt > 1 ? "s" : ""} de méthode intégrée${nt > 1 ? "s" : ""} au prompt (voir les astuces)` : "Aucune consigne de méthode intégrée (voir les astuces)"}
          </a>
          <textarea className="out" ref={outRef} readOnly aria-label="Prompt généré" value={prompt} placeholder="Le prompt assemblé apparaîtra ici." />
          <div className="b-actions">
            <button className="btn primary" type="button" onClick={() => copy(prompt)}>Copier le prompt</button>
            <button className="btn" type="button" onClick={() => { setState(surprise(state)); goTo(LAST); toast("Nouvelle combinaison cohérente tirée au sort"); }}>Surprends-moi</button>
            <button className="btn" type="button" onClick={() => { setState(emptyState()); toast("Constructeur vidé"); }}>Réinitialiser</button>
          </div>
          <p className="b-hint">« Surprends-moi » tire une combinaison au hasard. Parfait pour sortir de tes habitudes, quitte à retoucher ensuite.</p>
        </aside>
      </div>

      <button className="fab" type="button" onClick={() => setBuilderOpen(true)}>
        Ton prompt <span>{count}</span>
      </button>
      <div className={`toast ${toastMsg ? "show" : ""}`} role="status" aria-live="polite">{toastMsg}</div>

      <div className={`confirm ${pending ? "show" : ""}`} role="dialog" aria-live="polite" aria-label="Valider la proposition">
        {pending && pendingParam && (
          <>
            <div className="cfm-txt">
              <strong>Proposition pour « {pendingParam.title} » ({pending.chosen.length} choix)</strong>
              {pending.chosen.map((k) => example(pending.pid, k)?.l).join(" · ")}
              {pending.guides.length > 0 && <small>En cohérence avec {pending.guides.map((id) => q(lbl(id))).join(", ")}</small>}
            </div>
            <div className="cfm-actions">
              <button className="btn accent" type="button" onClick={() => { setPending(null); goTo(pendingIdx + 2); }}>
                {pendingIdx < PARAMS.length - 1 ? `Valider et passer à « ${PARAMS[pendingIdx + 1]?.title} »` : "Valider et finaliser"}
              </button>
              <button className="btn" type="button" onClick={() => autoPick(pending.pid)}>Autre proposition</button>
              <button className="btn" type="button" onClick={() => { setState(setSel(state, pending.pid, pending.prev)); setPending(null); toast("Proposition annulée"); }}>Annuler</button>
            </div>
          </>
        )}
      </div>

      <div className={`autoadv ${adv ? "show run" : ""}`} key={adv?.key} role="status" aria-live="polite">
        <span>{adv ? `Passage à « ${stepName(adv.to)} »…` : ""}</span>
        <button type="button" onClick={() => { cancelAdvance(); toast("Passage annulé : tu restes sur cette étape"); }}>Annuler</button>
        <i><b /></i>
      </div>
    </div>
  );
}

