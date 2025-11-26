import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Article {
    text: string;
    source: string;
    status: string;
    timestamp?: string;
    evidence?: Array<{
        source: string;
        content: string;
        url: string;
    }>;
}

export default function CategoryNews() {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryNames: Record<string, string> = {
        "general-news": "General News",
        "politics": "Politics & Elections",
        "health": "Health & Medicine",
        "crisis": "Disasters & Crisis Alerts",
        "finance": "Stock Market & Finance",
        "tech-ai": "Tech & AI Claims",
        "science": "Science & Research",
        "crime": "Crime & Law Enforcement",
        "international": "International Affairs",
        "social": "Social Media Trends"
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://fast-backend-n6qp.onrender.com/api/news/${category}`);
                if (!response.ok) throw new Error("Failed to fetch news");
                const data = await response.json();
                setArticles(data.articles || []);
            } catch (error) {
                console.error("Error fetching news:", error);
                toast.error("Failed to load news articles");
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchNews();
        }
    }, [category]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>

                    <h1 className="text-4xl font-bold mb-2">
                        {categoryNames[category || ""] || "News"}
                    </h1>
                    <p className="text-muted-foreground">
                        Latest articles and claims in this category
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading articles...</span>
                    </div>
                ) : articles.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-muted-foreground">No articles found in this category.</p>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {articles.map((article, idx) => (
                            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{article.text}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline">{article.source}</Badge>
                                            <Badge
                                                variant={article.status === "verified" ? "default" : "secondary"}
                                            >
                                                {article.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {article.evidence && article.evidence.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="font-semibold text-sm text-muted-foreground">Sources:</h4>
                                        {article.evidence.map((evidence, evidx) => (
                                            <div key={evidx} className="flex items-start gap-2 text-sm">
                                                <ExternalLink className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-muted-foreground line-clamp-2">
                                                        {evidence.content}
                                                    </p>
                                                    {evidence.url && (
                                                        <a
                                                            href={evidence.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline text-xs"
                                                        >
                                                            {evidence.url}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
