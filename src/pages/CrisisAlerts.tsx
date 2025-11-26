import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MapPin, Send, Globe, Filter, RefreshCw, Bell, Users, Share2, Clock, TrendingUp } from "lucide-react";
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
      const response = await fetch("https://fast-backend-n6qp.onrender.com/api/crisis");
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
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                Crisis Alerts
              </h1>
              <p className="text-muted-foreground text-lg">
                Real-time monitoring and emergency broadcasting system
              </p>
            </div>
            <Button onClick={fetchAlerts} disabled={loading} variant="outline" size="lg">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Critical Alerts</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {alerts.filter(a => a.severity === "CRITICAL").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </Card>
            <Card className="p-4 border-orange-500/20 bg-orange-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.severity === "HIGH").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
            <Card className="p-4 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Active Regions</p>
                  <p className="text-2xl font-bold text-primary">
                    {new Set(alerts.map(a => a.region).filter(Boolean)).size}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Broadcasts Sent</p>
                  <p className="text-2xl font-bold text-emerald-500">147</p>
                </div>
                <Send className="h-8 w-8 text-emerald-500" />
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Bar */}
        <Card className="p-6 mb-6 bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filter Alerts</h3>
          </div>
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity Level</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="CRITICAL">🔴 Critical</SelectItem>
                  <SelectItem value="HIGH">🟠 High</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location Search</label>
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Bell className="h-3 w-3 mr-1" />
                  Subscribe
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="feed">Alert Feed</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Active Alerts</h2>
                  <Badge variant="secondary">{filteredAlerts.length}</Badge>
                </div>
                <Button variant="destructive" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Broadcast All
                </Button>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading crisis alerts...</p>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-lg">No active alerts found</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <Card
                      key={alert.id}
                      className={`p-5 hover:shadow-lg transition-all border-l-4 ${alert.severity === "CRITICAL" ? "border-l-amber-600 bg-amber-50 dark:bg-amber-950/20" :
                          alert.severity === "HIGH" ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20" :
                            "border-l-primary bg-primary/5"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${alert.severity === "CRITICAL" ? "bg-amber-500/20" :
                              alert.severity === "HIGH" ? "bg-orange-500/20" :
                                "bg-primary/20"
                            }`}>
                            <AlertTriangle className={`h-5 w-5 ${alert.severity === "CRITICAL" ? "text-amber-600" :
                                alert.severity === "HIGH" ? "text-orange-600" :
                                  "text-primary"
                              }`} />
                          </div>
                          <div>
                            <Badge variant={getSeverityColor(alert.severity)} className="mb-1">
                              {alert.severity}
                            </Badge>
                            {alert.verified && (
                              <Badge variant="outline" className="ml-2 text-emerald-500 border-emerald-500">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Just now</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {alert.description || "No additional details available"}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">{alert.region || "Location Unknown"}</span>
                        </div>
                        {alert.keywords && alert.keywords.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {alert.keywords.slice(0, 3).map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleBroadcast(alert)}
                        >
                          <Send className="h-3 w-3 mr-2" />
                          Broadcast Alert
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Globe className="h-3 w-3 mr-2" />
                          Translate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-6 h-[800px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Geographic Distribution</h2>
                </div>
                <Badge variant="secondary">
                  {filteredAlerts.length} alerts on map
                </Badge>
              </div>

              <div className="h-[calc(100%-4rem)] rounded-lg overflow-hidden border-2 border-border">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredAlerts.map((alert) => (
                    <Marker key={alert.id} position={getCoordinates(alert)}>
                      <Popup>
                        <div className="p-3 min-w-[200px]">
                          <Badge variant={getSeverityColor(alert.severity)} className="mb-2">
                            {alert.severity}
                          </Badge>
                          <h3 className="font-bold mb-2">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{alert.region || "Unknown"}</p>
                          <Button size="sm" className="w-full" onClick={() => handleBroadcast(alert)}>
                            <Send className="h-3 w-3 mr-1" />
                            Broadcast
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

