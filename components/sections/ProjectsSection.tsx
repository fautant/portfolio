"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Github, ExternalLink, Code2 } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { SectionWrapper } from "./SectionWrapper";
import { TextReveal } from "@/components/animations/TextReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects, getAllCategories, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = getAllCategories();

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const featured = filteredProjects.find((p) => p.featured);
  const rest = filteredProjects.filter((p) => p !== featured);

  const categoryLabels: Record<string, string> = {
    web: "Web",
    mobile: "Mobile",
    desktop: "Desktop",
    devops: "DevOps",
  };

  return (
    <SectionWrapper id="projects" background="default">
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

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <FilterButton
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          {t("filterAll")}
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
          >
            {categoryLabels[category]}
          </FilterButton>
        ))}
      </div>

      {/* Featured project (full width) */}
      <AnimatePresence mode="popLayout">
        {featured && (
          <motion.div
            key={featured.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <FeaturedProjectCard project={featured} locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of projects grid */}
      <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {rest.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TiltProjectCard project={project} locale={locale} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-text-muted dark:text-text-muted-light py-12">
          {t("noProjects")}
        </p>
      )}
    </SectionWrapper>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2 rounded-full font-medium transition-all duration-300",
        active
          ? "bg-gradient-primary text-white shadow-primary"
          : "bg-white/80 dark:bg-white/5 backdrop-blur-sm text-text-muted dark:text-text-muted-light hover:text-primary border border-white/30 dark:border-white/10"
      )}
    >
      {children}
    </button>
  );
}

function FeaturedProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  const t = useTranslations("projects");
  const desc = locale === "en" ? project.description.en : project.description.fr;
  const longDesc = project.longDescription
    ? locale === "en"
      ? project.longDescription.en
      : project.longDescription.fr
    : null;
  const role = project.role
    ? locale === "en"
      ? project.role.en
      : project.role.fr
    : null;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all">
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="grid md:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative h-48 md:h-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          <Code2 className="w-20 h-20 text-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
          <div className="absolute top-4 left-4">
            <Badge variant="gradient" className="text-xs">
              Featured
            </Badge>
          </div>
        </div>

        {/* Content side */}
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-heading-3 font-bold text-text-dark dark:text-text-light">
              {project.title}
            </h3>
            <Badge className="text-xs capitalize bg-primary/10 text-primary border-primary/20 shrink-0">
              {project.category}
            </Badge>
          </div>

          {role && (
            <p className="text-sm text-secondary font-semibold mb-3">{role}</p>
          )}

          <p className="text-text-muted dark:text-text-muted-light mb-2">
            {desc}
          </p>
          {longDesc && (
            <p className="text-sm text-text-muted dark:text-text-muted-light mb-4">
              {longDesc}
            </p>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  {t("viewCode")}
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="sm" asChild>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("viewDemo")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TiltProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  const t = useTranslations("projects");
  const cardRef = useRef<HTMLDivElement>(null);
  const desc = locale === "en" ? project.description.en : project.description.fr;
  const role = project.role
    ? locale === "en"
      ? project.role.en
      : project.role.fr
    : null;

  const categoryColors: Record<string, string> = {
    web: "bg-primary/10 text-primary border-primary/20",
    mobile: "bg-secondary/10 text-secondary border-secondary/20",
    desktop: "bg-accent/10 text-accent-dark border-accent/20",
    devops: "bg-text-muted/10 text-text-muted border-text-muted/20",
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 1024) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group h-full rounded-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-card hover:shadow-card-hover transition-shadow"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-inset ring-gradient-start/30" />

      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center overflow-hidden">
        <Code2 className="w-14 h-14 text-primary/20 group-hover:scale-110 transition-transform duration-300" />
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="gradient" className="text-xs">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-text-dark dark:text-text-light">
            {project.title}
          </h3>
          <Badge className={cn("text-xs capitalize shrink-0", categoryColors[project.category])}>
            {project.category}
          </Badge>
        </div>

        {role && (
          <p className="text-sm text-secondary font-medium mb-2">{role}</p>
        )}

        <p className="text-sm text-text-muted dark:text-text-muted-light mb-4">
          {desc}
        </p>

        {/* Tech badges (slide up on hover) */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 5}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                {t("viewCode")}
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button size="sm" asChild className="flex-1">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                {t("viewDemo")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
