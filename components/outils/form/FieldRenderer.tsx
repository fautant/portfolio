"use client";

import { visibleFields, type FieldDef, type FieldValue, type FieldValues } from "@/data/outils/form-fields";

interface FieldProps {
  def: FieldDef;
  value: FieldValue | undefined;
  onChange: (v: FieldValue) => void;
}

const asText = (v: FieldValue | undefined): string => (Array.isArray(v) ? v.join("\n") : (v ?? ""));
const asList = (v: FieldValue | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);

/** Rend un champ du formulaire adaptatif selon son type */
export function FieldRenderer({ def, value, onChange }: FieldProps) {
  const label = (
    <span>
      {def.label}
      {def.required && <b aria-hidden="true"> *</b>}
    </span>
  );
  const help = def.help ? <small>{def.help}</small> : null;

  switch (def.type) {
    case "text":
      return (
        <label className="o-field">
          {label}
          <input value={asText(value)} maxLength={400} required={def.required} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    case "textarea":
      return (
        <label className="o-field">
          {label}
          <textarea value={asText(value)} maxLength={4000} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    case "list":
      return (
        <label className="o-field">
          {label}
          <textarea value={asText(value)} maxLength={4000} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value.split("\n").slice(0, 30))} />
          {help}
        </label>
      );
    case "select":
      return (
        <label className="o-field">
          {label}
          <select value={asText(value)} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {def.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {help}
        </label>
      );
    case "chips": {
      const selected = asList(value);
      return (
        <div className="o-field" role="group" aria-label={def.label}>
          {label}
          <div className="pj-checks">
            {def.options?.map((o) => (
              <label key={o} className="pj-check">
                <input type="checkbox" checked={selected.includes(o)} onChange={(e) => onChange(e.target.checked ? [...selected, o] : selected.filter((x) => x !== o))} />
                {o}
              </label>
            ))}
          </div>
          {help}
        </div>
      );
    }
    case "toggle":
      return (
        <div className="o-field">
          <label className="pj-check" style={{ display: "inline-flex" }}>
            <input type="checkbox" checked={value === "yes"} onChange={(e) => onChange(e.target.checked ? "yes" : "no")} />
            {def.label}
          </label>
          {help}
        </div>
      );
  }
}

interface GroupProps {
  defs: readonly FieldDef[];
  values: FieldValues;
  onChange: (id: string, v: FieldValue) => void;
}

/** Une série de champs ; ceux dont la condition `showIf` n'est pas remplie sont masqués */
export function FieldGroup({ defs, values, onChange }: GroupProps) {
  return (
    <div className="pj-two">
      {visibleFields(defs, values).map((d) => (
        <div key={d.id} style={d.type === "textarea" || d.type === "list" || d.type === "chips" ? { gridColumn: "1 / -1" } : undefined}>
          <FieldRenderer def={d} value={values[d.id]} onChange={(v) => onChange(d.id, v)} />
        </div>
      ))}
    </div>
  );
}
