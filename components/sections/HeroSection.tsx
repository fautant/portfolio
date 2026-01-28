"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download, Github, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark pt-16"
    >
      {/* Formes organiques en arriere-plan (inspirees du CV) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-accent to-secondary rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche : Texte et CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge "Disponible pour freelance" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {t("available")}
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-hero font-display font-bold mb-4 text-text-dark dark:text-text-light"
            >
              Felix{" "}
              <span className="bg-gradient-full bg-clip-text text-transparent">
                AUTANT
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-heading-2 font-semibold mb-4 text-text-dark dark:text-text-light"
            >
              <span>{t("role")}</span>
            </motion.div>

            {/* Technologies avec effet typing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl mb-6 text-text-muted dark:text-text-muted-light"
            >
              <span className="text-secondary font-semibold">
                {t("specializedIn")}:{" "}
              </span>
              <TypedTechnologies />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg mb-8 text-text-muted dark:text-text-muted-light max-w-xl"
            >
              {t("tagline")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 bg-gradient-primary hover:shadow-glow-primary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("viewProjects")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 bg-secondary hover:shadow-glow-secondary text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("contact")}
                <Mail className="w-5 h-5" />
              </Link>

              <a
                href="/cv/CV_Felix_AUTANT_FR.pdf"
                download
                className="group inline-flex items-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("downloadCV")}
                <Download className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Liens sociaux */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
                <a
                  href="https://github.com/felixautant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-text-dark dark:bg-text-light text-white dark:text-text-dark hover:scale-110 transition-transform"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href="https://linkedin.com/in/felixautant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[#0A66C2] text-white hover:scale-110 transition-transform"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Colonne droite : Photo professionnelle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Cercle decoratif rose (arriere) */}
              <motion.div
                className="absolute -top-8 -left-8 w-64 h-64 bg-primary rounded-full opacity-30 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Cercle decoratif jaune (arriere) */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent rounded-full opacity-30 blur-2xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Photo avec bordure degradee */}
              <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-transparent bg-gradient-full p-1 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="bg-white dark:bg-background-dark rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl font-display font-bold gradient-text">
                      FA
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge flottant "3eme annee IUT" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -right-4 bg-white dark:bg-background-dark-alt shadow-card rounded-2xl px-6 py-4 border border-accent/20"
              >
                <div className="text-sm text-text-muted dark:text-text-muted-light">
                  {t("studying")}
                </div>
                <div className="text-lg font-bold text-text-dark dark:text-text-light">
                  3eme annee BUT Info
                </div>
                <div className="text-xs text-accent font-semibold">
                  IUT Anglet
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted dark:border-text-muted-light rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Composant pour l'effet typing des technologies
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
