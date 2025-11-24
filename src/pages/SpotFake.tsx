import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Search, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";

interface SpotFakeResult {
  id: string;
  content: string;
  verdict: "FAKE" | "REAL" | "UNCERTAIN";
  confidence: number;
  timestamp: string;
  signals: {
    name: string;
    score: number;
    status: "pass" | "fail" | "warning";
  }[];
  explanation: string;
}

export default function SpotFake() {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SpotFakeResult[]>([]);

  const handleAnalyze = async () => {
    if (!inputText && !inputUrl) {
      toast.error("Please enter text or URL to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate SpotFake analysis
    setTimeout(() => {
      const mockResult: SpotFakeResult = {
        id: Date.now().toString(),
        content: inputText || inputUrl,
        verdict: Math.random() > 0.5 ? "FAKE" : "REAL",
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date().toISOString(),
        signals: [
          { name: "Source Credibility", score: Math.floor(Math.random() * 100), status: "pass" },
          { name: "Linguistic Patterns", score: Math.floor(Math.random() * 100), status: "warning" },
          { name: "Image Metadata", score: Math.floor(Math.random() * 100), status: "pass" },
          { name: "Cross-Reference Check", score: Math.floor(Math.random() * 100), status: "fail" },
          { name: "Temporal Consistency", score: Math.floor(Math.random() * 100), status: "pass" },
        ],
        explanation: "Analysis completed using SpotFake's multi-signal detection framework. The content shows patterns consistent with fabricated information based on source verification and linguistic analysis."
      };
      
      setResults([mockResult, ...results]);
      setIsAnalyzing(false);
      toast.success("SpotFake analysis complete!");
      setInputText("");
      setInputUrl("");
    }, 2000);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "FAKE": return "destructive";
      case "REAL": return "default";
      default: return "secondary";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "FAKE": return <XCircle className="h-5 w-5" />;
      case "REAL": return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
            SpotFake Framework
          </h1>
          <p className="text-muted-foreground text-lg">
            Advanced multi-signal misinformation detection powered by AI and cross-verification
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Detection Accuracy</p>
                <p className="text-2xl font-bold text-primary">96.8%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Claims Analyzed</p>
                <p className="text-2xl font-bold text-emerald-600">24,891</p>
              </div>
              <Search className="h-8 w-8 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-4 border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                <p className="text-2xl font-bold text-cyan-500">1.8s</p>
              </div>
              <Clock className="h-8 w-8 text-cyan-500" />
            </div>
          </Card>
          <Card className="p-4 border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                <p className="text-2xl font-bold text-purple-500">8,442</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Submit for Analysis</h2>
              </div>

              <Tabs defaultValue="text" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Claim or Content</label>
                    <textarea
                      className="w-full min-h-[120px] p-3 rounded-lg border bg-background resize-none"
                      placeholder="Enter the claim, post, or content you want to verify..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com/article"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
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
                    <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Run SpotFake Analysis
                  </>
                )}
              </Button>

              {/* Detection Signals */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-sm mb-3">Detection Signals</h3>
                <div className="space-y-2 text-xs">
                  {[
                    "Source credibility scoring",
                    "Linguistic pattern analysis",
                    "Image/video forensics",
                    "Cross-reference verification",
                    "Temporal consistency check",
                    "Bot detection algorithms",
                    "Network propagation analysis"
                  ].map((signal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                </div>
                <Badge variant="secondary">{results.length} results</Badge>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-lg mb-2">No analyses yet</p>
                  <p className="text-sm text-muted-foreground">
                    Submit content to see SpotFake detection results
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.map((result) => (
                    <Card key={result.id} className="p-6 border-l-4 border-l-primary">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getVerdictIcon(result.verdict)}
                          <div>
                            <Badge variant={getVerdictColor(result.verdict)} className="mb-2">
                              {result.verdict}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Confidence: {result.confidence}%
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm font-medium mb-1">Analyzed Content:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.content}
                        </p>
                      </div>

                      {/* Signal Scores */}
                      <div className="space-y-3 mb-4">
                        <h3 className="font-semibold text-sm">Detection Signals</h3>
                        {result.signals.map((signal, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{signal.name}</span>
                                {signal.status === "pass" && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                                {signal.status === "fail" && <XCircle className="h-3 w-3 text-destructive" />}
                                {signal.status === "warning" && <AlertCircle className="h-3 w-3 text-amber-500" />}
                              </div>
                              <span className="font-semibold">{signal.score}%</span>
                            </div>
                            <Progress value={signal.score} className="h-1.5" />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm mb-2">Explanation</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.explanation}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
