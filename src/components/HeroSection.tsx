import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-hero-bg py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-hero-bg p-8 md:p-12 lg:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-balance leading-tight">
                Helping people find the truth in a noisy world
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                CruxAI verifies facts, detects misinformation, and gives you clarity when it matters the most.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => navigate('/login')}
                >
                  Login or Sign Up
                </Button>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="hidden md:flex gap-4 items-center justify-end">
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=700&fit=crop"
                  alt="Fact checking illustration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=700&fit=crop"
                  alt="News verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=700&fit=crop"
                  alt="Trust and transparency"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

