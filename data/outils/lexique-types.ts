/** Aperçu visuel d'un exemple de typographie ou de palette */
export interface Pv {
  nm?: string;
  f?: string;
  w?: string | number;
  st?: string;
  ls?: string;
  tt?: string;
  pair?: boolean;
  scale?: boolean;
  c?: string[];
  grad?: string;
  ratio?: [string, number][];
}

export interface Example {
  k: string;
  l: string;
  p: string;
  u?: string;
  hint?: string;
  pv?: Pv;
}

export type ParamKind = "text" | "style" | "wire" | "ref" | "img" | "demo" | "shape" | "font" | "swatch";

export interface Param {
  id: string;
  tag: string;
  title: string;
  kind: ParamKind;
  added?: boolean;
  cls?: string;
  lead: string;
  qs: string[];
  sample: string;
  tip?: string;
  axes?: [string, string][];
  ex: Example[];
}

export interface Preset {
  name: string;
  vg: string;
  desc: string;
  sel: Record<string, string[]>;
}

export interface Tip {
  k: string;
  t: string;
  d: string;
  p: string;
}

export interface ParamState {
  sel: string[];
  note: string;
}

export type LexiqueState = Record<string, ParamState>;
