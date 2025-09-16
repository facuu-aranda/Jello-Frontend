import { PublicLayout } from "@/components/layout/public-layout"
import { HeroSectionV2 } from "@/components/landing/hero-section-v2"
import { FeaturesSectionV2 } from "@/components/landing/features-section-v2"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CtaSection } from "@/components/landing/cta-section"

export default function LandingV2Page() {
  return (
    <PublicLayout>
      <HeroSectionV2 />
      <FeaturesSectionV2 />
      <TestimonialsSection />
      <CtaSection />
    </PublicLayout>
  )
}