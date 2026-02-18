import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface ProposalPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProposalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "proposal" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "proposal" });

  return (
    <section className="min-h-screen py-32 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-light hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backHome")}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-light mb-3">
          {t("title")}
        </h1>
        <p className="text-text-muted dark:text-text-muted-light mb-10">
          {t("subtitle")}
        </p>

        <ProposalForm />
      </div>
    </section>
  );
}
