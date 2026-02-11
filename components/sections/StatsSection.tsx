"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
}

const stats: StatItem[] = [
  { value: 5, suffix: "+", labelKey: "projects" },
  { value: 3, suffix: "", labelKey: "years" },
  { value: 2, suffix: "", labelKey: "languages" },
  { value: 1, suffix: "", labelKey: "internship" },
];

export function StatsSection() {
  const t = useTranslations("stats");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for stat items
      const statItems = sectionRef.current?.querySelectorAll("[data-stat-item]");
      if (statItems) {
        gsap.set(statItems, { y: 40, opacity: 0, scale: 0.8 });
        ScrollTrigger.batch(statItems, {
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.1,
              duration: 0.6,
              ease: "back.out(1.4)",
            }),
          start: "top 85%",
          once: true,
        });
      }

      // Background gradient shift on scroll
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          backgroundPosition: "100% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Counter animations
      const counters = sectionRef.current?.querySelectorAll("[data-counter]");
      if (!counters) return;

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-counter") || "0", 10);
        const suffix = counter.getAttribute("data-suffix") || "";

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            counter.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }, sectionRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.labelKey} data-stat-item className="text-center">
              <div
                data-counter={stat.value}
                data-suffix={stat.suffix}
                className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2"
              >
                0
              </div>
              <p className="text-sm md:text-base text-text-muted dark:text-text-muted-light font-medium">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
