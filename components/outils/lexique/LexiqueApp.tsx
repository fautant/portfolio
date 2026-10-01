"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GLOBAL_IDS, LETTERS, LOCAL_IDS } from "@/data/outils/lexique-v2";
import type { LexiqueV2State, Mode } from "@/data/outils/lexique-types";
import {
  allBricks, autoGlobal, builderCoh, catOf, edit, elCurrentPrompt, elementOf, emptyEl, example, finalPrompt, fresh, gFilled, gSlot,
  globalPrompt, lbl, locate, pad, paramOf, q, selectAllGlobal, setGlobalNote, setMode, stepName, steps, surpriseEl, surpriseGlobal,
  toggleGlobal, variantOf, type Result,
} from "@/lib/outils/lexique";
import { ThemeButton } from "../ThemeButton";
import { ElementStep } from "./ElementStep";
import { FinalStep } from "./FinalStep";
import { ParamStep } from "./ParamStep";
import { StructureStep } from "./StructureStep";

export interface LexiqueAppProps {
  initialState: LexiqueV2State;
  onChange?: (state: LexiqueV2State) => void;
  links?: { href: string; label: string }[];
}

interface Group {
  tag: string;
  items: string[];
}

export function LexiqueApp({ initialState, onChange, links }: LexiqueAppProps) {
  const [state, setState] = useState<LexiqueV2State>(initialState);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  /* Sauvegarde (le premier rendu ne déclenche rien) */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange?.(state);
  }, [state, onChange]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  /** Applique un nouvel état (ou le résultat d'une action, avec son message) */
  const apply = (r: LexiqueV2State | Result) => {
    if ("v" in r) setState(r);
    else {
      setState(r.state);
      if (r.msg) toast(r.msg);
    }
  };

  const keys = steps(state);
  const step = keys.includes(state.step) ? state.step : "home";
  const si = keys.indexOf(step);
  const prevKey = keys[Math.max(0, si - 1)]!;
  const nextKey = keys[Math.min(keys.length - 1, si + 1)]!;

  const go = useCallback((key: string) => {
    setState((s) => edit(s, (x) => void (x.step = key)));
    setBuilderOpen(false);
    window.scrollTo(0, 0);
  }, []);

  /* Flèches gauche / droite + Échap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuilderOpen(false);
      if (e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement).closest("input,textarea")) return;
      if (e.key === "ArrowRight" && nextKey !== step) go(nextKey);
      else if (e.key === "ArrowLeft" && prevKey !== step) go(prevKey);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, nextKey, prevKey, step]);

  const copy = (text: string, msg = "Prompt copié dans le presse-papiers") => {
    if (!text) {
      toast("Rien à copier pour l’instant");
      return;
    }
    const done = () => toast(msg);
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

  const onMode = (m: Mode) => apply(setMode(state, m));

  /* ---------- Valeurs dérivées ---------- */
  const bricks = allBricks(state);
  const loc = locate(state);
  const multi = state.mode === "multi";
  const doneEls = bricks.filter((b) => state.el[b.uid]?.done).length;
  const gDone = GLOBAL_IDS.filter((pid) => gFilled(state, pid)).length;
  const total = GLOBAL_IDS.length + 1 + bricks.length;
  const doneAll = gDone + (bricks.length ? 1 : 0) + doneEls;
  const elUid = step.startsWith("el:") && loc[step.slice(3)] ? step.slice(3) : null;

  /* ---------- Constructeur (panneau droit) ---------- */
  let aside: { title: string; sub: string; groups: Group[]; empty: string; prompt: string; copyLabel: string; onCopy: () => void; onSurprise: () => void; resetLabel: string; onReset: () => void; hint: string };
  if (elUid) {
    const ek = loc[elUid]!.k;
    const e = elementOf(ek);
    const d = state.el[elUid] ?? emptyEl();
    const groups: Group[] = [];
    if (d.v.length)
      groups.push({
        tag: d.cmp ? (d.pick ? "[VARIANTE RETENUE]" : "[VARIANTES À COMPARER]") : "[VARIANTE]",
        items: d.cmp && d.pick ? [variantOf(ek, d.pick)?.l ?? d.pick] : d.v.map((k, j) => (d.cmp ? `${LETTERS[j]} · ` : "") + (variantOf(ek, k)?.l ?? k)),
      });
    if (d.c.length) groups.push({ tag: "[CONTENU]", items: d.c });
    LOCAL_IDS.forEach((pid) => {
      const sel = d.p[pid] ?? [];
      if (sel.length) groups.push({ tag: `[${paramOf(pid).tag}]`, items: sel.map((k) => example(pid, k)?.l ?? k) });
    });
    if (d.note.trim()) groups.push({ tag: "[PRÉCISION]", items: [d.note.trim().slice(0, 40)] });
    const prompt = elCurrentPrompt(state, elUid);
    aside = {
      title: e.l,
      sub: "Prompt Claude Design de cet élément. La direction globale y est incluse.",
      groups,
      empty: "Aucun choix spécifique : le prompt laisse Claude Design décider, dans le cadre de la direction globale.",
      prompt,
      copyLabel: d.cmp ? (d.pick ? "Copier le prompt d’affinage" : "Copier le prompt d’exploration") : "Copier le prompt de l’élément",
      onCopy: () => copy(prompt, `Prompt ${q(e.l)} copié`),
      onSurprise: () => apply(surpriseEl(state, elUid, ek)),
      resetLabel: "Vider l’élément",
      onReset: () => { apply(edit(state, (s) => void (s.el[elUid] = emptyEl()))); toast("Élément vidé"); },
      hint: d.cmp
        ? d.pick
          ? "Affinage : à coller dans la même conversation que l’exploration."
          : "Exploration : une proposition par variante cochée, étiquetées A, B, C…"
        : "Le prompt demande 3 directions contrastées. Colle ensuite celle que tu retiens dans l’étape 02.",
    };
  } else if (step === "final") {
    const prompt = finalPrompt(state);
    aside = {
      title: "Claude Code",
      sub: "Direction globale, architecture, spécifications et designs retenus.",
      groups: state.pages
        .filter((p) => p.bricks.length)
        .map((p) => ({ tag: multi ? p.name : "Page unique", items: p.bricks.map((b) => ((state.el[b.uid]?.design ?? "").trim() ? "✓ " : "") + elementOf(b.k).l) })),
      empty: "Aucune brique : construis la structure pour générer le prompt final.",
      prompt,
      copyLabel: "Copier le prompt Claude Code",
      onCopy: () => copy(prompt, "Prompt Claude Code copié"),
      onSurprise: () => apply(surpriseGlobal(state)),
      resetLabel: "Revoir la structure",
      onReset: () => go("structure"),
      hint: "Le design collé pour chaque élément est transmis tel quel, entre triples guillemets.",
    };
  } else {
    const prompt = globalPrompt(state);
    aside = {
      title: "Direction globale",
      sub: "Incluse automatiquement dans chaque prompt d’élément et dans le prompt final.",
      groups: GLOBAL_IDS.flatMap((pid) => {
        const sl = gSlot(state, pid);
        if (pid === "type") return [{ tag: "[TYPE]", items: ["Portfolio", "Développeur fullstack", ...(state.mode ? [multi ? "Multi-pages" : "One-page"] : [])] }];
        const items = [...sl.sel.map((k) => lbl(pid === "sys" ? k : `${pid}.${k}`)), ...(sl.note.trim() ? [q(sl.note.trim().slice(0, 28))] : [])];
        return items.length ? [{ tag: `[${paramOf(pid).tag}]`, items }] : [];
      }),
      empty: "Aucun élément pour l’instant. Clique sur les exemples (+) des étapes globales.",
      prompt,
      copyLabel: "Copier la direction globale",
      onCopy: () => copy(prompt),
      onSurprise: () => apply(surpriseGlobal(state)),
      resetLabel: "Réinitialiser",
      onReset: () => { setState(fresh()); toast("Tout est réinitialisé"); },
      hint: "« Surprends-moi » tire une direction globale au hasard, quitte à retoucher ensuite.",
    };
  }
  const asideNum = aside.groups.reduce((t, g) => t + g.items.length, 0);
  const coh = builderCoh(state, step);

  const navLink = (key: string, label: ReactNode, mark: string, ok = false) => (
    <a
      href={`#${key.replace(":", "-")}`}
      className={`${step === key ? "active" : ""} ${ok ? "done" : ""}`}
      aria-current={step === key ? "step" : undefined}
      onClick={(e) => { e.preventDefault(); go(key); }}
    >
      <span>{mark}</span>
      {label}
    </a>
  );

  return (
    <div className="lex">
      <div className="app">
        <nav className="nav" aria-label="Sommaire">
          <p className="brand">Lexique du prompt design</p>
          <p className="brand-sub">Global → structure → éléments → code</p>
          {links?.map((l) => (
            <Link key={l.href} className="home-link" href={l.href}>
              {l.label}
            </Link>
          ))}
          <div className="prog" aria-live="polite">
            <span>
              {doneAll}/{total} étapes validées
            </span>
            <i>
              <b style={{ width: `${(doneAll / total) * 100}%` }} />
            </i>
          </div>
          <div className="nav-steps">
            <ol>
              <li>{navLink("home", "Accueil", "—")}</li>
            </ol>
            <b className="nav-group">01 · Global</b>
            <ol>
              {GLOBAL_IDS.map((pid, i) => {
                const ok = gFilled(state, pid);
                return <li key={pid}>{navLink(`g:${pid}`, paramOf(pid).title, ok ? "✓" : pad(i + 1), ok)}</li>;
              })}
            </ol>
            <b className="nav-group">02 · Structure</b>
            <ol>
              <li>{navLink("structure", "Empiler les briques", bricks.length ? "✓" : "··", bricks.length > 0)}</li>
            </ol>
            <b className="nav-group">03 · Éléments</b>
            {!bricks.length && <p className="nav-empty">Les éléments apparaîtront ici une fois la structure construite.</p>}
            {state.pages
              .filter((p) => p.bricks.length)
              .map((p) => (
                <div className="nav-page" key={p.id}>
                  {multi && <span className="nav-page-name">{p.name}</span>}
                  <ol>
                    {p.bricks.map((b) => {
                      const ok = !!state.el[b.uid]?.done;
                      const key = `el:${b.uid}`;
                      return (
                        <li key={b.uid}>
                          <a
                            href={`#el-${b.uid}`}
                            className={`nav-el ${step === key ? "active" : ""} ${ok ? "done" : ""}`}
                            aria-current={step === key ? "step" : undefined}
                            onClick={(e) => { e.preventDefault(); go(key); }}
                          >
                            <i className="sq" style={{ background: catOf(b.k).c }} />
                            {elementOf(b.k).l}
                            <span className="mk">{ok ? "✓" : ""}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            <b className="nav-group">04 · Code</b>
            <ol>
              <li>{navLink("final", "Prompt Claude Code", "→")}</li>
            </ol>
          </div>
          <ThemeButton className="theme-btn" />
        </nav>

        <main id="main">
          {step === "home" && (
            <section className="hero is-current" id="intro">
              <h1>
                Ton portfolio, <em>brique</em> par brique
              </h1>
              <p>
                Fixe d’abord la direction globale du site. Empile ensuite les sections de chaque page. Conçois chaque élément avec Claude Design, un prompt à la fois. À la fin, un prompt unique rassemble tout pour que Claude Code le code.
              </p>
              <div className="steps four">
                <div className="step">
                  <b>01 — GLOBAL</b>
                  <p>Type, style, typographie, couleurs, système de mise en page… {GLOBAL_IDS.length} paramètres communs à tout le site.</p>
                </div>
                <div className="step">
                  <b>02 — STRUCTURE</b>
                  <p>Empile les briques (hero, projets, contact…) sur le plateau de chaque page.</p>
                </div>
                <div className="step">
                  <b>03 — ÉLÉMENTS</b>
                  <p>Pour chaque brique : variante, contenu, composition, interactions. Un prompt Claude Design par élément.</p>
                </div>
                <div className="step">
                  <b>04 — CODE</b>
                  <p>Colle le design retenu de chaque élément, puis copie le prompt final pour Claude Code.</p>
                </div>
              </div>
              <div className="step-nav">
                <span />
                <button className="btn primary" type="button" onClick={() => go(`g:${GLOBAL_IDS[0]}`)}>
                  Commencer : {paramOf(GLOBAL_IDS[0]!).title} →
                </button>
              </div>
            </section>
          )}

          {step.startsWith("g:") && (
            <ParamStep
              key={step}
              pid={step.slice(2)}
              state={state}
              step={step}
              onToggle={(pid, k) => apply(toggleGlobal(state, pid, k))}
              onNote={(pid, v) => apply(setGlobalNote(state, pid, v))}
              onAuto={(pid) => apply(autoGlobal(state, pid))}
              onAll={(pid) => apply(selectAllGlobal(state, pid))}
              onMode={onMode}
              onToast={toast}
              onGo={go}
              onPrev={() => go(prevKey)}
              onNext={() => go(nextKey)}
              prevName={stepName(state, prevKey)}
              nextName={stepName(state, nextKey)}
            />
          )}

          {step === "structure" && (
            <StructureStep
              state={state}
              apply={apply}
              onMode={onMode}
              onToast={toast}
              onPrev={() => go(prevKey)}
              onNext={() => go(nextKey)}
              prevName={stepName(state, prevKey)}
            />
          )}

          {elUid && (
            <ElementStep
              key={elUid}
              state={state}
              uid={elUid}
              step={step}
              nextKey={nextKey}
              nextName={stepName(state, nextKey)}
              prevName={stepName(state, prevKey)}
              apply={apply}
              onToast={toast}
              onGo={go}
              onCopy={copy}
              onPrev={() => go(prevKey)}
              onNext={() => go(nextKey)}
            />
          )}

          {step === "final" && <FinalStep state={state} apply={apply} onGo={go} onCopy={copy} onPrev={() => go(prevKey)} prevName={stepName(state, prevKey)} />}
        </main>

        <aside className={`builder ${builderOpen ? "open" : ""}`} aria-label="Constructeur de prompt">
          <div className="b-head">
            <h2>{aside.title}</h2>
            <span className="b-count">
              {asideNum} élément{asideNum > 1 ? "s" : ""}
            </span>
            <button className="b-close" type="button" aria-label="Fermer" onClick={() => setBuilderOpen(false)}>
              ×
            </button>
          </div>
          <p className="b-sub">{aside.sub}</p>
          <div className="b-chips">
            {!aside.groups.length && <p className="b-empty">{aside.empty}</p>}
            {aside.groups.map((g) => (
              <div className="b-group" key={g.tag}>
                <b>{g.tag}</b>
                <div>
                  {g.items.map((it, i) => (
                    <span className="chip plain" key={i}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {coh.show && (
            <div className={`coh ${coh.items.length ? "warn" : "ok"}`} aria-live="polite">
              {coh.items.length ? (
                <>
                  <strong>
                    ⚠ {coh.items.length} point{coh.items.length > 1 ? "s" : ""} à arbitrer
                  </strong>
                  <ul>
                    {coh.items.map((ci, i) => (
                      <li key={i}>
                        {ci.pair} <span>: {ci.m}</span>
                        {ci.links.map((lk) => (
                          <button key={lk.key} type="button" className="coh-go" title="Aller à cette étape" onClick={() => go(lk.key)}>
                            {lk.name} →
                          </button>
                        ))}
                      </li>
                    ))}
                  </ul>
                  <p>Précise dans ta note ce qui domine, ou retire l’un des deux.</p>
                </>
              ) : (
                <>
                  <strong>✓ Sélection cohérente</strong>Aucune contradiction ni tension détectée.
                </>
              )}
            </div>
          )}
          <textarea className="out" readOnly aria-label="Prompt généré" value={aside.prompt} placeholder="Le prompt assemblé apparaîtra ici." />
          <div className="b-actions">
            <button className="btn primary" type="button" onClick={aside.onCopy}>
              {aside.copyLabel}
            </button>
            <button className="btn" type="button" onClick={aside.onSurprise}>
              Surprends-moi
            </button>
            <button className="btn" type="button" onClick={aside.onReset}>
              {aside.resetLabel}
            </button>
          </div>
          <p className="b-hint">{aside.hint}</p>
        </aside>
      </div>

      <button className="fab" type="button" onClick={() => setBuilderOpen(true)}>
        Ton prompt <span>{asideNum}</span>
      </button>
      <div className={`toast ${toastMsg ? "show" : ""}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </div>
  );
}
