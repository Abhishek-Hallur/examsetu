import { Hero } from "@/components/home/hero";
import {
  ExamsSection,
  SubjectsSection,
  ResourceTypesSection,
  FeaturesSection,
  PremiumBanner,
} from "@/components/home/sections";
import { FaqSection } from "@/components/home/faq";
import { NewsletterSection } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExamsSection />
      <SubjectsSection />
      <ResourceTypesSection />
      <FeaturesSection />
      <PremiumBanner />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
