"use client";

import { cn } from "@/lib/utils";

const technologies = [
  "Symfony",
  "Laravel",
  "Next.js",
  "React",
  "TypeScript",
  "PHP",
  "Docker",
  "MySQL",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Git",
  "Angular",
  "Java",
  "C++",
  "Python",
  "PostgreSQL",
  "Android Studio",
  "Bootstrap",
  "Linux",
];

export function TechMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden py-8 bg-gradient-to-r from-primary/[0.03] via-secondary/[0.03] to-accent/[0.03]",
        className
      )}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent pointer-events-none" />

      <div className="group flex marquee-track">
        {/* First copy */}
        <div className="flex shrink-0 items-center gap-8 animate-marquee group-hover:[animation-play-state:paused]">
          {technologies.map((tech, i) => (
            <span
              key={`a-${i}`}
              className="whitespace-nowrap text-sm font-semibold text-text-muted/60 dark:text-text-muted-light/60 hover:text-primary dark:hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-transparent hover:border-primary/20 hover:bg-primary/5"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* Second copy for seamless loop */}
        <div className="flex shrink-0 items-center gap-8 animate-marquee group-hover:[animation-play-state:paused]">
          {technologies.map((tech, i) => (
            <span
              key={`b-${i}`}
              className="whitespace-nowrap text-sm font-semibold text-text-muted/60 dark:text-text-muted-light/60 hover:text-primary dark:hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-transparent hover:border-primary/20 hover:bg-primary/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
