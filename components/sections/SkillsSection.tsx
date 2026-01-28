"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { skillCategories, type Skill } from "@/data/skills";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <SectionWrapper id="skills" background="alt">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-display font-display font-bold mb-4 text-text-dark dark:text-text-light">
            {t("title")}
          </h2>
          <p className="text-lg text-text-muted dark:text-text-muted-light max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <ScrollReveal key={category.key} delay={categoryIndex * 0.1}>
            <SkillCategory
              categoryKey={category.key}
              skills={category.skills}
              index={categoryIndex}
            />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

interface SkillCategoryProps {
  categoryKey: string;
  skills: Skill[];
  index: number;
}

function SkillCategory({ categoryKey, skills, index }: SkillCategoryProps) {
  const t = useTranslations("skills.categories");

  const colors = [
    "from-primary to-primary-light",
    "from-secondary to-secondary-light",
    "from-accent to-accent-light",
    "from-primary to-secondary",
    "from-secondary to-accent",
    "from-accent to-primary",
  ];

  const colorIndex = index % colors.length;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-background-dark rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div
        className={cn(
          "inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-4 bg-gradient-to-r",
          colors[colorIndex]
        )}
      >
        {t(categoryKey)}
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

interface SkillBadgeProps {
  skill: Skill;
}

function SkillBadge({ skill }: SkillBadgeProps) {
  const variant = skill.featured ? "gradient" : "outline";

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge variant={variant} className="flex items-center gap-1.5 py-1.5">
        {skill.name}
        {skill.featured && <Star className="w-3 h-3 fill-current" />}
      </Badge>
    </motion.div>
  );
}
