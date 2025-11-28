import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatusCards } from "@/components/StatusCards";
import { CategoryGrid } from "@/components/CategoryGrid";
import { PreviewSections } from "@/components/PreviewSections";
import { MissionSection } from "@/components/MissionSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatusCards />
        <CategoryGrid />
        <PreviewSections />
        <MissionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
