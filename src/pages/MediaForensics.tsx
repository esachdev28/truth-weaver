import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link2, AlertTriangle, CheckCircle2, Shield, Eye, Zap, Database, FileImage, FileVideo, Image as ImageIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

interface ForensicAnalysis {
  defakeScore: number;
  manipulations: string[];
  provenance: string;
  recommendation: string;
  metadata?: {
    resolution: string;
    format: string;
    created: string;
    modified: string;
  };
  technicalDetails?: {
    compressionAnomalies: number;
    pixelInconsistency: number;
    metadataIntegrity: number;
    aiSignature: number;
  };
}

export default function MediaForensics() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<ForensicAnalysis | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("File selected: " + e.target.files[0].name);
    }
  };

  const handleAnalyze = async () => {
    if (!url && !file) {
      toast.error("Please provide a URL or upload a file");
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    try {
      const formData = new FormData();
      if (url) formData.append("url", url);
      if (file) formData.append("file", file);

      const response = await fetch("https://fast-backend-n6qp.onrender.com/api/forensics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setAnalysis(data);
      setShowResults(true);
      toast.success("Forensic analysis complete!");
    } catch (error) {
      console.error("Error analyzing media:", error);
      toast.error("Failed to analyze media");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-emerald-500";
    if (score <= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 30) return "Likely Authentic";
    if (score <= 60) return "Moderate Suspicion";
    return "High Suspicion of Manipulation";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Media Forensics Lab
          </h1>
          <p className="text-muted-foreground text-lg">
            Advanced AI-powered deepfake detection, manipulation analysis, and authenticity verification
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Detection Rate</p>
                <p className="text-2xl font-bold text-primary">94.2%</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4 border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Media Analyzed</p>
                <p className="text-2xl font-bold text-cyan-500">12,847</p>
              </div>
              <Database className="h-8 w-8 text-cyan-500" />
            </div>
          </Card>
          <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Speed</p>
                <p className="text-2xl font-bold text-emerald-500">2.3s</p>
              </div>
              <Zap className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-4 border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI Models</p>
                <p className="text-2xl font-bold text-purple-500">7</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel - Upload */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Submit Media</h2>
              </div>

              <Tabs defaultValue="upload" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative bg-muted/30">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                      {file ? (
                        <>
                          <FileImage className="h-12 w-12 mx-auto text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
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
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileVideo className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Media URL</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/media.jpg"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Social Media Post</Label>
                    <Input placeholder="Paste Twitter, Instagram, or Facebook link" />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleAnalyze}
                className="w-full mt-6"
                size="lg"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Start Forensic Analysis
                  </>
                )}
              </Button>
            </Card>

            {/* Detection Methods */}
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Detection Technologies
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  "AI Watermark Detection",
                  "Face Manipulation Analysis",
                  "Re-encoding Artifact Detection",
                  "Lighting Consistency Checks",
                  "Audio-Visual Sync Analysis",
                  "Metadata Forensics",
                  "Neural Network Signatures"
                ].map((method, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{method}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3">
            <Card className="p-6 min-h-[700px]">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Forensic Report</h2>
              </div>

              {!showResults || !analysis ? (
                <div className="flex flex-col items-center justify-center h-[600px] text-center">
                  <Shield className="h-24 w-24 text-muted-foreground mb-6 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload media or provide a URL to begin comprehensive forensic analysis.
                    Our AI will detect deepfakes, manipulations, and synthetic content.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Main Score */}
                  <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Manipulation Risk Score</p>
                    <div className="text-6xl font-bold mb-3">
                      <span className={getScoreColor(analysis.defakeScore)}>
                        {analysis.defakeScore}
                      </span>
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <Badge
                      variant={analysis.defakeScore <= 30 ? "default" : "destructive"}
                      className="text-base px-4 py-1"
                    >
                      {getScoreLabel(analysis.defakeScore)}
                    </Badge>
                  </div>

                  {/* Technical Metrics */}
                  {analysis.technicalDetails && (
                    <Card className="p-6 bg-muted/30">
                      <h3 className="font-semibold mb-4">Technical Analysis</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(analysis.technicalDetails).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-semibold">{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Metadata */}
                  {analysis.metadata && (
                    <Card className="p-6 bg-muted/30">
                      <h3 className="font-semibold mb-4">Media Metadata</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Format</p>
                          <p className="font-semibold">{analysis.metadata.format}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Resolution</p>
                          <p className="font-semibold">{analysis.metadata.resolution}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-semibold">{analysis.metadata.created}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Modified</p>
                          <p className="font-semibold">{analysis.metadata.modified}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Detected Manipulations */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Detected Issues
                    </h3>
                    <div className="space-y-2">
                      {analysis.manipulations.map((item, idx) => (
                        <Card key={idx} className="p-4 border-l-4 border-l-destructive bg-destructive/5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{item}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Provenance */}
                  <Card className="p-6 bg-muted/30">
                    <h3 className="font-semibold mb-3">Provenance Analysis</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysis.provenance}
                    </p>
                  </Card>

                  {/* Recommendation */}
                  <div className="p-6 border-l-4 border-destructive bg-destructive/10 rounded-lg">
                    <h3 className="font-semibold mb-2 text-destructive flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Recommendation
                    </h3>
                    <p className="text-sm leading-relaxed mb-4">{analysis.recommendation}</p>

                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Suggested Actions:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Do not share this media without verification</li>
                        <li>Report to platform moderators if malicious</li>
                        <li>Request additional expert forensic review</li>
                        <li>Check original source and attribution</li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="default" className="flex-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Download Full Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Request Expert Review
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Detection Capabilities Grid */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold text-lg mb-6">Detection Capabilities & Accuracy</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Face Swap Detection", accuracy: 94, icon: Eye },
              { name: "Deepfake Video Analysis", accuracy: 91, icon: FileVideo },
              { name: "AI-Generated Image Detection", accuracy: 88, icon: ImageIcon },
              { name: "Audio Manipulation", accuracy: 86, icon: Zap },
              { name: "Re-encoding Analysis", accuracy: 92, icon: Database },
              { name: "Lighting Consistency", accuracy: 89, icon: Shield },
            ].map((capability) => {
              const Icon = capability.icon;
              return (
                <Card key={capability.name} className="p-5 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{capability.name}</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={capability.accuracy} className="h-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-sm font-bold text-primary">{capability.accuracy}%</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
