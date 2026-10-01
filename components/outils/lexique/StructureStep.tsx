"use client";

import { useRef, useState, type CSSProperties, type DragEvent } from "react";
import { CATS, ELEMENTS, VIEWS } from "@/data/outils/lexique-v2";
import type { LexiqueV2State, Mode, View } from "@/data/outils/lexique-types";
import {
  addBrick, addPage, allBricks, catOf, edit, elementOf, moveBrick, pad, q, removeBrick, removePage, structAlerts, suggestStructure,
  type Result,
} from "@/lib/outils/lexique";

interface StructureStepProps {
  state: LexiqueV2State;
  apply: (r: LexiqueV2State | Result) => void;
  onMode: (m: Mode) => void;
  onToast: (msg: string) => void;
  onPrev: () => void;
  onNext: () => void;
  prevName: string;
}

type Drag = { src: "lib"; k: string } | { src: "plate"; pid: string; i: number };

/** Couleur de catégorie en variable CSS, pour les faces et les plots des briques */
const cat = (c: string) => ({ "--c": c }) as CSSProperties;

export function StructureStep({ state, apply, onMode, onToast, onPrev, onNext, prevName }: StructureStepProps) {
  const drag = useRef<Drag | null>(null);
  const [over, setOver] = useState<{ pid: string; i: number } | null>(null);
  const multi = state.mode === "multi";
  const view: View = state.view ?? "relief";
  const bricks = allBricks(state);
  const activeP = state.pages.find((p) => p.id === state.active) ?? state.pages[0]!;
  const alerts = structAlerts(state);

  const overAt = (pid: string, i: number) => {
    if (!over || over.pid !== pid || over.i !== i) setOver({ pid, i });
  };
  const dragEnd = () => {
    drag.current = null;
    setOver(null);
  };
  const dropAt = (pid: string, i: number) => {
    const d = drag.current;
    dragEnd();
    if (!d) return;
    apply(d.src === "lib" ? addBrick(state, pid, d.k, i) : moveBrick(state, d.pid, d.i, pid, i));
  };
  const setData = (e: DragEvent, v: string, effect: DataTransfer["effectAllowed"]) => {
    try {
      e.dataTransfer.setData("text/plain", v);
      e.dataTransfer.effectAllowed = effect;
    } catch {
      /* navigateur sans dataTransfer */
    }
  };

  return (
    <section className="block param is-current" id="structure">
      <span className="tag">
        [STRUCTURE] · {bricks.length} brique{bricks.length > 1 ? "s" : ""} · {multi ? `${state.pages.length} pages` : "one-page"}
      </span>
      <h2>Empile les briques de ton portfolio</h2>
      <p className="lead" style={{ marginTop: 12 }}>
        Glisse une brique du bac vers un plateau, ou clique dessus pour l’ajouter au plateau actif. La brique du haut est le haut de la page. Fais glisser les briques pour les réordonner.
      </p>
      <div className="st-bar">
        <div className="seg" role="group" aria-label="Format">
          <button type="button" aria-pressed={!multi} onClick={() => onMode("one")}>One-page</button>
          <button type="button" aria-pressed={multi} onClick={() => onMode("multi")}>Multi-pages</button>
        </div>
        <div className="seg" role="group" aria-label="Vue">
          {VIEWS.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={view === k} onClick={() => apply(edit(state, (s) => void (s.view = k)))}>
              {l}
            </button>
          ))}
        </div>
        <button className="btn dice" type="button" onClick={() => { apply(suggestStructure(state)); onToast("Structure type chargée : ajuste-la brique par brique"); }}>
          Structure type
        </button>
        <button className="btn" type="button" onClick={() => { apply(edit(state, (s) => { s.pages.forEach((p) => (p.bricks = [])); s.el = {}; })); onToast("Plateaux vidés"); }}>
          Tout vider
        </button>
      </div>
      {alerts.glob.length > 0 && (
        <div className="st-alerts">
          {alerts.glob.map((m) => (
            <span key={m}>⚠ {m}</span>
          ))}
        </div>
      )}

      <div className="st-wrap">
        <aside className="bin" aria-label="Bac à briques">
          <h3>Bac à briques</h3>
          <p>Clic : ajoute à « {activeP.name} ».</p>
          {Object.entries(CATS).map(([ck, c]) => (
            <div className="bin-cat" key={ck}>
              <b style={{ color: c.c }}>{c.l}</b>
              {ELEMENTS.filter((e) => e.cat === ck).map((e) => {
                const cnt = bricks.filter((b) => b.k === e.k).length;
                return (
                  <button
                    key={e.k}
                    type="button"
                    className="lib-brick"
                    style={cat(c.c)}
                    title={e.d}
                    draggable
                    onDragStart={(ev) => { drag.current = { src: "lib", k: e.k }; setData(ev, e.k, "copyMove"); }}
                    onDragEnd={dragEnd}
                    onClick={() => { apply(addBrick(state, activeP.id, e.k)); onToast(`${q(e.l)} ajouté à ${q(activeP.name)}`); }}
                  >
                    <i className="studs" aria-hidden="true">
                      <u /><u /><u /><u />
                    </i>
                    <span>{e.l}</span>
                    <small>{cnt ? `×${cnt}` : ""}</small>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="plates">
          {state.pages.map((p) => {
            const isAct = multi && p.id === activeP.id;
            const endOver = over?.pid === p.id && over.i === p.bricks.length;
            return (
              <div key={p.id} className={`plate v-${view}`} onClick={() => { if (state.active !== p.id) apply(edit(state, (s) => void (s.active = p.id))); }}>
                <div className="plate-head">
                  <i className={`dot${isAct ? " on" : ""}`} />
                  {multi ? (
                    <input
                      type="text"
                      value={p.name}
                      aria-label="Nom de la page"
                      onChange={(e) => { const v = e.target.value; apply(edit(state, (s) => { const x = s.pages.find((y) => y.id === p.id); if (x) x.name = v; })); }}
                    />
                  ) : (
                    <span className="plate-name">{p.name}</span>
                  )}
                  <span className="plate-count">{p.bricks.length} brique{p.bricks.length > 1 ? "s" : ""}</span>
                  {multi && (
                    <button
                      type="button"
                      className="plate-x"
                      aria-label="Supprimer la page"
                      onClick={(e) => { e.stopPropagation(); if (state.pages.length < 2) onToast("Il faut au moins une page"); else apply(removePage(state, p.id)); }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div
                  className={`plate-body${endOver ? " over" : isAct ? " act" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); overAt(p.id, p.bricks.length); }}
                  onDrop={(e) => { e.preventDefault(); dropAt(p.id, over?.pid === p.id ? over.i : p.bricks.length); }}
                >
                  <div className="stack">
                    {p.bricks.map((b, i) => {
                      const e = elementOf(b.k);
                      const style = { ...cat(catOf(b.k).c), "--h": e.h, "--w": e.w, zIndex: 100 - i } as CSSProperties;
                      return (
                        <div
                          key={b.uid}
                          className={`brick${over?.pid === p.id && over.i === i ? " over" : ""}`}
                          style={style}
                          draggable
                          onDragStart={(ev) => { ev.stopPropagation(); drag.current = { src: "plate", pid: p.id, i }; setData(ev, b.uid, "move"); }}
                          onDragEnd={dragEnd}
                          onDragOver={(ev) => { ev.preventDefault(); ev.stopPropagation(); overAt(p.id, i); }}
                          onDrop={(ev) => { ev.preventDefault(); ev.stopPropagation(); dropAt(p.id, i); }}
                        >
                          {view === "facade" && (
                            <i className="studs" aria-hidden="true">
                              <u /><u /><u /><u /><u /><u />
                            </i>
                          )}
                          {view === "relief" && (
                            <>
                              <i className="face-top" aria-hidden="true" />
                              <i className="face-side" aria-hidden="true" />
                            </>
                          )}
                          <span className="brick-l">
                            <small>{pad(i + 1)}</small>
                            {e.l}
                          </span>
                          <span className="brick-act">
                            <button type="button" aria-label="Monter" onClick={(ev) => { ev.stopPropagation(); if (i > 0) apply(moveBrick(state, p.id, i, p.id, i - 1)); }}>↑</button>
                            <button type="button" aria-label="Descendre" onClick={(ev) => { ev.stopPropagation(); if (i < p.bricks.length - 1) apply(moveBrick(state, p.id, i, p.id, i + 2)); }}>↓</button>
                            <button type="button" aria-label="Retirer" onClick={(ev) => { ev.stopPropagation(); apply(removeBrick(state, p.id, i)); }}>✕</button>
                          </span>
                        </div>
                      );
                    })}
                    {!p.bricks.length && <div className="plate-empty">Dépose une brique ici</div>}
                  </div>
                  {view !== "plaque" && (
                    <div className="baseplate" aria-hidden="true">
                      {view === "relief" && (
                        <>
                          <i className="face-top" />
                          <i className="face-side" />
                        </>
                      )}
                    </div>
                  )}
                </div>
                {(alerts.pages[p.id] ?? []).map((m) => (
                  <span className="plate-alert" key={m}>⚠ {m}</span>
                ))}
              </div>
            );
          })}
          {multi && (
            <button type="button" className={`plate-add v-${view}`} onClick={() => apply(addPage(state))}>
              + Ajouter une page
            </button>
          )}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn" type="button" onClick={onPrev}>
          ← {prevName}
        </button>
        <button className="btn primary" type="button" disabled={!bricks.length} onClick={onNext}>
          {bricks[0] ? `Passer aux éléments : ${elementOf(bricks[0].k).l} →` : "Ajoute au moins une brique"}
        </button>
      </div>
    </section>
  );
}
