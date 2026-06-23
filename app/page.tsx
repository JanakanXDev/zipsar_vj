import { ExperienceShell } from "@/components/experience/ExperienceShell";
import { SparkSection } from "@/components/experience/narrative/SparkSection";
import { WhySection } from "@/components/experience/narrative/WhySection";
import { EncounterSection } from "@/components/experience/narrative/EncounterSection";
import { BuildSection } from "@/components/experience/narrative/BuildSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { EvolutionSection } from "@/components/experience/narrative/EvolutionSection";
import { FutureSection } from "@/components/experience/narrative/FutureSection";
import { FinaleSection } from "@/components/experience/narrative/FinaleSection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StructuredData } from "@/components/seo/StructuredData";

/**
 * The cinematic experience. The persistent WebGL film layer sits behind
 * the semantic narrative (Blueprint §0.2). Sections are added one act at
 * a time (Step 7+) — all copy verbatim from content/contentBible.ts.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <ExperienceShell />
      <main id="content" className="relative z-(--z-narrative)">
        <SparkSection />
        <WhySection />
        <EncounterSection />
        <BuildSection />
        <ServicesSection />
        <EvolutionSection />
        <FutureSection />
        <FinaleSection />
      </main>
      <SiteFooter />
    </>
  );
}
