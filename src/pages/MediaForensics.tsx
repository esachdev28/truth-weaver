import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Link2, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const mockAnalysis = {
  defakeScore: 23,
  manipulations: [
    "Face swap detected in frames 45-120",
    "Inconsistent lighting on subject vs background",
    "Re-encoding artifacts suggest multiple edits",
    "Audio-visual synchronization mismatch",
  ],
  provenance: "Original source: Unknown. First appeared on Twitter 3 days ago.",
  recommendation: "HIGH RISK - Multiple manipulation indicators detected",
};

export default function MediaForensics() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Please provide a URL or upload a file");
      return;
    }

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsAnalyzing(false);
    setShowResults(true);
    toast.success("Forensic analysis complete!");
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-emerald-500";
    if (score <= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 30) return "Likely Authentic";
    if (score <= 60) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Media Forensics</h1>
          <p className="text-muted-foreground">
            Detect deepfakes, manipulated images, and AI-generated content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Submit Media</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="media-url">Media URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="media-url"
                    type="url"
                    placeholder="https://example.com/image.jpg or video URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Media File</Label>
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images: JPG, PNG, WebP (max 10MB)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Videos: MP4, MOV, AVI (max 50MB)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Paste Social Media Post</Label>
                <Input placeholder="Paste link to Twitter, Instagram, or Facebook post" />
              </div>

              <Button 
                onClick={handleAnalyze} 
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Media"}
              </Button>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Detection Methods:</strong> AI watermark detection, face manipulation analysis, 
                  re-encoding artifact detection, lighting consistency checks, audio-visual sync analysis
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Forensic Report</h2>
            </div>

            {!showResults ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Shield className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  Upload or provide a URL to begin analysis
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Our AI will detect deepfakes, manipulations, and synthetic content
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-5xl font-bold mb-2">
                    <span className={getScoreColor(mockAnalysis.defakeScore)}>
                      {mockAnalysis.defakeScore}
                    </span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <Badge 
                    variant={mockAnalysis.defakeScore <= 30 ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {getScoreLabel(mockAnalysis.defakeScore)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">Manipulation Risk Score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Detected Manipulations
                    </h3>
                    <div className="space-y-2">
                      {mockAnalysis.manipulations.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Provenance Analysis</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {mockAnalysis.provenance}
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-destructive bg-destructive/10 rounded">
                    <h3 className="font-semibold mb-1 text-destructive">Recommendation</h3>
                    <p className="text-sm">{mockAnalysis.recommendation}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Suggested Actions</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Do not share this media without verification</li>
                      <li>Report to platform moderators</li>
                      <li>Request additional expert review</li>
                      <li>Check original source if available</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Request Review
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 mt-6">
          <h3 className="font-semibold text-lg mb-4">Detection Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Face Swap Detection", accuracy: 94 },
              { name: "Deepfake Video Analysis", accuracy: 91 },
              { name: "AI-Generated Image Detection", accuracy: 88 },
              { name: "Audio Manipulation", accuracy: 86 },
              { name: "Re-encoding Analysis", accuracy: 92 },
              { name: "Lighting Consistency", accuracy: 89 },
            ].map((capability) => (
              <div key={capability.name} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{capability.name}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <Progress value={capability.accuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {capability.accuracy}% accuracy
                  </p>
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
