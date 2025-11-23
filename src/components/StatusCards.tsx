import { CheckCircle, XCircle, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const statusData = [
  {
    title: "Verified True",
    count: "12,847",
    percentage: "68%",
    trend: "+12%",
    isPositive: true,
    icon: CheckCircle,
    color: "success",
    link: "/claims?status=verified-true"
  },
  {
    title: "False Claims",
    count: "4,293",
    percentage: "23%",
    trend: "-5%",
    isPositive: false,
    icon: XCircle,
    color: "danger",
    link: "/claims?status=false"
  },
  {
    title: "Needs Review",
    count: "1,156",
    percentage: "6%",
    trend: "+3%",
    isPositive: true,
    icon: AlertCircle,
    color: "warning",
    link: "/claims?status=needs-review"
  },
  {
    title: "Emerging",
    count: "584",
    percentage: "3%",
    trend: "+18%",
    isPositive: true,
    icon: TrendingUp,
    color: "secondary",
    link: "/claims?status=emerging"
  }
];

const getColorClasses = (color: string) => {
  const colorMap = {
    success: { bg: "bg-success/10", text: "text-success" },
    danger: { bg: "bg-danger/10", text: "text-danger" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
    secondary: { bg: "bg-secondary/10", text: "text-secondary" }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.success;
};

export const StatusCards = () => {
  return (
    <section className="w-full py-12 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusData.map((status) => {
            const Icon = status.icon;
            const TrendIcon = status.isPositive ? ArrowUpRight : ArrowDownRight;
            const colors = getColorClasses(status.color);
            
            return (
              <Card 
                key={status.title}
                className="p-6 rounded-2xl border-2 hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    <TrendIcon className="w-3 h-3" />
                    {status.trend}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{status.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-display font-bold">{status.count}</h3>
                    <span className="text-sm text-muted-foreground">{status.percentage}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
