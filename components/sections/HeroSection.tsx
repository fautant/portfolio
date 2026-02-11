"use client";

import { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download, Github, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

const HeroOrb = dynamic(
  () => import("@/components/animations/HeroOrb").then((m) => m.HeroOrb),
  { ssr: false }
);

export function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    const mesh = meshRef.current;
    if (!section || !content || !visual || !mesh) return;

    const ctx = gsap.context(() => {
      // Animated gradient mesh
      const blobs = mesh.querySelectorAll(".mesh-blob");
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          duration: `random(15, 25)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 2,
        });
      });

      // Set initial hidden state for all hero elements
      gsap.set("[data-hero-badge]", { y: 30, opacity: 0 });
      gsap.set("[data-hero-role]", { y: 30, opacity: 0 });
      gsap.set("[data-hero-typing]", { y: 20, opacity: 0 });
      gsap.set("[data-hero-tagline]", { y: 20, opacity: 0 });
      gsap.set("[data-hero-cta]", { y: 30, opacity: 0 });
      gsap.set("[data-hero-social]", { y: 20, opacity: 0 });
      gsap.set(visual, { opacity: 0 });
      gsap.set("[data-hero-scroll]", { y: -20, opacity: 0 });

      // Hero timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to("[data-hero-badge]", {
        y: 0,
        opacity: 1,
        duration: 0.6,
      })
        .to(
          "[data-hero-role]",
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        )
        .to(
          "[data-hero-typing]",
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        .to(
          "[data-hero-tagline]",
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        .to(
          "[data-hero-cta]",
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        )
        .to(
          "[data-hero-social]",
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.2"
        )
        .to(
          visual,
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          "[data-hero-scroll]",
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );

      // Parallax on scroll
      gsap.to(content, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(visual, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark pt-16"
    >
      {/* Gradient mesh background */}
      <div ref={meshRef} className="absolute inset-0 overflow-hidden">
        <div className="mesh-blob absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/25 to-secondary/15 blur-3xl" />
        <div className="mesh-blob absolute top-1/3 -left-48 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/20 to-accent/15 blur-3xl" />
        <div className="mesh-blob absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-accent/20 to-primary/10 blur-3xl" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left column: Text & CTAs */}
          <div ref={contentRef} className="text-left">
            {/* "Available" badge */}
            <div
              data-hero-badge
              className="inline-flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              {t("available")}
            </div>

            {/* Name */}
            <h1 className="text-hero font-display font-bold mb-4 text-text-dark dark:text-text-light">
              <TextReveal delay={0.3} splitBy="chars" className="inline">
                Félix
              </TextReveal>{" "}
              <TextReveal
                delay={0.5}
                splitBy="chars"
                className="inline bg-gradient-full bg-clip-text text-transparent"
              >
                AUTANT
              </TextReveal>
            </h1>

            {/* Role subtitle */}
            <div
              data-hero-role
              className="text-heading-2 font-semibold mb-4 text-text-dark dark:text-text-light"
            >
              {t("role")}
            </div>

            {/* Typed technologies */}
            <div
              data-hero-typing
              className="text-xl mb-6 text-text-muted dark:text-text-muted-light"
            >
              <span className="text-secondary font-semibold">
                {t("specializedIn")}:{" "}
              </span>
              <TypedTechnologies />
            </div>

            {/* Tagline */}
            <p
              data-hero-tagline
              className="text-lg mb-8 text-text-muted dark:text-text-muted-light max-w-xl"
            >
              {t("tagline")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <MagneticButton>
                <Link
                  data-hero-cta
                  href="#projects"
                  className="group inline-flex items-center gap-2 bg-gradient-primary hover:shadow-glow-primary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  {t("viewProjects")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  data-hero-cta
                  href="#contact"
                  className="group inline-flex items-center gap-2 bg-secondary hover:shadow-glow-secondary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  {t("contact")}
                  <Mail className="w-5 h-5" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <a
                  data-hero-cta
                  href="/cv/CV_Felix_AUTANT_FR.pdf"
                  download
                  className="group inline-flex items-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  {t("downloadCV")}
                  <Download className="w-5 h-5" />
                </a>
              </MagneticButton>
            </div>

            {/* Social links */}
            <div
              data-hero-social
              className="flex items-center gap-4 flex-wrap"
            >
              <a
                href="mailto:autantfelix@gmail.com"
                className="group flex items-center gap-2 text-text-muted dark:text-text-muted-light hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">autantfelix@gmail.com</span>
              </a>

              <a
                href="tel:+33602279283"
                className="group flex items-center gap-2 text-text-muted dark:text-text-muted-light hover:text-secondary dark:hover:text-secondary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="hidden sm:inline">06 02 27 92 83</span>
              </a>

              <div className="flex gap-3 ml-4">
                <MagneticButton strength={0.4}>
                  <a
                    href="https://github.com/felixautant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-text-dark dark:bg-text-light text-white dark:text-text-dark hover:scale-110 transition-transform"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </MagneticButton>

                <MagneticButton strength={0.4}>
                  <a
                    href="https://linkedin.com/in/felixautant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#0A66C2] text-white hover:scale-110 transition-transform"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Right column: Three.js 3D orb */}
          <div ref={visualRef} className="relative hidden lg:block h-[500px]">
            <HeroOrb />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium text-text-muted dark:text-text-muted-light uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-6 h-10 border-2 border-text-muted/50 dark:border-text-muted-light/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function TypedTechnologies() {
  const technologies = [
    "Symfony",
    1500,
    "Laravel",
    1500,
    "Next.js",
    1500,
    "Android",
    1500,
    "Docker",
    1500,
    "React",
    1500,
  ];

  return (
    <span className="font-bold bg-gradient-full bg-clip-text text-transparent">
      <TypeAnimation
        sequence={technologies}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </span>
  );
}
