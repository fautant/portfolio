"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-background-dark-alt border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-display font-bold text-lg text-text-dark dark:text-text-light"
            >
              <span className="gradient-text">F</span>élix{" "}
              <span className="gradient-text">A</span>UTANT
            </Link>
            <p className="text-sm text-text-muted dark:text-text-muted-light mt-1">
              &copy; {currentYear} {t("rights")}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
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

          {/* Made with */}
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
