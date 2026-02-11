"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionWrapper } from "./SectionWrapper";
import { TextReveal } from "@/components/animations/TextReveal";
import { ParticleCanvas } from "@/components/animations/ParticleCanvas";
import { skillCategories, type Skill } from "@/data/skills";
import { cn } from "@/lib/utils";

const categoryConfig: Record<
  string,
  { gradient: string; barColor: string; colSpan: string }
> = {
  backend: {
    gradient: "from-primary to-primary-light",
    barColor: "bg-primary",
    colSpan: "sm:col-span-2 lg:col-span-1",
  },
  frontend: {
    gradient: "from-secondary to-secondary-light",
    barColor: "bg-secondary",
    colSpan: "sm:col-span-2 lg:col-span-1",
  },
  mobile: {
    gradient: "from-accent to-accent-light",
    barColor: "bg-accent",
    colSpan: "",
  },
  database: {
    gradient: "from-primary to-secondary",
    barColor: "bg-gradient-primary",
    colSpan: "",
  },
  devops: {
    gradient: "from-secondary to-accent",
    barColor: "bg-secondary",
    colSpan: "",
  },
  languages: {
    gradient: "from-accent to-primary",
    barColor: "bg-accent",
    colSpan: "",
  },
};

export function SkillsSection() {
  const t = useTranslations("skills");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      // Batch reveal cards
      const skillCards = gridRef.current.querySelectorAll("[data-skill-card]");
      gsap.set(skillCards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(skillCards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
          }),
        start: "top 85%",
        once: true,
      });

      // Animate skill bars
      const bars = gridRef.current.querySelectorAll("[data-skill-bar]");
      bars.forEach((bar) => {
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(bar, {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="skills" background="alt" className="relative overflow-hidden">
      <ParticleCanvas className="opacity-40 dark:opacity-60" />

      <div className="relative z-10">
        <div className="text-center mb-12">
          <TextReveal
            as="h2"
            trigger="scroll"
            splitBy="words"
            className="text-display font-display font-bold mb-4 text-text-dark dark:text-text-light"
          >
            {t("title")}
          </TextReveal>
          <p className="text-lg text-text-muted dark:text-text-muted-light max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const config = categoryConfig[category.key] || {
              gradient: "from-primary to-secondary",
              barColor: "bg-primary",
              colSpan: "",
            };

            return (
              <div
                key={category.key}
                data-skill-card
                className={cn(
                  "rounded-2xl p-6 backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1",
                  config.colSpan
                )}
              >
                {/* Category header */}
                <div
                  className={cn(
                    "inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-5 bg-gradient-to-r",
                    config.gradient
                  )}
                >
                  {t(`categories.${category.key}`)}
                </div>

                {/* Skills with bars */}
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <SkillRow
                      key={skill.name}
                      skill={skill}
                      barColor={config.barColor}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

function SkillRow({
  skill,
  barColor,
}: {
  skill: Skill;
  barColor: string;
}) {
  const percentage = (skill.level / 5) * 100;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-text-dark dark:text-text-light">
            {skill.name}
          </span>
          {skill.featured && (
            <Star className="w-3 h-3 text-accent fill-accent" />
          )}
        </div>
        <span className="text-xs text-text-muted dark:text-text-muted-light">
          {skill.level}/5
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          data-skill-bar={skill.level}
          className={cn("h-full rounded-full", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
