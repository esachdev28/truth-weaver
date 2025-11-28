import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Activity, AlertTriangle, ScanSearch, ArrowRight } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Credibility Scoring",
    description: "Assess credibility of any text, image, video, or link with multi-dimensional AI analysis.",
    link: "/credibility",
    gradient: "from-primary/10 to-primary/20"
  },
  {
    icon: Activity,
    title: "Agent Monitor",
    description: "Track real-time performance of the AI agent pipeline with live metrics and status updates.",
    link: "/agent-monitor",
    gradient: "from-success/10 to-success/20"
  },
  {
    icon: AlertTriangle,
    title: "Crisis Alerts",
    description: "Live verified crisis alerts with location filters, language translation, and emergency broadcasts.",
    link: "/crisis-alerts",
    gradient: "from-warning/10 to-warning/20"
  },
  {
    icon: ScanSearch,
    title: "Media Forensics",
    description: "Check deepfake images, AI-generated videos, and watermark detection with advanced forensics.",
    link: "/media-forensics",
    gradient: "from-secondary/10 to-secondary/20"
  }
];

export const PreviewSections = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Truth Detection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to combat misinformation at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 group"
                onClick={() => navigate(section.link)}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${section.gradient} mb-4`}>
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {section.description}
                </p>
                
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-semibold text-primary hover:bg-transparent group-hover:gap-3 transition-all flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(section.link);
                  }}
                >
                  Explore Feature
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};