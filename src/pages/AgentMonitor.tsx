import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const agents = [
  {
    name: "ScanAgent",
    status: "active",
    processed: 1247,
    active: 3,
    description: "Monitors social media and news sources for emerging claims",
    progress: 78,
  },
  {
    name: "VerifyAgent",
    status: "active",
    processed: 892,
    active: 5,
    description: "Cross-references claims with trusted fact-checking sources",
    progress: 65,
  },
  {
    name: "ScoreAgent",
    status: "active",
    processed: 756,
    active: 2,
    description: "Calculates credibility scores based on evidence strength",
    progress: 82,
  },
  {
    name: "ExplainAgent",
    status: "idle",
    processed: 634,
    active: 0,
    description: "Generates human-readable explanations and translations",
    progress: 45,
  },
];

const activityLogs = [
  { time: "2 min ago", agent: "VerifyAgent", action: "Verified claim about climate data", status: "success" },
  { time: "5 min ago", agent: "ScanAgent", action: "Detected emerging claim on Twitter", status: "success" },
  { time: "8 min ago", agent: "ScoreAgent", action: "Scored health misinformation claim", status: "success" },
  { time: "12 min ago", agent: "VerifyAgent", action: "Failed to verify claim - insufficient sources", status: "warning" },
  { time: "15 min ago", agent: "ExplainAgent", action: "Generated Hindi translation for alert", status: "success" },
  { time: "18 min ago", agent: "ScanAgent", action: "Processed 47 new social media posts", status: "success" },
  { time: "22 min ago", agent: "ScoreAgent", action: "Updated credibility database", status: "success" },
  { time: "25 min ago", agent: "VerifyAgent", action: "Cross-referenced with PolitiFact", status: "success" },
];

export default function AgentMonitor() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Agent Monitor</h1>
          <p className="text-muted-foreground">Real-time activity feed and status of all verification agents</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {agents.map((agent) => (
            <Card key={agent.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                    {agent.status}
                  </Badge>
                </div>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processed</span>
                  <span className="font-semibold">{agent.processed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Tasks</span>
                  <span className="font-semibold">{agent.active}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{agent.progress}%</span>
                  </div>
                  <Progress value={agent.progress} className="h-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Activity Feed</h2>
          </div>
          
          <div className="space-y-4">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="mt-1">
                  {log.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{log.agent}</Badge>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
