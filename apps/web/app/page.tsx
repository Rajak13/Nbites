import { HeroSection } from '@/components/hero/HeroSection';
import { ChefTurntableSection } from '@/components/menu/ChefTurntableSection';

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#f5e3cd]">
      <HeroSection />
      <ChefTurntableSection />
    </main>
  );
}
