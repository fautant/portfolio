"use client";

import { useEffect, useRef } from "react";
import { PARAMS } from "@/data/outils/lexique";
import type { Example, LexiqueState, Param } from "@/data/outils/lexique-types";
import { axesOf, axisLabel, hardOf, lbl, maxOf, pad, paramOf, preview, q, selIds, slot, tensionsOf } from "@/lib/outils/lexique";
import { attachDemos } from "./demos";

export interface Pending {
  pid: string;
  prev: string[];
  chosen: string[];
  guides: string[];
}

interface StepProps {
  index: number;
  param: Param;
  state: LexiqueState;
  pending: Pending | null;
  onToggle: (pid: string, k: string) => void;
  onNote: (pid: string, value: string) => void;
  onAuto: (pid: string) => void;
  onAll: (pid: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ParamStep({ index: i, param: p, state, pending, onToggle, onNote, onAuto, onAll, onPrev, onNext }: StepProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) attachDemos(ref.current);
  }, []);

  const ids = new Set(selIds(state));
  const cur = slot(state, p.id);
  const max = maxOf(p.id);
  const unlimited = max === Infinity;
  const full = !unlimited && cur.sel.length >= max;
  const n = cur.sel.length;

  const others = new Set([...ids].filter((id) => !id.startsWith(p.id + ".")));
  const free = p.ex.map((e) => e.k).filter((k) => ![...hardOf(`${p.id}.${k}`)].some((o) => others.has(o)));
  const allOn = n > 0 && free.every((k) => cur.sel.includes(k));
  const prevTitle = i ? paramOf(PARAMS[i - 1]?.id ?? "").title : "Accueil";
  const nextTitle = i < PARAMS.length - 1 ? PARAMS[i + 1]?.title : "Finaliser";

  return (
    <section className="block param is-current" id={`p-${p.id}`} ref={ref}>
      <div className={`param-head ${p.cls ?? ""}`}>
        <span className="num">{pad(i + 1)}</span>
        <div>
          <span className="tag">
            Étape {i + 1}/{PARAMS.length} · [{p.tag}]{p.added ? " · ajouté" : ""}
          </span>
          <h2>{p.title}</h2>
        </div>
        <div className={`counter ${full ? "full" : n > 0 ? "some" : ""}`} aria-label={unlimited ? `${n} choix, sans limite` : `${n} choix sur ${max}`}>
          {unlimited ? (
            <>
              <b>{n}</b>
              <small>
                choix
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
              <small>choix</small>
              <i className="dots">
                {Array.from({ length: max }, (_, j) => (
                  <u key={j} className={j < n ? "on" : ""} />
                ))}
              </i>
            </>
          )}
        </div>
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
      <div className="toolbar">
        <button className="btn dice" type="button" onClick={() => onAuto(p.id)}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
            <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          </svg>
          Choisir à ma place
        </button>
        {unlimited && (
          <button className="btn all" type="button" aria-pressed={allOn} onClick={() => onAll(p.id)}>
            {allOn ? "Tout désélectionner" : "Tout sélectionner"}
          </button>
        )}
        <span className={`cap-mini ${full ? "full" : ""}`}>{unlimited ? `${n} choix` : `${n}/${max} choix`}</span>
        <span>
          {unlimited
            ? "« Choisir à ma place » propose tout ce qui est cohérent avec ta sélection ; tu valides ensuite."
            : `« Choisir à ma place » propose ${max === 1 ? "1 choix" : max + " choix"} cohérents avec ta sélection ; tu valides ensuite.`}
        </span>
      </div>
      <div className={`grid ${p.kind === "text" ? "grid-text" : ""}`}>
        {p.ex.map((ex) => (
          <ExampleCard key={ex.k} param={p} ex={ex} state={state} ids={ids} proposed={!!pending && pending.pid === p.id} onToggle={onToggle} />
        ))}
      </div>
      <label className="note">
        <span>Ta précision pour [{p.tag}]</span>
        <input type="text" value={cur.note} onChange={(e) => onNote(p.id, e.target.value)} placeholder={`Ex. : ${p.sample.slice(0, 70)}…`} />
      </label>
      <div className="step-nav">
        <button className="btn" type="button" onClick={onPrev}>
          ← {prevTitle}
        </button>
        <button className="link-next" type="button" onClick={onNext}>
          Étape suivante : {nextTitle} →
        </button>
      </div>
      <p className="step-hint">
        {unlimited
          ? "Cette étape n’a pas de limite : ajoute autant de choix que tu veux, puis passe à la suite."
          : `Le passage à l’étape suivante est automatique dès que tu atteins ${max} choix (après « Choisir à ma place », c’est toi qui valides).`}
      </p>
    </section>
  );
}

function ExampleCard({ param: p, ex, state, ids, proposed, onToggle }: { param: Param; ex: Example; state: LexiqueState; ids: Set<string>; proposed: boolean; onToggle: (pid: string, k: string) => void }) {
  const id = `${p.id}.${ex.k}`;
  const on = ids.has(id);
  const sel = slot(state, p.id).sel;
  const hard = [...hardOf(id)].filter((o) => ids.has(o));
  const ten = [...tensionsOf(id).keys()].filter((o) => ids.has(o));
  let cls = "", txt = "";
  if (!on && hard.length) {
    cls = "hard";
    txt = "Incompatible avec " + hard.map((o) => q(lbl(o))).join(", ") + " : le remplacera";
  } else if (ten.length) {
    cls = "warn";
    txt = "Tension avec " + ten.map((o) => q(lbl(o))).join(", ");
  } else if (!on && sel.length >= maxOf(p.id)) {
    cls = "rep";
    txt = "Remplacera " + q(lbl(`${p.id}.${sel[0]}`));
  }
  const pv = preview(p, ex);
  const isDemo = p.kind === "demo";
  return (
    <article className={`ex${on ? " on" : ""}${!on && hard.length ? " blocked" : ""}${proposed && on ? " proposed" : ""}`}>
      {pv && (
        <div
          className="pv"
          {...(isDemo ? { "data-demo": ex.k } : {})}
          aria-hidden={!isDemo}
          onClick={isDemo ? undefined : () => onToggle(p.id, ex.k)}
          dangerouslySetInnerHTML={{ __html: pv }}
        />
      )}
      <button className="ex-btn" type="button" aria-pressed={on} onClick={() => onToggle(p.id, ex.k)}>
        <span className="ex-l">{ex.l}</span>
        <span className="ex-add" aria-hidden="true" />
        <span className="ex-p">{ex.p}</span>
        <span className={`ex-flag${cls ? " " + cls : ""}`}>{txt}</span>
      </button>
      {ex.u && (
        <a className="ex-link" href={ex.u} target="_blank" rel="noopener noreferrer">
          Voir des exemples réels <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

function Axes({ state, axes }: { state: LexiqueState; axes: [string, string][] }) {
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

