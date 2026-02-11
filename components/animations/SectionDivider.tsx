"use client";

import { cn } from "@/lib/utils";

type DividerVariant = "wave" | "curve" | "angle";

interface SectionDividerProps {
  variant?: DividerVariant;
  flip?: boolean;
  className?: string;
  fromColor?: string;
  toColor?: string;
}

export function SectionDivider({
  variant = "wave",
  flip = false,
  className,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden leading-none -my-px",
        flip && "rotate-180",
        className
      )}
    >
      {variant === "wave" && <WaveSvg />}
      {variant === "curve" && <CurveSvg />}
      {variant === "angle" && <AngleSvg />}
    </div>
  );
}

function WaveSvg() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-[40px] md:h-[60px] fill-current text-background-light dark:text-background-dark"
    >
      <path d="M0,40 C300,100 400,0 600,40 C800,80 900,0 1200,40 L1200,120 L0,120 Z" />
    </svg>
  );
}

function CurveSvg() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-[40px] md:h-[60px] fill-current text-background-light dark:text-background-dark"
    >
      <path d="M0,80 Q600,0 1200,80 L1200,120 L0,120 Z" />
    </svg>
  );
}

function AngleSvg() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-[30px] md:h-[50px] fill-current text-background-light dark:text-background-dark"
    >
      <path d="M0,120 L600,20 L1200,120 Z" />
    </svg>
  );
}
