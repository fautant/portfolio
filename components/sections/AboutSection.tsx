"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  GraduationCap,
  Briefcase,
  Camera,
  Mountain,
  BookOpen,
  Users,
  Target,
  Zap,
  Globe,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionWrapper } from "./SectionWrapper";
import { TextReveal } from "@/components/animations/TextReveal";

interface TimelineItem {
  year: string;
  titleKey: string;
  subtitleKey: string;
  descKey?: string;
  icon: React.ReactNode;
  color: string;
}

export function AboutSection() {
  const t = useTranslations("about");
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const timelineItems: TimelineItem[] = [
    {
      year: t("education.year2"),
      titleKey: "education.degree2",
      subtitleKey: "education.school2",
      descKey: "education.mention",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "bg-accent",
    },
    {
      year: t("education.year1"),
      titleKey: "education.degree1",
      subtitleKey: "education.school1",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "bg-secondary",
    },
    {
      year: t("experience.period1"),
      titleKey: "experience.job1",
      subtitleKey: "experience.company1",
      descKey: "experience.description1",
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-primary",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the timeline line drawing
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 1,
          },
        });
      }

      // Animate timeline items
      const items = timelineRef.current?.querySelectorAll("[data-timeline-item]");
      if (items) {
        items.forEach((item, i) => {
          gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -50 : 50 });
          gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              once: true,
            },
          });
        });
      }

      // Batch animate cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll("[data-card]");
        gsap.set(cards, { opacity: 0, y: 40 });

        ScrollTrigger.batch(cards, {
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power3.out",
            }),
          start: "top 85%",
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="about" background="default">
      {/* Section heading */}
      <div className="text-center mb-16">
        <TextReveal
          as="h2"
          trigger="scroll"
          splitBy="words"
          className="text-display font-display font-bold mb-4 text-text-dark dark:text-text-light"
        >
          {t("title")}
        </TextReveal>
        <p className="text-lg text-text-muted dark:text-text-muted-light max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative max-w-3xl mx-auto mb-20">
        {/* Vertical line */}
        <div
          ref={lineRef}
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-secondary to-primary md:-translate-x-1/2"
        />

        <div className="space-y-12">
          {timelineItems.map((item, i) => (
            <div
              key={i}
              data-timeline-item
              className={`relative flex items-start gap-6 md:gap-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <div
                className={`flex-1 ml-14 md:ml-0 ${
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <span className="inline-block text-sm font-semibold text-secondary mb-1">
                  {item.year}
                </span>
                <h3 className="text-lg font-bold text-text-dark dark:text-text-light">
                  {t(item.titleKey)}
                </h3>
                <p className="text-text-muted dark:text-text-muted-light">
                  {t(item.subtitleKey)}
                </p>
                {item.descKey && (
                  <p className="text-sm text-accent font-medium mt-1">
                    {t(item.descKey)}
                  </p>
                )}
              </div>

              {/* Dot */}
              <div
                className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full ${item.color} ring-4 ring-background-light dark:ring-background-dark flex items-center justify-center text-white`}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Soft Skills */}
        <div
          data-card
          className="rounded-2xl p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
        >
          <h4 className="font-bold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {t("softSkills.title")}
          </h4>
          <div className="space-y-3">
            <SkillPill icon={<Users className="w-4 h-4" />} label={t("softSkills.teamwork")} />
            <SkillPill icon={<Target className="w-4 h-4" />} label={t("softSkills.organized")} />
            <SkillPill icon={<Zap className="w-4 h-4" />} label={t("softSkills.adaptability")} />
          </div>
        </div>

        {/* Languages */}
        <div
          data-card
          className="rounded-2xl p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
        >
          <h4 className="font-bold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            {t("languages.title")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-dark dark:text-text-light font-medium">
                {t("languages.french")}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="w-2 h-2 rounded-full bg-primary" />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-dark dark:text-text-light font-medium">
                {t("languages.english")}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-2 h-2 rounded-full bg-secondary" />
                ))}
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div
          data-card
          className="rounded-2xl p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
        >
          <h4 className="font-bold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent" />
            {t("interests.title")}
          </h4>
          <div className="space-y-3">
            <SkillPill icon={<Camera className="w-4 h-4" />} label={t("interests.photography")} />
            <SkillPill icon={<Mountain className="w-4 h-4" />} label={t("interests.hiking")} />
            <SkillPill icon={<BookOpen className="w-4 h-4" />} label={t("interests.reading")} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function SkillPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl bg-background-light/50 dark:bg-background-dark/50">
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium text-text-dark dark:text-text-light">
        {label}
      </span>
    </div>
  );
}
