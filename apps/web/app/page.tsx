import { HeroSection } from '@/components/hero/HeroSection';
import { ChefTurntableSection } from '@/components/menu/ChefTurntableSection';
import { KitchenJourneySection } from '@/components/landing/KitchenJourneySection';
import { ManifestoSection } from '@/components/landing/ManifestoSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTABandSection } from '@/components/landing/CTABandSection';
import { Footer } from '@/components/landing/Footer';

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#f5e3cd]">
      <HeroSection />
      <ChefTurntableSection />
      <KitchenJourneySection />
      <ManifestoSection />
      <TestimonialsSection />
      <CTABandSection />
      <Footer />
    </main>
  );
}
