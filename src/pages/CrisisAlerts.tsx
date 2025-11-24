import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, MapPin, Send, Globe, Filter, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface CrisisAlert {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  region: string | null;
  verified: boolean;
  keywords: string[];
  description: string | null;
}

interface CrisisResponse {
  crisis_detected: boolean;
  alerts: CrisisAlert[];
  recommended_actions: string[];
}

export default function CrisisAlerts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crisis");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const data: CrisisResponse = await response.json();
      console.log("Fetched Crisis Data:", data);
      setAlerts(data.alerts);
      if (data.crisis_detected) {
        toast.warning(`${data.alerts.length} Crisis Alerts Detected!`);
      } else {
        toast.info("No active crisis alerts detected.");
      }
    } catch (error) {
      console.error("Error fetching crisis alerts:", error);
      toast.error("Failed to load crisis alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    // Note: Category filtering is limited as backend doesn't return category yet
    // We can infer or just show all for now if category is 'all'
    const severityMatch = selectedSeverity === "all" || alert.severity === selectedSeverity;
    const locationMatch = searchLocation === "" || (alert.region && alert.region.toLowerCase().includes(searchLocation.toLowerCase())) || (alert.description && alert.description.toLowerCase().includes(searchLocation.toLowerCase()));
    return severityMatch && locationMatch;
  });

  const handleBroadcast = (alert: CrisisAlert) => {
    toast.success(`Broadcasting alert: "${alert.title}" via WhatsApp, Telegram, and Email`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "default"; // default is usually primary/black
      case "MEDIUM": return "secondary";
      default: return "outline";
    }
  };

  // Helper to get coordinates (mocked for now as backend doesn't provide lat/long yet)
  const getCoordinates = (alert: CrisisAlert): [number, number] => {
    // Randomize slightly around India for demo if no region
    return [20 + Math.random() * 10, 78 + Math.random() * 10];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Crisis Alerts</h1>
            <p className="text-muted-foreground">Real-time monitoring and broadcasting of critical alerts</p>
          </div>
          <Button onClick={fetchAlerts} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <Label className="text-sm font-medium mb-2 block">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Disasters & Crisis Alerts">Disasters & Crisis</SelectItem>
                <SelectItem value="Health & Medicine">Health & Medicine</SelectItem>
                <SelectItem value="Politics & Elections">Politics & Elections</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-2 block">Severity</Label>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-2 block">Location</Label>
            <Input
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Active Alerts ({filteredAlerts.length})</h2>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active alerts found matching your criteria.</div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <Card key={alert.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        {/* Time is not in backend response yet, omitting or mocking */}
                        <span className="text-xs text-muted-foreground">Just now</span>
                      </div>

                      <h3 className="font-semibold mb-2">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.region || "Unknown Location"}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleBroadcast(alert)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Broadcast
                        </Button>
                        <Button size="sm" variant="outline">
                          <Globe className="h-3 w-3 mr-1" />
                          Translate
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6 h-[700px]">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Alert Map</h2>
            </div>

            <div className="h-[calc(100%-3rem)] rounded-lg overflow-hidden">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredAlerts.map((alert) => (
                  <Marker key={alert.id} position={getCoordinates(alert)}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold mb-1">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{alert.region || "Unknown"}</p>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Label({ children, className = "", ...props }: any) {
  return <label className={`text-sm font-medium ${className}`} {...props}>{children}</label>;
}
