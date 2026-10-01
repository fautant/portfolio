"use client";

import { Fragment, useEffect, useRef } from "react";
import { FORMATS, GLOBAL_IDS, PROFILES, RESULTS } from "@/data/outils/lexique-v2";
import type { Example, LexiqueV2State, Mode, Param } from "@/data/outils/lexique-types";
import {
  axesOf, axisLabel, fIds, flagOf, gIds, gSlot, gid, hardOf, maxOf, pad, paramOf, preview, previewOf, q, type Flag,
} from "@/lib/outils/lexique";
import { attachDemos } from "./demos";

/* ---------- Cartes partagées (étapes globales et paramètres d'élément) ---------- */

export function FlagLine({ flag, onGo }: { flag: Flag; onGo: (key: string) => void }) {
  return (
    <div className={`ex-flag ${flag.kind}`}>
      {flag.label}
      {flag.items.map((it, i) => (
        <Fragment key={it.l}>
          {" "}
          {it.l}
          {it.link && (
            <>
              {" "}
              <button type="button" className="flag-go" title="Aller à cette étape" onClick={() => onGo(it.link!.key)}>
                ({it.link.name} →)
              </button>
            </>
          )}
          {i < flag.items.length - 1 ? "," : ""}
        </Fragment>
      ))}
      {flag.tail}
    </div>
  );
}

interface ExCardProps {
  param: Param;
  ex: Example;
  on: boolean;
  flag: Flag | null;
  pre?: string;
  compact?: boolean;
  onToggle: () => void;
  onGo: (key: string) => void;
}

export function ExCard({ param, ex, on, flag, pre, compact, onToggle, onGo }: ExCardProps) {
  const ref = useRef<HTMLElement>(null);
  const src = previewOf(param, ex);
  const pv = preview(src.param, src.ex);
  const isDemo = src.param.kind === "demo";

  useEffect(() => {
    const el = ref.current;
    if (!isDemo || !el || el.dataset.demos) return;
    el.dataset.demos = "1";
    attachDemos(el);
  }, [isDemo]);

  return (
    <article ref={ref} className={`ex${on ? " on" : ""}${!on && flag?.blocked ? " blocked" : ""}${compact ? " ex-sm" : ""}`}>
      {pv && (
        <div
          className="pv"
          {...(isDemo ? { "data-demo": src.ex.k } : {})}
          aria-hidden={!isDemo}
          onClick={isDemo ? undefined : onToggle}
          dangerouslySetInnerHTML={{ __html: pv }}
        />
      )}
      <button className="ex-btn" type="button" aria-pressed={on} onClick={onToggle}>
        <span className="ex-l">
          {pre && <span className="ex-pre">{pre}</span>}
          {ex.l}
        </span>
        <span className="ex-add" aria-hidden="true" />
        <span className="ex-p">{ex.p}</span>
      </button>
      {flag && <FlagLine flag={flag} onGo={onGo} />}
      {ex.u && (
        <a className="ex-link" href={ex.u} target="_blank" rel="noopener noreferrer">
          Voir des exemples réels <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

export function Counter({ n, max, label = "choix" }: { n: number; max: number; label?: string }) {
  const unlimited = max === Infinity;
  const full = !unlimited && n >= max;
  return (
    <div className={`counter ${full ? "full" : n > 0 ? "some" : ""}`} aria-label={unlimited ? `${n} ${label}, sans limite` : `${n} ${label} sur ${max}`}>
      {unlimited ? (
        <>
          <b>{n}</b>
          <small>
            {label}
            <br />
            sans limite
          </small>
        </>
      ) : (
        <>
          <b>
            {n}
            <span>/{max}</span>
          </b>
          <small>{label}</small>
          <i className="dots">
            {Array.from({ length: max }, (_, j) => (
              <u key={j} className={j < n ? "on" : ""} />
            ))}
          </i>
        </>
      )}
    </div>
  );
}

export const Dice = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);

/* ---------- Étape globale ---------- */

interface ParamStepProps {
  pid: string;
  state: LexiqueV2State;
  step: string;
  onToggle: (pid: string, k: string) => void;
  onNote: (pid: string, value: string) => void;
  onAuto: (pid: string) => void;
  onAll: (pid: string) => void;
  onMode: (m: Mode) => void;
  onToast: (msg: string) => void;
  onGo: (key: string) => void;
  onPrev: () => void;
  onNext: () => void;
  prevName: string;
  nextName: string;
}

export function ParamStep({ pid, state, step, onToggle, onNote, onAuto, onAll, onMode, onToast, onGo, onPrev, onNext, prevName, nextName }: ParamStepProps) {
  const p = paramOf(pid);
  const gi = GLOBAL_IDS.indexOf(pid);
  const isType = pid === "type";
  const sl = gSlot(state, pid);
  const max = isType ? 3 : maxOf(pid);
  const unlimited = max === Infinity;
  const n = isType ? (state.mode ? 3 : 2) : sl.sel.length;
  const full = !unlimited && n >= max;
  const ids = gIds(state);
  const allOn = unlimited && n > 0 && p.ex.every((e) => sl.sel.includes(e.k) || hardOf(gid(pid, e.k)).some((o) => ids.includes(o)));

  return (
    <section className="block param is-current" id={`p-${pid}`}>
      <div className="param-head">
        <span className="num">{pad(gi + 1)}</span>
        <div>
          <span className="tag">
            Global · étape {gi + 1}/{GLOBAL_IDS.length} · [{p.tag}]
          </span>
          <h2>{p.title}</h2>
        </div>
        <Counter n={n} max={max} />
      </div>
      <p className="lead">{p.lead}</p>
      {p.axes && <Axes state={state} axes={p.axes} />}
      <div className="meta">
        <div>
          <h3>Questions à se poser</h3>
          <ul>
            {p.qs.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Exemple de formulation</h3>
          <blockquote>{p.sample}</blockquote>
        </div>
      </div>
      {p.tip && <p className="tip">{p.tip}</p>}

      {isType ? (
        <TypeGroups state={state} onMode={onMode} onToast={onToast} />
      ) : (
        <>
          <div className="toolbar">
            <button className="btn dice" type="button" onClick={() => onAuto(pid)}>
              <Dice />
              Choisir à ma place
            </button>
            {unlimited && (
              <button className="btn all" type="button" aria-pressed={allOn} onClick={() => onAll(pid)}>
                {allOn ? "Tout désélectionner" : "Tout sélectionner"}
              </button>
            )}
            <span className={`cap-mini ${full ? "full" : ""}`}>{unlimited ? `${n} choix` : `${n}/${max} choix`}</span>
            <span>Paramètre global : il s’applique à tous les éléments du portfolio.</span>
          </div>
          <div className={`grid ${p.kind === "text" ? "grid-text" : ""}`}>
            {p.ex.map((ex) => {
              const id = gid(pid, ex.k);
              const on = sl.sel.includes(ex.k);
              const first = sl.sel[0] ? gid(pid, sl.sel[0]) : null;
              return (
                <ExCard
                  key={ex.k}
                  param={p}
                  ex={ex}
                  on={on}
                  pre={pid === "avoid" ? "✕ " : undefined}
                  flag={flagOf(state, id, on, ids, fIds(state), full, first, { cur: step })}
                  onToggle={() => onToggle(pid, ex.k)}
                  onGo={onGo}
                />
              );
            })}
          </div>
        </>
      )}

      <label className="note">
        <span>Ta précision pour [{p.tag}]</span>
        <input type="text" value={sl.note} onChange={(e) => onNote(pid, e.target.value)} placeholder={`Ex. : ${p.sample.slice(0, 70)}…`} />
      </label>
      <div className="step-nav">
        <button className="btn" type="button" onClick={onPrev}>
          ← {prevName}
        </button>
        <button className="link-next" type="button" onClick={onNext}>
          Étape suivante : {nextName} →
        </button>
      </div>
    </section>
  );
}

/** Étape « Type & contexte » : type et profil verrouillés, format au choix */
function TypeGroups({ state, onMode, onToast }: { state: LexiqueV2State; onMode: (m: Mode) => void; onToast: (msg: string) => void }) {
  const locked = (title: string, hint: string, opts: [string, string, string, boolean?][]) => (
    <div className="tg">
      <div className="tg-head">
        <b>{title}</b>
        <span className="cap-mini">Verrouillé</span>
        <span className="tg-hint">{hint}</span>
      </div>
      <div className="tg-grid">
        {opts.map(([k, l, d, on]) => (
          <button
            key={k}
            type="button"
            className={`tg-opt ${on ? "on" : "soon"}`}
            aria-pressed={!!on}
            aria-disabled={!on}
            onClick={() => {
              if (!on) onToast(`${q(l)} n’est pas encore disponible`);
            }}
          >
            <span className="tg-top">
              <b>{l}</b>
              <span className="tg-badge">{on ? "✓ Retenu" : "Bientôt"}</span>
            </span>
            <span className="tg-d">{d}</span>
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="tgs">
      {locked("Type de résultat", "Les autres formats arriveront plus tard.", RESULTS)}
      {locked("Profil", "Les autres profils arriveront plus tard.", PROFILES)}
      <div className="tg">
        <div className="tg-head">
          <b>Format</b>
          <span className={`cap-mini ${state.mode ? "full" : ""}`}>{state.mode ? "1/1 choix" : "0/1 choix"}</span>
          <span className="tg-hint">Modifiable ensuite à l’étape Structure.</span>
        </div>
        <div className="tg-grid">
          {FORMATS.map(([k, l, d]) => {
            const on = state.mode === k;
            return (
              <button key={k} type="button" className={`tg-opt ${on ? "on" : ""}`} aria-pressed={on} onClick={() => onMode(k)}>
                <span className="tg-top">
                  <b>{l}</b>
                  {on && <span className="tg-badge">✓ Choisi</span>}
                </span>
                <span className="tg-d">{d}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Axes({ state, axes }: { state: LexiqueV2State; axes: [string, string][] }) {
  const vals = axesOf(state);
  return (
    <div className="axes" aria-label="Axes de personnalité, mis à jour selon tes choix">
      {axes.map((a, j) => {
        const v = vals[j];
        const L = v ? axisLabel(v) : { txt: "Équilibré", pct: null };
        return (
          <div className={`axis${L.pct ? " set" : ""}`} key={a[0]}>
            <span>{a[0]}</span>
            <i className="track">
              <b className="knob" style={{ left: `${(((v?.v ?? 0) + 1) / 2) * 100}%` }} />
            </i>
            <span>{a[1]}</span>
            <em className="axv">{L.txt}</em>
          </div>
        );
      })}
    </div>
  );
}
