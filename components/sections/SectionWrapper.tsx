"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "alt" | "gradient";
}

export function SectionWrapper({
  id,
  children,
  className,
  containerClassName,
  background = "default",
}: SectionWrapperProps) {
  const bgClasses = {
    default: "bg-background-light dark:bg-background-dark",
    alt: "bg-background-light-alt dark:bg-background-dark-alt",
    gradient: "bg-gradient-subtle",
  };

  return (
    <section
      id={id}
      className={cn("section-padding", bgClasses[background], className)}
    >
      <div className={cn("container-custom mx-auto", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
