import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Newspaper,
  Vote,
  HeartPulse,
  AlertTriangle,
  LineChart,
  Cpu,
  FlaskConical,
  Shield,
  Globe,
  Hash,
  ArrowRight
} from "lucide-react";

const categories = [
  { name: "General News", icon: Newspaper, slug: "general-news", count: "3.2k claims" },
  { name: "Politics & Elections", icon: Vote, slug: "politics", count: "5.8k claims" },
  { name: "Health & Medicine", icon: HeartPulse, slug: "health", count: "2.1k claims" },
  { name: "Disasters & Crisis Alerts", icon: AlertTriangle, slug: "crisis", count: "892 claims" },
  { name: "Stock Market & Finance", icon: LineChart, slug: "finance", count: "1.4k claims" },
  { name: "Tech & AI Claims", icon: Cpu, slug: "tech-ai", count: "1.9k claims" },
  { name: "Science & Research", icon: FlaskConical, slug: "science", count: "1.2k claims" },
  { name: "Crime & Law Enforcement", icon: Shield, slug: "crime", count: "967 claims" },
  { name: "International Affairs", icon: Globe, slug: "international", count: "2.3k claims" },
  { name: "Social Media Trends", icon: Hash, slug: "social", count: "4.1k claims" },
];

export const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className="w-full py-16 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse verified claims and fact-checks across different topics. Click any category to dive deeper.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className="p-6 rounded-2xl border-2 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm leading-tight">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
