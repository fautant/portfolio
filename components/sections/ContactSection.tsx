"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionWrapper } from "./SectionWrapper";
import { TextReveal } from "@/components/animations/TextReveal";
import { SpotlightCard } from "@/components/animations/SpotlightCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParticleCanvas } from "@/components/animations/ParticleCanvas";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/lib/validations/contact";

export function ContactSection() {
  const t = useTranslations("contact");
  const contactCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactCardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = contactCardsRef.current!.querySelectorAll("[data-contact-card]");
      gsap.set(cards, { y: 30, opacity: 0 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: "power3.out",
          }),
        start: "top 85%",
        once: true,
      });
    }, contactCardsRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="contact" background="alt" className="relative overflow-hidden">
      <ParticleCanvas className="opacity-40 dark:opacity-60" />
      {/* Background decorative blobs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10">
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

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div ref={contactCardsRef} className="space-y-6">
            <h3 className="text-heading-3 font-semibold text-text-dark dark:text-text-light mb-6">
              {t("info.title")}
            </h3>

            <ContactInfoCard
              icon={Mail}
              label={t("info.email")}
              value="autantfelix@gmail.com"
              href="mailto:autantfelix@gmail.com"
              color="primary"
            />
            <ContactInfoCard
              icon={Phone}
              label={t("info.phone")}
              value="06 02 27 92 83"
              href="tel:+33602279283"
              color="secondary"
            />
            <ContactInfoCard
              icon={MapPin}
              label={t("info.location")}
              value={t("info.locationValue")}
              color="accent"
            />
          </div>

          {/* Contact Form - Glassmorphism card with spotlight */}
          <SpotlightCard className="rounded-2xl">
            <div className="rounded-2xl p-6 md:p-8 backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-card">
              <ContactForm />
            </div>
          </SpotlightCard>
        </div>
      </div>
    </SectionWrapper>
  );
}

interface ContactInfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  color: "primary" | "secondary" | "accent";
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: ContactInfoCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent-dark",
  };

  const content = (
    <motion.div
      data-contact-card
      whileHover={{ x: 5 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className={cn("p-3 rounded-xl", colorClasses[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-text-muted dark:text-text-muted-light">
          {label}
        </p>
        <p className="font-semibold text-text-dark dark:text-text-light">
          {value}
        </p>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

function ContactForm() {
  const t = useTranslations("contact.form");
  const tContact = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const checkRef = useRef<SVGSVGElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      type: "job",
    },
  });

  useEffect(() => {
    if (status === "success" && checkRef.current) {
      const path = checkRef.current.querySelector("path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }
  }, [status]);

  const onSubmit = async (data: ContactFormData) => {
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingField
          id="name"
          label={t("name")}
          error={errors.name?.message}
          {...register("name")}
        />
        <FloatingField
          id="email"
          label={t("email")}
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <FloatingField
        id="subject"
        label={t("subject")}
        error={errors.subject?.message}
        {...register("subject")}
      />

      <div className="relative">
        <select
          id="type"
          className="peer w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
          {...register("type")}
        >
          <option value="job">{t("typeJob")}</option>
          <option value="freelance">{t("typeFreelance")}</option>
          <option value="question">{t("typeQuestion")}</option>
          <option value="other">{t("typeOther")}</option>
        </select>
        <label
          htmlFor="type"
          className="absolute -top-2.5 left-3 text-xs font-medium text-text-muted dark:text-text-muted-light bg-white dark:bg-background-dark-alt/80 px-1 rounded"
        >
          {t("type")}
        </label>
      </div>

      <FloatingTextarea
        id="message"
        label={t("message")}
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-green-100/80 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm backdrop-blur-sm"
        >
          <CheckCircle2 ref={checkRef} className="w-5 h-5 shrink-0" />
          {tContact("success")}
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm backdrop-blur-sm"
        >
          {tContact("error")}
        </motion.div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("sending")}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t("send")}
          </>
        )}
      </Button>
    </form>
  );
}

interface FloatingFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const FloatingField = React.forwardRef<HTMLInputElement, FloatingFieldProps>(
  ({ id, label, type = "text", error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder=" "
          className={cn(
            "peer w-full h-12 rounded-xl border bg-gray-50 dark:bg-white/5 px-4 pt-4 pb-1 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm placeholder-transparent",
            error
              ? "border-red-400 dark:border-red-500"
              : "border-gray-200 dark:border-white/10"
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-light text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
FloatingField.displayName = "FloatingField";

interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

const FloatingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingTextareaProps
>(({ id, label, rows = 4, error, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        placeholder=" "
        className={cn(
          "peer w-full rounded-xl border bg-gray-50 dark:bg-white/5 px-4 pt-6 pb-2 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm placeholder-transparent resize-none",
          error
            ? "border-red-400 dark:border-red-500"
            : "border-gray-200 dark:border-white/10"
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-4 text-text-muted dark:text-text-muted-light text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});
FloatingTextarea.displayName = "FloatingTextarea";
