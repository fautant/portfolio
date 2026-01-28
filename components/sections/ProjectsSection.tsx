"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Code2 } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects, getAllCategories, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = getAllCategories();

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const categoryLabels: Record<string, string> = {
    web: "Web",
    mobile: "Mobile",
    desktop: "Desktop",
    devops: "DevOps",
  };

  return (
    <SectionWrapper id="projects" background="default">
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

      {/* Filter buttons */}
      <ScrollReveal delay={0.1}>
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
      </ScrollReveal>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProjectCard project={project} locale={locale} />
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

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full font-medium transition-all",
        active
          ? "bg-gradient-primary text-white shadow-primary"
          : "bg-white dark:bg-background-dark-alt text-text-muted dark:text-text-muted-light hover:text-primary border border-border"
      )}
    >
      {children}
    </button>
  );
}

interface ProjectCardProps {
  project: Project;
  locale: string;
}

function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations("projects");
  const description =
    locale === "en" ? project.description.en : project.description.fr;
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

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col overflow-hidden group">
        {/* Project image/placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          <Code2 className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
          {project.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="gradient" className="text-xs">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <Badge
              className={cn("text-xs capitalize", categoryColors[project.category])}
            >
              {project.category}
            </Badge>
          </div>
          {role && (
            <p className="text-sm text-secondary font-medium">{role}</p>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-text-muted dark:text-text-muted-light mb-4 flex-1">
            {description}
          </p>

          {/* Technologies */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-text-dark dark:text-text-light mb-2">
              {t("technologies")}
            </p>
            <div className="flex flex-wrap gap-1.5">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
