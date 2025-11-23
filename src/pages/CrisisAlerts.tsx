import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, MapPin, Send, Globe, Filter } from "lucide-react";
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

const mockAlerts = [
  {
    id: 1,
    title: "Severe Weather Warning - Cyclone Approaching Mumbai",
    category: "Disasters & Crisis Alerts",
    location: "Mumbai, Maharashtra",
    coordinates: [19.0760, 72.8777] as [number, number],
    severity: "critical",
    time: "5 minutes ago",
    description: "Cyclone expected to make landfall in 6 hours. Residents advised to evacuate coastal areas.",
  },
  {
    id: 2,
    title: "Flash Flood Alert in Uttarakhand",
    category: "Disasters & Crisis Alerts",
    location: "Uttarakhand",
    coordinates: [30.0668, 79.0193] as [number, number],
    severity: "high",
    time: "15 minutes ago",
    description: "Heavy rainfall causing flash floods in mountainous regions. Stay indoors and avoid travel.",
  },
  {
    id: 3,
    title: "Election Misinformation Campaign Detected",
    category: "Politics & Elections",
    location: "Delhi",
    coordinates: [28.6139, 77.2090] as [number, number],
    severity: "medium",
    time: "1 hour ago",
    description: "Coordinated spread of false information about polling locations detected on social media.",
  },
  {
    id: 4,
    title: "Health Advisory: Dengue Outbreak",
    category: "Health & Medicine",
    location: "Bangalore",
    coordinates: [12.9716, 77.5946] as [number, number],
    severity: "high",
    time: "2 hours ago",
    description: "Significant increase in dengue cases reported. Take preventive measures against mosquitoes.",
  },
];

export default function CrisisAlerts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");

  const filteredAlerts = mockAlerts.filter((alert) => {
    const categoryMatch = selectedCategory === "all" || alert.category === selectedCategory;
    const severityMatch = selectedSeverity === "all" || alert.severity === selectedSeverity;
    const locationMatch = searchLocation === "" || alert.location.toLowerCase().includes(searchLocation.toLowerCase());
    return categoryMatch && severityMatch && locationMatch;
  });

  const handleBroadcast = (alert: typeof mockAlerts[0]) => {
    toast.success(`Broadcasting alert: "${alert.title}" via WhatsApp, Telegram, and Email`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Crisis Alerts</h1>
          <p className="text-muted-foreground">Real-time monitoring and broadcasting of critical alerts</p>
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
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
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
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>

                    <h3 className="font-semibold mb-2">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>

                    <Badge variant="outline" className="mb-3 text-xs">{alert.category}</Badge>

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
                ))}
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
                  <Marker key={alert.id} position={alert.coordinates}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold mb-1">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{alert.location}</p>
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
