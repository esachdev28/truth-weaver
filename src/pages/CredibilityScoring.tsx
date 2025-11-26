import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Link2, FileText, Shield, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

interface ScoreResponse {
  final_score: number;
  source_reliability: number;
  evidence_strength: number;
  consistency: number;
  verdict: "VERIFIED" | "FALSE" | "MIXED" | "UNVERIFIED";
}

interface Claim {
  text: string;
  evidence: Array<{
    source: string;
    content: string;
    url: string;
  }>;
}

interface ImageAnalysis {
  ai_detection: {
    ai_probability: number;
    real_probability: number;
    verdict: string;
    confidence: string;
    model: string;
  };
  description: {
    description: string;
    model: string;
    confidence: string;
  };
  metadata: {
    format: string;
    size: string;
    width: number;
    height: number;
  };
}

export default function CredibilityScoring() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreResponse | null>(null);
  const [claimData, setClaimData] = useState<Claim | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("File selected: " + e.target.files[0].name);
    }
  };

  const handleAnalyze = async () => {
    if (!text && !url && !file) {
      toast.error("Please provide text, URL, or upload a file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (url) formData.append("link", url);
      if (file) formData.append("image", file);

      const response = await fetch("https://fast-backend-n6qp.onrender.com/api/verify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setScoreData(data.score);
      setClaimData(data.claim);
      setImageAnalysis(data.image_analysis);
      setShowResults(true);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "VERIFIED":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>;
      case "FALSE":
        return <Badge variant="destructive">False</Badge>;
      case "MIXED":
        return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Mixed</Badge>;
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Credibility Scoring</h1>
          <p className="text-muted-foreground">Multi-modal credibility assessment for text, images, videos, and links</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Submit for Analysis</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input">Paste Text or Claim</Label>
                <Textarea
                  id="text-input"
                  placeholder="Enter the claim or text you want to verify..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url-input">URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Media</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images supported
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Credibility"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Credibility Report</h2>
            </div>

            {!showResults || !scoreData ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Submit content to see credibility analysis
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-5xl font-bold mb-2">
                    <span className={getScoreColor(scoreData.final_score)}>
                      {scoreData.final_score}
                    </span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <div className="flex justify-center gap-2 items-center mb-2">
                    {getVerdictBadge(scoreData.verdict)}
                  </div>
                  <Badge variant="outline" className="text-sm">Overall Credibility Score</Badge>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Source Reliability", score: scoreData.source_reliability },
                    { name: "Evidence Strength", score: scoreData.evidence_strength },
                    { name: "Consistency", score: scoreData.consistency },
                  ].map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                          {metric.score}/100
                        </span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  ))}
                </div>

                {claimData?.evidence && claimData.evidence.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Evidence Sources</h3>
                    <ul className="space-y-2 text-sm">
                      {claimData.evidence.map((ev, idx) => (
                        <li key={idx} className="bg-muted p-2 rounded">
                          <a href={ev.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-primary block truncate">
                            {ev.source}
                          </a>
                          <p className="text-muted-foreground text-xs line-clamp-2">{ev.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Export Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Image Analysis Results - NEW SECTION */}
        {showResults && imageAnalysis && (
          <Card className="p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">AI Image Analysis</h2>
            </div>

            {/* Image Description - NEW */}
            {imageAnalysis.description && (
              <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Image Description
                </h3>
                <p className="text-base leading-relaxed mb-3">
                  {imageAnalysis.description.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Model: {imageAnalysis.description.model}</span>
                  <span>•</span>
                  <span>Confidence: {imageAnalysis.description.confidence}</span>
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Detection Score */}
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-5xl font-bold mb-2">
                    <span className={imageAnalysis.ai_detection.ai_probability > 70 ? "text-red-500" : imageAnalysis.ai_detection.ai_probability > 40 ? "text-amber-500" : "text-emerald-500"}>
                      {imageAnalysis.ai_detection.ai_probability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-center gap-2 items-center mb-2">
                    {imageAnalysis.ai_detection.ai_probability > 70 ? (
                      <Badge variant="destructive">Likely AI-Generated</Badge>
                    ) : imageAnalysis.ai_detection.ai_probability > 40 ? (
                      <Badge variant="secondary" className="bg-amber-500 text-white">Uncertain</Badge>
                    ) : (
                      <Badge className="bg-emerald-500">Likely Real</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-sm">AI Generation Probability</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>AI-Generated</span>
                    <span className="font-semibold">{imageAnalysis.ai_detection.ai_probability.toFixed(1)}%</span>
                  </div>
                  <Progress value={imageAnalysis.ai_detection.ai_probability} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span>Real Photo</span>
                    <span className="font-semibold">{imageAnalysis.ai_detection.real_probability.toFixed(1)}%</span>
                  </div>
                  <Progress value={imageAnalysis.ai_detection.real_probability} className="h-2" />
                </div>

                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Verdict:</strong> {imageAnalysis.ai_detection.verdict}</p>
                  <p><strong>Confidence:</strong> {imageAnalysis.ai_detection.confidence}</p>
                  <p className="text-xs text-muted-foreground mt-1">Model: {imageAnalysis.ai_detection.model}</p>
                </div>
              </div>

              {/* Image Metadata */}
              <div className="space-y-4">
                <h3 className="font-semibold">Image Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">{imageAnalysis.metadata.format}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="font-medium">{imageAnalysis.metadata.size}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Width:</span>
                    <span className="font-medium">{imageAnalysis.metadata.width}px</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">{imageAnalysis.metadata.height}px</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm">
                  <p className="font-semibold mb-1">💡 Detection Tips:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• AI images often have perfect dimensions (512x512, 1024x1024)</li>
                    <li>• Real photos usually have EXIF metadata</li>
                    <li>• Check for unnatural patterns or artifacts</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
