"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  proposalFormSchema,
  type ProposalFormData,
} from "@/lib/validations/proposal";

export function ProposalForm() {
  const t = useTranslations("proposal");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const checkRef = useRef<SVGSVGElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      budget: "<1000",
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

  const onSubmit = async (data: ProposalFormData) => {
    setStatus("idle");

    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send proposal");
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
          label={t("form.name")}
          error={errors.name?.message}
          {...register("name")}
        />
        <FloatingField
          id="email"
          label={t("form.email")}
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <FloatingField
        id="company"
        label={t("form.company")}
        error={errors.company?.message}
        {...register("company")}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <select
            id="budget"
            className={cn(
              "peer w-full h-12 rounded-xl border bg-gray-50 dark:bg-white/5 px-4 py-2 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm",
              errors.budget
                ? "border-red-400 dark:border-red-500"
                : "border-gray-200 dark:border-white/10"
            )}
            {...register("budget")}
          >
            <option value="<1000">{t("form.budgetOptions.lt1000")}</option>
            <option value="1000-5000">{t("form.budgetOptions.1000_5000")}</option>
            <option value="5000-10000">{t("form.budgetOptions.5000_10000")}</option>
            <option value=">10000">{t("form.budgetOptions.gt10000")}</option>
          </select>
          <label
            htmlFor="budget"
            className="absolute -top-2.5 left-3 text-xs font-medium text-text-muted dark:text-text-muted-light bg-white dark:bg-background-dark-alt/80 px-1 rounded"
          >
            {t("form.budget")}
          </label>
        </div>

        <div className="relative">
          <input
            id="deadline"
            type="date"
            className={cn(
              "peer w-full h-12 rounded-xl border bg-gray-50 dark:bg-white/5 px-4 py-2 text-base text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm",
              errors.deadline
                ? "border-red-400 dark:border-red-500"
                : "border-gray-200 dark:border-white/10"
            )}
            {...register("deadline")}
          />
          <label
            htmlFor="deadline"
            className="absolute -top-2.5 left-3 text-xs font-medium text-text-muted dark:text-text-muted-light bg-white dark:bg-background-dark-alt/80 px-1 rounded"
          >
            {t("form.deadline")}
          </label>
          {errors.deadline && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              {errors.deadline.message}
            </p>
          )}
        </div>
      </div>

      <FloatingTextarea
        id="description"
        label={t("form.description")}
        rows={6}
        error={errors.description?.message}
        {...register("description")}
      />

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-green-100/80 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm backdrop-blur-sm"
        >
          <CheckCircle2 ref={checkRef} className="w-5 h-5 shrink-0" />
          {t("success")}
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm backdrop-blur-sm"
        >
          {t("error")}
        </motion.div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("form.sending")}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t("form.send")}
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
