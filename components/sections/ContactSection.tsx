"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <SectionWrapper id="contact" background="alt">
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

      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <ScrollReveal direction="left">
          <div className="space-y-6">
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
        </ScrollReveal>

        {/* Contact Form */}
        <ScrollReveal direction="right">
          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}

interface ContactInfoCardProps {
  icon: React.ElementType;
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
      whileHover={{ x: 5 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-background-dark shadow-card hover:shadow-card-hover transition-all"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, just show success - implement actual form submission later
    setStatus("success");
    setIsSubmitting(false);

    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("namePlaceholder")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t("subject")}</Label>
        <Input
          id="subject"
          name="subject"
          placeholder={t("subjectPlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">{t("type")}</Label>
        <select
          id="type"
          name="type"
          className="flex h-11 w-full rounded-xl border border-border bg-white dark:bg-background-dark-alt px-4 py-2 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        >
          <option value="job">{t("typeJob")}</option>
          <option value="freelance">{t("typeFreelance")}</option>
          <option value="question">{t("typeQuestion")}</option>
          <option value="other">{t("typeOther")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("messagePlaceholder")}
          rows={5}
          required
        />
      </div>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm"
        >
          {tContact("success")}
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm"
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
