"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  splitBy?: "words" | "chars";
  trigger?: "scroll" | "mount";
  scrub?: boolean;
}

export function TextReveal({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  splitBy = "chars",
  trigger = "mount",
  scrub = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const parts =
      splitBy === "words" ? children.split(" ") : children.split("");

    el.innerHTML = "";

    const spans: HTMLSpanElement[] = [];

    parts.forEach((part, i) => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = part === " " ? "\u00A0" : part;
      inner.style.willChange = "transform, opacity";

      wrapper.appendChild(inner);
      el.appendChild(wrapper);

      if (splitBy === "words" && i < parts.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        space.style.display = "inline-block";
        el.appendChild(space);
      }

      spans.push(inner);
    });

    const animProps: gsap.TweenVars = {
      y: "110%",
      opacity: 0,
      duration,
      stagger,
      ease: "power3.out",
      delay: trigger === "mount" ? delay : 0,
    };

    if (trigger === "scroll") {
      gsap.from(spans, {
        ...animProps,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 20%",
          scrub: scrub ? 1 : false,
          once: !scrub,
        },
      });
    } else {
      gsap.from(spans, animProps);
    }

    return () => {
      gsap.killTweensOf(spans);
    };
  }, [children, delay, duration, stagger, splitBy, trigger, scrub]);

  return <Tag ref={containerRef as React.RefObject<never>} className={className} />;
}
