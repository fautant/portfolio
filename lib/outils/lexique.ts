import { AX, DEMO, HARD, IMGV, MAX, PARAMS, RAND, REFV, TAGS, TENSION, TIPS, VG, WF } from "@/data/outils/lexique";
import {
  CATS, ELEMENTS, GLOBAL_IDS, IMPLY, LETTERS, LOCAL_IDS, LOCAL_MAX, REL, STRUCT_PRESETS, SYS, SYS_IDS, VC, toneOf,
} from "@/data/outils/lexique-v2";
import type {
  Element, ElementState, Example, GlobalSlot, LexiqueV2State, Mode, Page, Param, View,
} from "@/data/outils/lexique-types";

/* ---------- Index ---------- */
/** Tous les paramètres, y compris l'étape globale « Mise en page & mouvement » */
export const ALL_PARAMS: Param[] = [...PARAMS, SYS];
const P: Record<string, Param> = Object.fromEntries(ALL_PARAMS.map((p) => [p.id, p]));
const EX: Record<string, Record<string, Example>> = Object.fromEntries(
  ALL_PARAMS.map((p) => [p.id, Object.fromEntries(p.ex.map((e) => [e.k, e]))]),
);
const EL: Record<string, Element> = Object.fromEntries(ELEMENTS.map((e) => [e.k, e]));

const HARD_MAP = new Map<string, string[]>();
const TEN_MAP = new Map<string, Map<string, string>>();
HARD.forEach(([a, b]) => {
  (HARD_MAP.get(a) ?? HARD_MAP.set(a, []).get(a)!).push(b);
  (HARD_MAP.get(b) ?? HARD_MAP.set(b, []).get(b)!).push(a);
});
TENSION.forEach(([a, b, m]) => {
  (TEN_MAP.get(a) ?? TEN_MAP.set(a, new Map()).get(a)!).set(b, m);
  (TEN_MAP.get(b) ?? TEN_MAP.set(b, new Map()).get(b)!).set(a, m);
});

export const STORAGE_KEY = "lexique-v2-state";
/** Réglages des prompts d'élément : 3 directions contrastées, bloc [MÉTHODE] inclus */
export const PROMPT_OPTS = { directions: 3 as 1 | 3, includeMethod: true };

export { toneOf };
export const maxOf = (pid: string): number => MAX[pid] ?? LOCAL_MAX[pid] ?? 1;
export const paramOf = (pid: string): Param => P[pid] ?? PARAMS[0]!;
export const elementOf = (k: string): Element => EL[k] ?? ELEMENTS[0]!;
export const catOf = (k: string) => CATS[elementOf(k).cat] ?? { l: "", c: "#45413a" };
export const example = (pid: string, k: string): Example | undefined => EX[pid]?.[k];
export const variantOf = (ek: string, vk: string) => EL[ek]?.v.find((x) => x.k === vk);
export const hardOf = (id: string): string[] => HARD_MAP.get(id) ?? [];
export const tensionsOf = (id: string): Map<string, string> => TEN_MAP.get(id) ?? new Map();

export const q = (s: string): string => `« ${s} »`;
export const pad = (n: number): string => String(n).padStart(2, "0");
const plural = (n: number, s = "s"): string => (n > 1 ? s : "");

/** Libellé lisible d'un id : param.clé, v.<élément>.<variante> ou fmt.<format> */
export function lbl(id: string): string {
  const [a = "", b = "", c = ""] = id.split(".");
  if (a === "fmt") return b === "one" ? "One-page" : "Multi-pages";
  if (a === "v") {
    const x = variantOf(b, c);
    return x ? `${elementOf(b).l} : ${x.l}` : id;
  }
  return EX[a]?.[b]?.l ?? id;
}

export function tens(ids: string[]): [string, string, string][] {
  const r: [string, string, string][] = [];
  ids.forEach((a, i) =>
    ids.slice(i + 1).forEach((b) => {
      const m = tensionsOf(a).get(b);
      if (m) r.push([a, b, m]);
    }),
  );
  return r;
}

/* ---------- État ---------- */
const mkId = (): string => Math.random().toString(36).slice(2, 9);
export const emptyEl = (): ElementState => ({ v: [], c: [], p: {}, note: "", design: "", done: false });

export function fresh(): LexiqueV2State {
  const id = mkId();
  return { v: 2, step: "home", mode: null, view: null, g: {}, pages: [{ id, name: "Page unique", bricks: [] }], active: id, el: {}, stack: "" };
}

/** Copie modifiable de l'état : edit(S, (s) => { s.x = … }) */
export function edit(S: LexiqueV2State, fn: (s: LexiqueV2State) => void): LexiqueV2State {
  const s = structuredClone(S);
  fn(s);
  return s;
}
const ed = (s: LexiqueV2State, uid: string): ElementState => s.el[uid] ?? (s.el[uid] = emptyEl());

/** Relit un état sauvegardé en écartant tout ce qui n'existe plus */
export function sanitize(raw: unknown): LexiqueV2State {
  const f = fresh();
  if (!raw || typeof raw !== "object" || (raw as { v?: unknown }).v !== 2) return f;
  const r = raw as Record<string, unknown>;
  const str = (x: unknown): string => (typeof x === "string" ? x : "");
  const strs = (x: unknown): string[] => (Array.isArray(x) ? x.filter((y): y is string => typeof y === "string") : []);
  const obj = (x: unknown): Record<string, unknown> => (x && typeof x === "object" ? (x as Record<string, unknown>) : {});

  const g: Record<string, GlobalSlot> = {};
  const rg = obj(r.g);
  GLOBAL_IDS.forEach((pid) => {
    const it = obj(rg[pid]);
    g[pid] = { sel: [...new Set(strs(it.sel).filter((k) => !!EX[pid]?.[k]))].slice(0, maxOf(pid)), note: str(it.note) };
  });

  const pages: Page[] = (Array.isArray(r.pages) ? r.pages : []).map((p) => {
    const o = obj(p);
    const bricks = (Array.isArray(o.bricks) ? o.bricks : [])
      .map((b) => ({ uid: str(obj(b).uid), k: str(obj(b).k) }))
      .filter((b) => b.uid && EL[b.k]);
    return { id: str(o.id) || mkId(), name: str(o.name) || "Page", bricks };
  });
  if (!pages.length) pages.push(...f.pages);

  const el: Record<string, ElementState> = {};
  const rel = obj(r.el);
  pages.flatMap((p) => p.bricks).forEach(({ uid, k }) => {
    if (!rel[uid]) return;
    const d = obj(rel[uid]);
    const vks = strs(d.v).filter((vk) => variantOf(k, vk));
    const pp: Record<string, string[]> = {};
    LOCAL_IDS.forEach((pid) => {
      const sel = strs(obj(d.p)[pid]).filter((x) => !!EX[pid]?.[x]);
      if (sel.length) pp[pid] = sel.slice(0, LOCAL_MAX[pid]);
    });
    const cmp = d.cmp === true;
    el[uid] = {
      v: cmp ? vks.slice(0, 4) : vks.slice(0, 1),
      c: strs(d.c).filter((x) => elementOf(k).c.includes(x)),
      p: pp,
      note: str(d.note),
      design: str(d.design),
      done: d.done === true,
      cmp,
      pick: cmp && vks.includes(str(d.pick)) ? str(d.pick) : "",
      keep: str(d.keep),
    };
  });

  const mode = r.mode === "one" || r.mode === "multi" ? (r.mode as Mode) : null;
  const view = r.view === "facade" || r.view === "relief" || r.view === "plaque" ? (r.view as View) : null;
  const active = pages.some((p) => p.id === r.active) ? str(r.active) : pages[0]!.id;
  return { v: 2, step: str(r.step) || "home", mode, view, g, pages, active, el, stack: str(r.stack) };
}

/* ---------- Sélections ---------- */
export const gSlot = (S: LexiqueV2State, pid: string): GlobalSlot => S.g[pid] ?? { sel: [], note: "" };
/** Id complet d'une option globale (les options « système » gardent leur id d'origine) */
export const gid = (pid: string, k: string): string => (pid === "sys" ? k : `${pid}.${k}`);
export const gIds = (S: LexiqueV2State): string[] =>
  GLOBAL_IDS.filter((p) => p !== "type").flatMap((pid) => gSlot(S, pid).sel.map((k) => gid(pid, k)));
export const fIds = (S: LexiqueV2State): string[] => (S.mode ? [`fmt.${S.mode}`] : []);
export const eIds = (d?: ElementState): string[] => LOCAL_IDS.flatMap((pid) => (d?.p[pid] ?? []).map((k) => `${pid}.${k}`));
/** Variante effective : celle retenue en mode comparaison, sinon la seule choisie */
export const evOf = (d?: ElementState): string => (d ? (d.cmp ? d.pick ?? "" : d.v[0] ?? "") : "");
export const vIds = (d: ElementState | undefined, ek: string): string[] => {
  const v = evOf(d);
  return v ? [`v.${ek}.${v}`] : [];
};
export const implied = (d: ElementState | undefined, ek: string): string[] => {
  const v = evOf(d);
  return v ? IMPLY[`v.${ek}.${v}`] ?? [] : [];
};
export const scopeOf = (id: string): string => (id.startsWith("fmt.") ? " (format)" : id.startsWith("v.") ? " (variante)" : " (global)");

export const gFilled = (S: LexiqueV2State, pid: string): boolean => {
  if (pid === "type") return !!S.mode;
  const sl = gSlot(S, pid);
  return sl.sel.length > 0 || !!sl.note.trim();
};

/* ---------- Structure ---------- */
export interface Loc {
  page: Page;
  pi: number;
  i: number;
  k: string;
}
export const allBricks = (S: LexiqueV2State) => S.pages.flatMap((p) => p.bricks);
export function locate(S: LexiqueV2State): Record<string, Loc> {
  const r: Record<string, Loc> = {};
  S.pages.forEach((page, pi) => page.bricks.forEach((b, i) => (r[b.uid] = { page, pi, i, k: b.k })));
  return r;
}
export const steps = (S: LexiqueV2State): string[] => [
  "home",
  ...GLOBAL_IDS.map((i) => `g:${i}`),
  "structure",
  ...allBricks(S).map((b) => `el:${b.uid}`),
  "final",
];
export function stepName(S: LexiqueV2State, key: string): string {
  if (key === "home") return "Accueil";
  if (key === "structure") return "Structure";
  if (key === "final") return "Prompt Claude Code";
  if (key.startsWith("g:")) return paramOf(key.slice(2)).title;
  const l = locate(S)[key.slice(3)];
  return l ? elementOf(l.k).l : "";
}

export function addBrick(S: LexiqueV2State, pageId: string, k: string, at?: number): LexiqueV2State {
  return edit(S, (s) => {
    const p = s.pages.find((x) => x.id === pageId) ?? s.pages[0]!;
    p.bricks.splice(at ?? p.bricks.length, 0, { uid: mkId(), k });
    s.active = p.id;
  });
}

export function moveBrick(S: LexiqueV2State, fp: string, fi: number, tp: string, ti: number): LexiqueV2State {
  return edit(S, (s) => {
    const a = s.pages.find((x) => x.id === fp);
    const b = s.pages.find((x) => x.id === tp);
    if (!a || !b) return;
    const [br] = a.bricks.splice(fi, 1);
    if (!br) return;
    let t = ti;
    if (a === b && fi < t) t -= 1;
    b.bricks.splice(Math.max(0, Math.min(t, b.bricks.length)), 0, br);
  });
}

export function removeBrick(S: LexiqueV2State, pageId: string, i: number): LexiqueV2State {
  return edit(S, (s) => {
    const p = s.pages.find((x) => x.id === pageId);
    const [br] = p ? p.bricks.splice(i, 1) : [];
    if (br) delete s.el[br.uid];
  });
}

export function suggestStructure(S: LexiqueV2State): LexiqueV2State {
  return edit(S, (s) => {
    const m = s.mode ?? "one";
    s.mode = m;
    s.pages = STRUCT_PRESETS[m].map((p) => ({ id: mkId(), name: p.name, bricks: p.k.map((k) => ({ uid: mkId(), k })) }));
    s.active = s.pages[0]!.id;
    s.el = {};
  });
}

export function addPage(S: LexiqueV2State): LexiqueV2State {
  return edit(S, (s) => {
    const id = mkId();
    s.pages.push({ id, name: "Nouvelle page", bricks: [] });
    s.active = id;
  });
}

export function removePage(S: LexiqueV2State, id: string): LexiqueV2State {
  return edit(S, (s) => {
    s.pages.find((p) => p.id === id)?.bricks.forEach((b) => delete s.el[b.uid]);
    s.pages = s.pages.filter((p) => p.id !== id);
    if (s.active === id) s.active = s.pages[0]!.id;
  });
}

/** Retire un choix global (options système comprises) ; renvoie vrai s'il était sélectionné */
function gRemove(s: LexiqueV2State, id: string): boolean {
  const [op = "", ok = ""] = id.split(".");
  const inParam = GLOBAL_IDS.includes(op) && op !== "sys";
  const t = inParam ? s.g[op] : s.g.sys;
  const j = t ? t.sel.indexOf(inParam ? ok : id) : -1;
  if (t && j > -1) t.sel.splice(j, 1);
  return j > -1;
}

export interface Result {
  state: LexiqueV2State;
  msg?: string;
}

export function setMode(S: LexiqueV2State, m: Mode): Result {
  const gone: string[] = [];
  const state = edit(S, (s) => {
    s.mode = m;
    hardOf(`fmt.${m}`).forEach((o) => {
      if (gRemove(s, o)) gone.push(o);
    });
    if (m === "one" && s.pages.length > 1) s.pages = [{ id: s.pages[0]!.id, name: "Page unique", bricks: s.pages.flatMap((p) => p.bricks) }];
    if (m === "one") s.pages[0]!.name = "Page unique";
    if (m === "multi" && s.pages.length === 1 && s.pages[0]!.name === "Page unique") s.pages[0]!.name = "Accueil";
    s.active = s.pages[0]!.id;
  });
  return { state, msg: gone.length ? `Retiré car incompatible avec ${q(lbl(`fmt.${m}`))} : ${gone.map((o) => q(lbl(o))).join(", ")}` : undefined };
}

/* ---------- Choix globaux ---------- */
export function toggleGlobal(S: LexiqueV2State, pid: string, k: string): Result {
  const id = gid(pid, k);
  if (!gSlot(S, pid).sel.includes(k)) {
    const hf = hardOf(id).filter((o) => fIds(S).includes(o));
    if (hf.length) return { state: S, msg: `${q(lbl(id))} est incompatible avec le format ${q(lbl(hf[0]!))}` };
  }
  const rep: string[] = [];
  const state = edit(S, (s) => {
    const x = s.g[pid] ?? (s.g[pid] = { sel: [], note: "" });
    const i = x.sel.indexOf(k);
    if (i > -1) {
      x.sel.splice(i, 1);
      return;
    }
    hardOf(id).forEach((o) => {
      if (gRemove(s, o)) rep.push(o);
    });
    x.sel.push(k);
    while (x.sel.length > maxOf(pid)) rep.push(gid(pid, x.sel.shift()!));
  });
  return { state, msg: rep.length ? `${q(lbl(id))} remplace ${rep.map((o) => q(lbl(o))).join(", ")}` : undefined };
}

export const setGlobalNote = (S: LexiqueV2State, pid: string, note: string): LexiqueV2State =>
  edit(S, (s) => {
    (s.g[pid] ?? (s.g[pid] = { sel: [], note: "" })).note = note;
  });

/** Paramètres sans limite : tout ce qui ne contredit pas les autres choix (ou tout retirer) */
export function selectAllGlobal(S: LexiqueV2State, pid: string): Result {
  const p = paramOf(pid);
  const others = gIds(S).filter((o) => !p.ex.some((e) => gid(pid, e.k) === o));
  const ok = p.ex.map((e) => e.k).filter((k) => !hardOf(gid(pid, k)).some((o) => others.includes(o)));
  const note = gSlot(S, pid).note;
  if (ok.every((k) => gSlot(S, pid).sel.includes(k))) {
    return { state: edit(S, (s) => void (s.g[pid] = { sel: [], note })), msg: "Tout désélectionné" };
  }
  const sk = p.ex.filter((e) => !ok.includes(e.k)).map((e) => q(e.l));
  return {
    state: edit(S, (s) => void (s.g[pid] = { sel: ok, note })),
    msg: sk.length
      ? `${ok.length} sélectionnés · non retenu${plural(sk.length)} car en contradiction avec tes choix : ${sk.join(", ")}`
      : `Les ${ok.length} éléments sont sélectionnés`,
  };
}

/* ---------- Hasard cohérent ---------- */
const tagsOf = (id: string): string[] => {
  const [p = "", k = ""] = id.split(".");
  return (TAGS[p]?.[k] ?? "").split(" ").filter(Boolean);
};
function randCount(pid: string, max: number): number {
  const r = RAND[pid] ?? 1;
  const n = Array.isArray(r) ? r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)) : r;
  return Math.min(n, max);
}
const pickN = <T>(arr: T[], n: number): T[] => {
  const a = [...arr];
  const r: T[] = [];
  while (a.length && r.length < n) r.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]!);
  return r;
};

/** n options sans contradiction avec `taken`, en évitant les tensions et en privilégiant
 *  les univers déjà présents (tags) */
function pickCoherent(pid: string, n: number, taken: string[], cands?: string[]): string[] {
  const w: Record<string, number> = {};
  taken.forEach((id) => tagsOf(id).forEach((t) => (w[t] = (w[t] ?? 0) + 1)));
  const scored = (cands ?? paramOf(pid).ex.map((e) => e.k))
    .map((k) => {
      const id = gid(pid, k);
      const ten = [...tensionsOf(id).keys()].some((o) => taken.includes(o));
      return { k, sc: tagsOf(id).reduce((t, g) => t + 2 * (w[g] ?? 0), 0) - (ten ? 3 : 0) + Math.random() * 4 };
    })
    .sort((a, b) => b.sc - a.sc);
  const r: string[] = [];
  for (const { k } of scored) {
    if (r.length >= n) break;
    if (hardOf(gid(pid, k)).some((o) => taken.includes(o) || r.some((x) => gid(pid, x) === o))) continue;
    r.push(k);
  }
  return r;
}

export function autoGlobal(S: LexiqueV2State, pid: string): Result {
  const own = gSlot(S, pid).sel.map((k) => gid(pid, k));
  const sel = pickCoherent(pid, randCount(pid, maxOf(pid)), [...gIds(S).filter((o) => !own.includes(o)), ...fIds(S)]);
  const state = edit(S, (s) => void (s.g[pid] = { sel, note: gSlot(S, pid).note }));
  return { state, msg: `Proposition : ${sel.map((k) => example(pid, k)?.l ?? k).join(" · ")}` };
}

export function surpriseGlobal(S: LexiqueV2State): Result {
  const state = edit(S, (s) => {
    const taken = fIds(s);
    GLOBAL_IDS.filter((pid) => pid !== "type").forEach((pid) => {
      const sel = pickCoherent(pid, randCount(pid, maxOf(pid)), taken);
      sel.forEach((k) => taken.push(gid(pid, k)));
      s.g[pid] = { sel, note: "" };
    });
  });
  return { state, msg: "Nouvelle direction globale cohérente tirée au sort" };
}

/* ---------- Éléments ---------- */
/** Applique une variante : retire les options locales incompatibles ou déjà incluses, ajuste le contenu */
function applyVariant(s: LexiqueV2State, uid: string, ek: string, vk: string): void {
  const dd = ed(s, uid);
  const vid = `v.${ek}.${vk}`;
  [...hardOf(vid), ...(IMPLY[vid] ?? [])].forEach((o) => {
    const [op = "", ok = ""] = o.split(".");
    const t = dd.p[op];
    const j = t ? t.indexOf(ok) : -1;
    if (t && j > -1) t.splice(j, 1);
  });
  const vc = VC[ek]?.[vk] ?? {};
  (vc.req ?? []).forEach((x) => {
    if (!dd.c.includes(x)) dd.c.push(x);
  });
  dd.c = dd.c.filter((x) => !(vc.ban ?? []).includes(x));
}

export function toggleVariant(S: LexiqueV2State, uid: string, ek: string, vk: string): Result {
  const d = S.el[uid];
  const on = !!d?.v.includes(vk);
  if (d?.cmp && !on && d.v.length >= 4) return { state: S, msg: "4 variantes maximum à comparer" };
  const vid = `v.${ek}.${vk}`;
  const hg = hardOf(vid).filter((o) => [...gIds(S), ...fIds(S)].includes(o));
  if (!on && hg.length) {
    return { state: S, msg: `${q(variantOf(ek, vk)?.l ?? vk)} est incompatible avec ${hg.map((o) => q(lbl(o))).join(", ")}${scopeOf(hg[0]!)}` };
  }
  const state = edit(S, (s) => {
    const dd = ed(s, uid);
    if (dd.cmp) {
      dd.v = on ? dd.v.filter((y) => y !== vk) : [...dd.v, vk];
      if (!dd.v.includes(dd.pick ?? "")) dd.pick = "";
    } else if (on) dd.v = [];
    else {
      dd.v = [vk];
      applyVariant(s, uid, ek, vk);
    }
  });
  return { state };
}

export function setCompare(S: LexiqueV2State, uid: string, cmp: boolean): LexiqueV2State {
  return edit(S, (s) => {
    const dd = ed(s, uid);
    if (!!dd.cmp === cmp) return;
    dd.cmp = cmp;
    if (!cmp) dd.v = dd.pick ? [dd.pick] : dd.v.slice(0, 1);
    dd.pick = "";
  });
}

/** « Je ne sais pas » : une variante par ton (sobre, éditoriale, expérimentale) */
export function contrastedVariants(S: LexiqueV2State, uid: string, ek: string): Result {
  const e = elementOf(ek);
  const sel = (["sobre", "edito", "expe"] as const).map((t) => pickN(e.v.filter((x) => toneOf(ek, x.k) === t).map((x) => x.k), 1)[0]).filter((x): x is string => !!x);
  while (sel.length < Math.min(3, e.v.length)) {
    const r = pickN(e.v.map((x) => x.k).filter((k) => !sel.includes(k)), 1)[0];
    if (!r) break;
    sel.push(r);
  }
  const state = edit(S, (s) => {
    const dd = ed(s, uid);
    dd.cmp = true;
    dd.v = sel;
    dd.pick = "";
  });
  return { state, msg: "3 variantes contrastées : " + sel.map((k) => variantOf(ek, k)?.l).join(" · ") };
}

export function pickVariant(S: LexiqueV2State, uid: string, ek: string, vk: string): LexiqueV2State {
  return edit(S, (s) => {
    const dd = ed(s, uid);
    dd.pick = dd.pick === vk ? "" : vk;
    if (dd.pick) applyVariant(s, uid, ek, vk);
  });
}

export function toggleLocal(S: LexiqueV2State, uid: string, pid: string, k: string): Result {
  const id = `${pid}.${k}`;
  const ek = locate(S)[uid]?.k ?? "";
  if (!(S.el[uid]?.p[pid] ?? []).includes(k)) {
    const other = [...gIds(S), ...fIds(S), ...vIds(S.el[uid], ek)];
    const hg = hardOf(id).filter((o) => other.includes(o));
    if (hg.length) return { state: S, msg: `${q(lbl(id))} est incompatible avec ${hg.map((o) => q(lbl(o))).join(", ")}${scopeOf(hg[0]!)}` };
  }
  const rep: string[] = [];
  const state = edit(S, (s) => {
    const dd = ed(s, uid);
    const arr = dd.p[pid] ?? (dd.p[pid] = []);
    const i = arr.indexOf(k);
    if (i > -1) {
      arr.splice(i, 1);
      return;
    }
    hardOf(id).forEach((o) => {
      const [op = "", ok = ""] = o.split(".");
      const t = dd.p[op];
      const j = t ? t.indexOf(ok) : -1;
      if (t && j > -1) {
        t.splice(j, 1);
        rep.push(o);
      }
    });
    arr.push(k);
    while (arr.length > (LOCAL_MAX[pid] ?? 1)) rep.push(`${pid}.${arr.shift()}`);
  });
  return { state, msg: rep.length ? `${q(lbl(id))} remplace ${rep.map((o) => q(lbl(o))).join(", ")}` : undefined };
}

export const toggleContent = (S: LexiqueV2State, uid: string, l: string): LexiqueV2State =>
  edit(S, (s) => {
    const dd = ed(s, uid);
    dd.c = dd.c.includes(l) ? dd.c.filter((y) => y !== l) : [...dd.c, l];
  });

export const setElField = (S: LexiqueV2State, uid: string, field: "note" | "design" | "keep", value: string): LexiqueV2State =>
  edit(S, (s) => void (ed(s, uid)[field] = value));

/** Tirage pour un élément : une variante, du contenu et des options locales pertinentes et cohérentes */
export function surpriseEl(S: LexiqueV2State, uid: string, ek: string): Result {
  const e = elementOf(ek);
  const state = edit(S, (s) => {
    const d = ed(s, uid);
    const vk = pickN(e.v.map((x) => x.k), 1)[0] ?? "";
    d.cmp = false;
    d.pick = "";
    d.v = vk ? [vk] : [];
    d.c = pickN(e.c, Math.min(e.c.length, 3 + Math.floor(Math.random() * 2)));
    d.p = {};
    const imp = IMPLY[`v.${ek}.${vk}`] ?? [];
    const taken = [...gIds(s), ...fIds(s), ...(vk ? [`v.${ek}.${vk}`] : [])];
    LOCAL_IDS.forEach((pid) => {
      const rel = REL[ek]?.[pid];
      if (!rel) return;
      const cands = [...(rel.r ?? []), ...(rel.p ?? [])].filter((k) => !imp.includes(`${pid}.${k}`));
      const sel = pickCoherent(pid, 1 + Math.floor(Math.random() * (LOCAL_MAX[pid] ?? 1)), taken, cands);
      sel.forEach((x) => taken.push(`${pid}.${x}`));
      if (sel.length) d.p[pid] = sel;
    });
    if (vk) applyVariant(s, uid, ek, vk);
  });
  return { state, msg: "Combinaison tirée au sort pour cet élément" };
}

/* ---------- Contrôles ---------- */
export interface CohLink {
  name: string;
  key: string;
}
export interface CohItem {
  pair: string;
  m: string;
  links: CohLink[];
}

/** Nombre d'interactions différentes sur tout le site (globales hors timing, locales, impliquées) */
export function interCount(S: LexiqueV2State): number {
  const set = new Set(gIds(S).filter((o) => o.startsWith("inter.") && o !== "inter.timing"));
  allBricks(S).forEach((b) => {
    const d = S.el[b.uid];
    [...eIds(d), ...implied(d, b.k)].filter((o) => o.startsWith("inter.")).forEach((o) => set.add(o));
  });
  return set.size;
}
export const animAvoided = (S: LexiqueV2State): boolean => gSlot(S, "avoid").sel.includes("anim");
export function animAlert(S: LexiqueV2State): CohItem[] {
  const n = interCount(S);
  return animAvoided(S) && n > 3
    ? [{ pair: "Interactions sur tout le site", m: `${n} différentes alors que « Animations partout » est à éviter (2 ou 3 au maximum).`, links: [{ name: "À éviter", key: "g:avoid" }] }]
    : [];
}

export function contentIssues(d: ElementState | undefined, ek: string): { req: string[]; ban: string[]; vl: string } {
  const v = evOf(d);
  if (!v) return { req: [], ban: [], vl: "" };
  const vc = VC[ek]?.[v] ?? {};
  const cc = d?.c ?? [];
  return { req: (vc.req ?? []).filter((x) => !cc.includes(x)), ban: (vc.ban ?? []).filter((x) => cc.includes(x)), vl: lbl(`v.${ek}.${v}`) };
}

export function structAlerts(S: LexiqueV2State): { pages: Record<string, string[]>; glob: string[]; all: string[] } {
  const pages: Record<string, string[]> = {};
  const glob: string[] = [];
  const all = allBricks(S);
  const g = gIds(S);
  S.pages.forEach((p) => {
    const a: string[] = [];
    const ks = p.bricks.map((b) => b.k);
    const cnt: Record<string, number> = {};
    ks.forEach((k) => (cnt[k] = (cnt[k] ?? 0) + 1));
    Object.keys(cnt)
      .filter((k) => cnt[k]! > 1)
      .forEach((k) => a.push(`${cnt[k]} briques « ${elementOf(k).l} » sur cette page`));
    if (ks.includes("nav") && ks[0] !== "nav") a.push("La Navigation devrait être en haut de la page");
    if (ks.includes("footer") && ks[ks.length - 1] !== "footer") a.push("Le Footer devrait être en bas de la page");
    if (ks.includes("hero") && ks.indexOf("hero") > (ks[0] === "nav" ? 1 : 0)) a.push("Le Hero sert en général de premier écran");
    if (S.mode === "multi" && ks.length && !ks.includes("nav") && !g.includes("layout.sidebar") && !g.includes("layout.os")) a.push("Pas de Navigation sur cette page");
    pages[p.id] = a;
  });
  const has = (k: string) => all.some((b) => b.k === k);
  if (has("case") && !has("projects")) glob.push("Une Étude de cas sans brique Projets pour y mener");
  if (all.length && gSlot(S, "goal").sel.includes("recruiter") && !has("cv")) glob.push("Objectif « Convaincre un recruteur » : ajoute une brique CV");
  if (all.length && !has("contact") && !has("cv")) glob.push("Aucune brique Contact ni CV : comment te joindre ?");
  return {
    pages,
    glob,
    all: [...glob, ...S.pages.flatMap((p) => (pages[p.id] ?? []).map((m) => (S.mode === "multi" ? `${p.name} : ` : "") + m))],
  };
}

/** Étape où se règle un choix (pour les liens des flags et de l'encadré de cohérence) */
export function phaseOf(S: LexiqueV2State, id: string, uid?: string): CohLink | null {
  const [a = ""] = id.split(".");
  if (a === "fmt") return { name: paramOf("type").title, key: "g:type" };
  if (SYS_IDS.includes(id) && gSlot(S, "sys").sel.includes(id)) return { name: SYS.title, key: "g:sys" };
  if (a !== "v" && GLOBAL_IDS.includes(a)) return { name: paramOf(a).title, key: `g:${a}` };
  const l = uid ? locate(S)[uid] : undefined;
  if (!l) return null;
  const el = elementOf(l.k).l + (S.mode === "multi" ? ` (${l.page.name})` : "");
  return { name: `${el} › ${a === "v" ? "Variante" : paramOf(a).title}`, key: `el:${uid}` };
}

export interface FlagItem {
  l: string;
  link: CohLink | null;
}
export interface Flag {
  kind: "hard" | "warn" | "rep";
  label: string;
  items: FlagItem[];
  tail: string;
  blocked: boolean;
}
export interface FlagCtx {
  cur: string;
  uid?: string;
}

/** Flag d'une carte : `same` = choix du même niveau (remplaçables), `other` = niveaux supérieurs (bloquants) */
export function flagOf(S: LexiqueV2State, id: string, on: boolean, same: string[], other: string[], full: boolean, first: string | null, ctx: FlagCtx): Flag | null {
  const it = (ids: string[]): FlagItem[] =>
    ids.map((o) => {
      const ph = phaseOf(S, o, ctx.uid);
      return { l: q(lbl(o)), link: ph && ph.key !== ctx.cur ? ph : null };
    });
  const hO = hardOf(id).filter((o) => other.includes(o));
  const hS = hardOf(id).filter((o) => same.includes(o) && o !== id);
  const ten = [...tensionsOf(id).keys()].filter((o) => same.includes(o) || other.includes(o));
  if (!on && hO.length) return { kind: "hard", label: "Incompatible avec", items: it(hO), tail: "", blocked: true };
  if (!on && hS.length) return { kind: "hard", label: "Incompatible avec", items: it(hS), tail: " : le remplacera", blocked: true };
  if (ten.length) return { kind: "warn", label: "Tension avec", items: it(ten), tail: "", blocked: false };
  if (!on && full && first) return { kind: "rep", label: "Remplacera", items: it([first]), tail: "", blocked: false };
  return null;
}

function cohLinks(S: LexiqueV2State, ids: string[], uid: string | undefined, cur: string): CohLink[] {
  const seen = new Set<string>();
  return ids.flatMap((o) => {
    const ph = phaseOf(S, o, uid);
    if (!ph || ph.key === cur || seen.has(ph.key)) return [];
    seen.add(ph.key);
    return [ph];
  });
}

export interface Coh {
  show: boolean;
  items: CohItem[];
}

/** Encadré de cohérence du panneau droit, selon l'étape */
export function builderCoh(S: LexiqueV2State, step: string): Coh {
  const g = gIds(S);
  const mk = (pairs: [string, string, string, string?][], extra: CohItem[], uid?: string): CohItem[] => [
    ...pairs.map(([a, b, m, u]) => ({ pair: `${q(lbl(a))} + ${q(lbl(b))}`, m, links: cohLinks(S, [a, b], u ?? uid, step) })),
    ...extra,
  ];
  if (step.startsWith("el:")) {
    const uid = step.slice(3);
    const l = locate(S)[uid];
    if (!l) return { show: false, items: [] };
    const d = S.el[uid];
    const ci = contentIssues(d, l.k);
    const extra = [...animAlert(S)];
    if (ci.req.length) extra.push({ pair: `Contenu × ${q(ci.vl)}`, m: `manque ${ci.req.join(", ")}.`, links: [] });
    if (ci.ban.length) extra.push({ pair: `Contenu × ${q(ci.vl)}`, m: `contredit par ${ci.ban.join(", ")}.`, links: [] });
    const ids = [...g, ...fIds(S), ...eIds(d), ...vIds(d, l.k)];
    return { show: ids.length > 0 || extra.length > 0, items: mk(tens(ids), extra, uid) };
  }
  if (step === "final") {
    const seen = new Set<string>();
    const pairs: [string, string, string, string?][] = [];
    [undefined, ...allBricks(S)].forEach((b) => {
      const ids = [...g, ...fIds(S), ...(b ? [...eIds(S.el[b.uid]), ...vIds(S.el[b.uid], b.k)] : [])];
      tens(ids).forEach(([a, c, m]) => {
        if (seen.has(a + "|" + c)) return;
        seen.add(a + "|" + c);
        pairs.push([a, c, m, b?.uid]);
      });
    });
    const extra = [...animAlert(S), ...structAlerts(S).all.map((m) => ({ pair: "Structure", m, links: [{ name: "Structure", key: "structure" }] }))];
    return { show: g.length > 0 || pairs.length > 0 || extra.length > 0, items: mk(pairs, extra) };
  }
  const ids = [...g, ...fIds(S)];
  const extra = [...animAlert(S), ...(step === "structure" ? structAlerts(S).all.map((m) => ({ pair: "Structure", m, links: [] })) : [])];
  return { show: ids.length > 0 || extra.length > 0, items: mk(tens(ids), extra) };
}

/* ---------- Prompts ---------- */
export const typeTxt = (S: LexiqueV2State): string =>
  "portfolio de développeur fullstack" +
  (S.mode === "multi"
    ? ", site multi-pages (une page par grande rubrique)"
    : S.mode === "one"
      ? ", site one-page (toutes les sections sur une seule page, navigation par ancres)"
      : "");

export function globalLines(S: LexiqueV2State): string[] {
  return GLOBAL_IDS.flatMap((pid) => {
    const sl = gSlot(S, pid);
    const fr = pid === "type" ? [typeTxt(S)] : sl.sel.map((k) => example(pid, k)?.p ?? "").filter(Boolean);
    if (sl.note.trim()) fr.push(sl.note.trim());
    return fr.length ? [`[${paramOf(pid).tag}] ${fr.join(" ; ")}.`] : [];
  });
}

export function globalPrompt(S: LexiqueV2State): string {
  const gl = globalLines(S);
  return gl.length ? "Direction globale de mon portfolio, à respecter pour tous les éléments :\n\n" + gl.join("\n\n") : "";
}

export function structureTxt(S: LexiqueV2State, cur?: string): string {
  const nm = (b: { uid: string; k: string }) => elementOf(b.k).l + (b.uid === cur ? " (cet élément)" : "");
  if (S.mode !== "multi") return `Site one-page, sections dans l’ordre : ${S.pages[0]!.bricks.map(nm).join(" → ") || "(à définir)"}.`;
  return "Site multi-pages :\n" + S.pages.map((p) => `- Page « ${p.name} » : ${p.bricks.map(nm).join(" → ") || "(vide)"}`).join("\n");
}

export function elSpec(S: LexiqueV2State, uid: string, noVar = false): string[] {
  const l = locate(S)[uid];
  if (!l) return [];
  const e = elementOf(l.k);
  const d = S.el[uid] ?? emptyEl();
  const out: string[] = [];
  if (d.cmp) {
    const pk = d.pick ? variantOf(l.k, d.pick) : undefined;
    if (pk && !noVar) {
      out.push(`[VARIANTE] ${pk.p}.`);
      if ((d.keep ?? "").trim()) out.push(`[À GARDER DES AUTRES PISTES] ${d.keep!.trim()}.`);
    } else if (!noVar && d.v.length) out.push(`[VARIANTES ENVISAGÉES] ${d.v.map((k) => variantOf(l.k, k)?.l).filter(Boolean).join(" ; ")}.`);
  } else {
    const v = d.v.map((k) => variantOf(l.k, k)?.p).filter(Boolean);
    if (v.length) out.push(`[VARIANTE] ${v.join(" ; ")}.`);
  }
  if (d.c.length) out.push(`[CONTENU] ${d.c.join(", ")}.`);
  const imp = implied(d, e.k);
  LOCAL_IDS.forEach((pid) => {
    const sel = (d.p[pid] ?? []).filter((k) => !imp.includes(`${pid}.${k}`)).map((k) => example(pid, k)?.p).filter(Boolean);
    if (sel.length) out.push(`[${paramOf(pid).tag}] ${sel.join(" ; ")}.`);
  });
  if (d.note.trim()) out.push(`[PRÉCISION] ${d.note.trim()}.`);
  return out;
}

const methodTips = (keys: string[]): string[] => TIPS.filter((t) => keys.includes(t.k)).map((t) => "- " + t.p);

export function elPrompt(S: LexiqueV2State, uid: string, mode: "direct" | "explore" = "direct"): string {
  const l = locate(S)[uid];
  if (!l) return "";
  const explore = mode === "explore";
  const { page: p, i } = l;
  const e = elementOf(l.k);
  const gl = globalLines(S);
  const spec = elSpec(S, uid, explore);
  const dd = S.el[uid] ?? emptyEl();
  const cmpBlock = explore
    ? "\n\nVARIANTES À COMPARER\n" +
      dd.v
        .map((k, j) => {
          const x = variantOf(l.k, k);
          return x ? `${LETTERS[j]} — ${x.l} : ${x.p}` : "";
        })
        .filter(Boolean)
        .join("\n")
    : "";
  const prev = p.bricks[i - 1];
  const next = p.bricks[i + 1];
  const where = S.mode === "multi" ? ` de la page « ${p.name} »` : "";
  const done = S.pages.flatMap((pg) =>
    pg.bricks
      .filter((x) => x.uid !== uid && S.el[x.uid]?.done && (S.el[x.uid]?.design ?? "").trim())
      .map((x) => {
        const t = S.el[x.uid]!.design.trim().replace(/\s+/g, " ");
        return `- ${S.mode === "multi" ? pg.name + " › " : ""}${elementOf(x.k).l} : ${t.slice(0, 260)}${t.length > 260 ? "…" : ""}`;
      }),
  );
  return (
    `Je conçois mon portfolio élément par élément. Voici la direction globale, à respecter pour chaque élément :\n\n${gl.join("\n\n") || "(direction globale non définie : propose une direction cohérente)"}\n\nSTRUCTURE\n${structureTxt(S, uid)}\n\nÉLÉMENT À CONCEVOIR : ${e.l} — élément ${i + 1} sur ${p.bricks.length}${where}, entre ${prev ? q(elementOf(prev.k).l) : "le haut de page"} et ${next ? q(elementOf(next.k).l) : "le bas de page"}.\n${spec.join("\n") || "Aucune contrainte spécifique : propose ce qui sert le mieux l’objectif."}` +
    cmpBlock +
    (done.length ? `\n\nDÉJÀ VALIDÉ (reste cohérent avec ces éléments) :\n${done.join("\n")}` : "") +
    (PROMPT_OPTS.includeMethod ? `\n\n[MÉTHODE]\n${methodTips(["values", "content", "antipatterns"]).join("\n")}` : "") +
    (explore
      ? `\n\nConçois uniquement cet élément, montré en situation dans sa page (les sections voisines peuvent rester esquissées). Produis une proposition par variante ci-dessus, côte à côte, étiquetées ${LETTERS.slice(0, dd.v.length).split("").join(", ")}, avec exactement le même contenu et la même direction globale : seule la variante change. Sous chaque proposition, indique en 2 lignes son intention et son point faible. Reste en fidélité moyenne : l'objectif est de comparer, pas de finaliser.`
      : `\n\nConçois uniquement cet élément, montré en situation dans sa page (les sections voisines peuvent rester esquissées). ${PROMPT_OPTS.directions === 3 ? "Propose 3 directions contrastées pour cet élément ; je choisirai ensuite." : "Propose une direction aboutie pour cet élément."}`)
  );
}

export function refinePrompt(S: LexiqueV2State, uid: string): string {
  const l = locate(S)[uid];
  const d = S.el[uid];
  if (!l || !d?.pick) return "";
  const pk = variantOf(l.k, d.pick);
  if (!pk) return "";
  const spec = elSpec(S, uid).filter((x) => !x.startsWith("[À GARDER"));
  return (
    `Dans l'exploration précédente de l'élément « ${elementOf(l.k).l} », je retiens la proposition ${LETTERS[d.v.indexOf(d.pick)]} (${pk.l}).` +
    ((d.keep ?? "").trim() ? `\n\nÀ reprendre des autres propositions : ${d.keep!.trim()}.` : "\n\nN’emprunte rien aux autres propositions.") +
    `\n\nAffine-la jusqu'à une version aboutie de l'élément. La direction globale reste inchangée. Contraintes de l'élément :\n${spec.join("\n")}` +
    (PROMPT_OPTS.includeMethod ? `\n\n[MÉTHODE]\n${methodTips(["values", "antipatterns"]).join("\n")}` : "") +
    "\n\nLivre une seule version finale, prête à être codée : valeurs précises (couleurs, tailles, espacements, durées), états (survol, focus) et comportement responsive."
  );
}

/** Prompt de l'élément selon son mode : direct, exploration (≥ 2 variantes) ou affinage (lettre choisie) */
export function elCurrentPrompt(S: LexiqueV2State, uid: string): string {
  const d = S.el[uid];
  if (!d?.cmp) return elPrompt(S, uid);
  if (d.pick) return refinePrompt(S, uid);
  return d.v.length >= 2 ? elPrompt(S, uid, "explore") : "";
}

export function finalPrompt(S: LexiqueV2State): string {
  const gl = globalLines(S);
  const counts: Record<string, number> = {};
  allBricks(S).forEach((b) => (counts[b.k] = (counts[b.k] ?? 0) + 1));
  const shared = Object.keys(counts)
    .filter((k) => counts[k]! > 1)
    .map((k) => elementOf(k).l);
  let n = 0;
  const specs = S.pages.flatMap((p) =>
    p.bricks.map((b) => {
      n++;
      const design = (S.el[b.uid]?.design ?? "").trim();
      return `### ${n}. ${S.mode === "multi" ? p.name + " › " : ""}${elementOf(b.k).l}\n${elSpec(S, b.uid).join("\n") || "(pas de contrainte spécifique)"}\nDesign retenu :\n"""\n${design || "(non renseigné : déduis-le de la direction globale et des éléments voisins)"}\n"""`;
    }),
  );
  if (!n) return "";
  return `Code le portfolio décrit ci-dessous. Chaque élément a été conçu et validé au préalable avec Claude Design : respecte fidèlement le design retenu.\n\nSTACK\n${S.stack.trim() || "Choisis une stack adaptée à ce projet et justifie-la en 3 lignes avant de commencer."}\n\nDIRECTION GLOBALE\n${gl.join("\n\n") || "(non définie)"}\n\nARCHITECTURE\n${structureTxt(S)}\n\nSPÉCIFICATIONS PAR ÉLÉMENT\n\n${specs.join("\n\n")}\n\nCONSIGNES DE CODE\n- Centralise les tokens (couleurs, typographies, espacements, rayons) issus de la direction globale.\n- Un composant par élément${shared.length ? ` ; réutilise le même composant pour les éléments présents sur plusieurs pages (${shared.join(", ")})` : ""}.\n- Respecte [RESPONSIVE & ACCESSIBILITÉ] et [À ÉVITER] sur tout le site.\n- Contenu réaliste, jamais de lorem ipsum.\n- Avance page par page ; à la fin de chaque page, liste ce qui reste à faire.`;
}

/* ---------- Personnalité (axes) ---------- */
const AXES = paramOf("perso").axes ?? [];
export function axesOf(S: LexiqueV2State): { v: number; l: string; r: string }[] {
  const sel = gSlot(S, "perso").sel;
  return AXES.map((a, j) => {
    const v = sel.length ? sel.reduce((t, k) => t + (AX[k]?.[j] ?? 0), 0) / sel.length : 0;
    return { v, l: a[0], r: a[1] };
  });
}
export function axisLabel({ v, l, r }: { v: number; l: string; r: string }): { txt: string; pct: number | null } {
  if (Math.abs(v) < 0.15) return { txt: "Équilibré", pct: null };
  const pct = Math.round(50 + Math.abs(v) * 50);
  return { txt: `${Math.abs(v) > 0.7 ? "Très" : "Plutôt"} ${(v < 0 ? l : r).toLowerCase()} · ${pct} %`, pct };
}

/* ---------- Aperçus (HTML statique écrit par nous, jamais de saisie utilisateur) ---------- */
export function isDark(hex: string): boolean {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 140;
}

export function preview(p: Param, ex: Example): string {
  const k = p.kind;
  if (k === "style") return VG[ex.k] ?? "";
  if (k === "wire") return WF[ex.k] ?? "";
  if (k === "ref") return REFV[ex.k] ?? "";
  if (k === "img") return IMGV[ex.k] ?? "";
  if (k === "demo") return DEMO[ex.k] ?? "";
  if (k === "shape") return `<div class="shp shp-${ex.k}"><div class="o">${ex.k === "grain" ? "Grain" : ex.k === "paper" ? "Fait main" : "Bouton"}</div></div>`;
  const v = ex.pv;
  if (k === "font" && v) {
    if (v.pair) return `<div class="fs"><span style="font:400 40px/1 'Instrument Serif',serif">Titre élégant</span><span style="font:400 13px/1.4 'DM Sans',sans-serif;color:var(--ink-2)">Et un texte courant neutre, très lisible, qui laisse respirer les titres.</span><span class="nm">${v.nm ?? ""}</span></div>`;
    if (v.scale) return `<div class="fs" style="justify-content:flex-end;gap:2px"><span style="font:800 56px/.85 Inter,sans-serif;letter-spacing:-.05em">Hero</span><span style="font:700 20px/1 Inter,sans-serif">Sous-titre</span><span style="font:400 11px Inter,sans-serif;color:var(--ink-2)">Texte courant en 16 px</span></div>`;
    const st = `font-family:${v.f};font-weight:${v.w};font-style:${v.st || "normal"};letter-spacing:${v.ls || "normal"};text-transform:${v.tt || "none"}`;
    return `<div class="fs"><span class="aa" style="${st}">Aa</span><span class="ln" style="${st}">Créer des interfaces</span><span class="nm">${v.nm ?? ""}</span></div>`;
  }
  if (k === "swatch" && v) {
    if (v.grad) return `<div class="sw-grad" style="background:${v.grad}"></div>`;
    if (v.ratio) return `<div class="sw-wrap">${v.ratio.map(([c, r]) => `<i class="${isDark(c) ? "dk" : ""}" style="background:${c};flex:${r}">${r}%</i>`).join("")}</div>`;
    return `<div class="sw-wrap">${(v.c ?? []).map((c) => `<i class="${isDark(c) ? "dk" : ""}" style="background:${c}">${c}</i>`).join("")}</div>`;
  }
  return "";
}

/** Source de la vignette : une option « système » garde celle de son paramètre d'origine */
export function previewOf(p: Param, ex: Example): { param: Param; ex: Example } {
  if (!ex.from) return { param: p, ex };
  const [, k = ""] = ex.k.split(".");
  const src = example(ex.from, k);
  return src ? { param: paramOf(ex.from), ex: src } : { param: p, ex };
}
