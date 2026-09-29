"use client";

import { useCallback } from "react";
import { savePrompt, saveProjectPart } from "@/app/outils/(prive)/actions";
import type { LexiqueState } from "@/data/outils/lexique-types";
import { useAutosave } from "@/hooks/useAutosave";
import { LexiqueApp } from "./LexiqueApp";
import { SaveStatus } from "../SaveStatus";

interface Props {
  projectId: string;
  projectName: string;
  initialState: LexiqueState;
  initialTips: Record<string, boolean>;
}

/** Lexique rattaché à un projet : enregistrement automatique dans Supabase */
export function LexiqueProject({ projectId, projectName, initialState, initialTips }: Props) {
  const save = useCallback((v: { state: LexiqueState; tips: Record<string, boolean> }) => saveProjectPart(projectId, "lexique", v), [projectId]);
  const { schedule, status } = useAutosave(save);
  const onChange = useCallback((state: LexiqueState, tips: Record<string, boolean>) => schedule({ state, tips }), [schedule]);
  const onCopy = useCallback(
    (prompt: string) => {
      void savePrompt({ projectId, kind: "lexique", label: "Direction artistique", prompt });
    },
    [projectId],
  );

  return (
    <LexiqueApp
      initialState={initialState}
      initialTips={initialTips}
      onChange={onChange}
      onCopy={onCopy}
      stepKey={`lexique-prompt-design-v1-step-${projectId}`}
      brandSub={projectName}
      links={[
        { href: `/outils/projets/${projectId}/contexte`, label: "← Contexte" },
        { href: `/outils/projets/${projectId}/sections`, label: "Sections →" },
      ]}
      status={<SaveStatus status={status} />}
    />
  );
}
