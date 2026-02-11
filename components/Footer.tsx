"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail, Heart, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const cols = footerRef.current!.querySelectorAll("[data-footer-col]");
      gsap.set(cols, { y: 30, opacity: 0 });

      ScrollTrigger.batch(cols, {
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          }),
        start: "top 90%",
        once: true,
      });
    }, footerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-white dark:bg-background-dark-alt border-t border-border">
      {/* CTA banner */}
      <div className="bg-gradient-full py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-heading-2 font-display font-bold text-white mb-2">
            {t("collaborate")}
          </h3>
          <p className="text-white/80 mb-6">{t("collaborateDesc")}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all hover:scale-105"
          >
            {tNav("contact")}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & description */}
          <div data-footer-col>
            <Link
              href="/"
              className="font-display font-bold text-xl text-text-dark dark:text-text-light"
            >
              <span className="gradient-text">F</span>élix{" "}
              <span className="gradient-text">A</span>UTANT
            </Link>
            <p className="text-sm text-text-muted dark:text-text-muted-light mt-2 max-w-xs">
              Développeur Web Fullstack — Symfony, Laravel, Next.js
            </p>
          </div>

          {/* Quick Links */}
          <div data-footer-col>
            <h4 className="font-semibold text-text-dark dark:text-text-light mb-3">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2">
              {["about", "skills", "projects", "contact"].map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="text-sm text-text-muted dark:text-text-muted-light hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {tNav(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div data-footer-col>
            <h4 className="font-semibold text-text-dark dark:text-text-light mb-3">
              Contact
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <a
                href="mailto:autantfelix@gmail.com"
                className="p-2 rounded-full text-text-muted dark:text-text-muted-light hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/felixautant"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-text-muted dark:text-text-muted-light hover:text-text-dark dark:hover:text-text-light hover:bg-text-dark/10 dark:hover:bg-text-light/10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/felixautant"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-text-muted dark:text-text-muted-light hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-text-muted dark:text-text-muted-light">
              autantfelix@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted dark:text-text-muted-light">
            &copy; {currentYear} Félix AUTANT. {t("rights")}
          </p>
          <p className="text-sm text-text-muted dark:text-text-muted-light flex items-center gap-1">
            {t("madeWith")}{" "}
            <Heart className="w-4 h-4 text-primary fill-primary" /> {t("by")}{" "}
            <span className="font-semibold text-text-dark dark:text-text-light">
              Félix AUTANT
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
