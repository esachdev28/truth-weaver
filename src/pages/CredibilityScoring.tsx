import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Link2, FileText, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const mockScores = {
  overall: 7.2,
  sourceReliability: 8.5,
  evidenceStrength: 7.8,
  trustworthiness: 6.9,
  consistency: 7.0,
  expertConsensus: 6.5,
};

export default function CredibilityScoring() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    if (!text && !url) {
      toast.error("Please provide text or URL to analyze");
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setShowResults(true);
    toast.success("Analysis complete!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-emerald-500";
    if (score >= 5) return "text-amber-500";
    return "text-red-500";
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
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images, videos, or documents
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

            {!showResults ? (
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
                    <span className={getScoreColor(mockScores.overall)}>
                      {mockScores.overall}
                    </span>
                    <span className="text-2xl text-muted-foreground">/10</span>
                  </div>
                  <Badge variant="outline" className="text-sm">Overall Credibility Score</Badge>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Source Reliability", score: mockScores.sourceReliability },
                    { name: "Evidence Strength", score: mockScores.evidenceStrength },
                    { name: "Trustworthiness", score: mockScores.trustworthiness },
                    { name: "Consistency", score: mockScores.consistency },
                    { name: "Expert Consensus", score: mockScores.expertConsensus },
                  ].map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                          {metric.score}/10
                        </span>
                      </div>
                      <Progress value={metric.score * 10} className="h-2" />
                    </div>
                  ))}
                </div>

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
      </main>

      <Footer />
    </div>
  );
}
