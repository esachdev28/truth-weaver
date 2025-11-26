import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

interface Agent {
  name: string;
  status: string;
  processed: number;
  active: number;
  description: string;
  progress: number;
}

interface ActivityLog {
  time: string;
  agent: string;
  action: string;
  status: string;
}

export default function AgentMonitor() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fast-backend-n6qp.onrender.com/api/agents");
        if (!response.ok) throw new Error("Failed to fetch agent status");
        const data = await response.json();
        setAgents(data.agents);
        setActivityLogs(data.activity_logs);
      } catch (error) {
        console.error("Error fetching agent status:", error);
        toast.error(`Failed to load agent status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Agent Monitor</h1>
          <p className="text-muted-foreground">Real-time activity feed and status of all verification agents</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <div className="col-span-4 text-center py-8">Loading agent status...</div>
          ) : agents.map((agent) => (
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
