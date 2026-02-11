import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionDivider } from "@/components/animations/SectionDivider";
import { TechMarquee } from "@/components/animations/TechMarquee";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SectionDivider variant="wave" />
      <AboutSection />
      <SectionDivider variant="curve" flip />
      <StatsSection />
      <TechMarquee />
      <SectionDivider variant="wave" />
      <SkillsSection />
      <SectionDivider variant="curve" flip />
      <ProjectsSection />
      <SectionDivider variant="wave" />
      <ContactSection />
    </>
  );
}
