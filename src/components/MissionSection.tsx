import { Shield, Users, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Sources",
    description: "Every claim is cross-referenced with trusted fact-checking organizations and primary sources."
  },
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "AI-powered agents scan and verify claims as they emerge, stopping misinformation in its tracks."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of truth-seekers contributing to a more informed and transparent world."
  },
  {
    icon: Target,
    title: "Precision Scoring",
    description: "Multi-dimensional credibility scoring gives you confidence in what you read and share."
  }
];

export const MissionSection = () => {
  return (
    <section className="w-full py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Our Mission: Truth in a Noisy World
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CruxAI was built on the belief that everyone deserves access to verified, accurate information. 
            In an age where misinformation spreads faster than facts, we're using AI and human expertise 
            to restore trust and clarity. Our platform connects facts with people who need them most, 
            especially during crises when truth matters most.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
