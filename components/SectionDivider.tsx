"use client";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "angle";
  flip?: boolean;
  className?: string;
}

export function SectionDivider({
  variant = "wave",
  flip = false,
  className = "",
}: SectionDividerProps) {
  const paths: Record<string, string> = {
    wave: "M0,64 C320,128 640,0 960,64 C1280,128 1600,0 1920,64 L1920,0 L0,0 Z",
    curve: "M0,96 Q960,0 1920,96 L1920,0 L0,0 Z",
    angle: "M0,64 L1920,0 L1920,0 L0,0 Z",
  };

  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 1920 128"
        preserveAspectRatio="none"
        className="w-full h-[40px] md:h-[60px] lg:h-[80px]"
      >
        <path
          d={paths[variant]}
          className="fill-white dark:fill-background-dark-alt"
        />
      </svg>
    </div>
  );
}
