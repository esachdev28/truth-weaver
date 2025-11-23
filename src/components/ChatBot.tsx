import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const mockResponses: Record<string, string> = {
  "crisis": "I found 4 active crisis alerts. The most critical is the Cyclone Warning in Mumbai. Would you like me to show you the Crisis Alerts page?",
  "verify": "I can help you verify claims. Please paste the text or URL you'd like me to check, and I'll analyze it for credibility.",
  "agent": "All agents are currently active. ScanAgent has processed 1,247 claims today. Would you like to see the Agent Monitor page?",
  "help": "I can help you with: ✓ Quick fact-checks ✓ Navigate to pages ✓ Check crisis alerts ✓ View agent status. What would you like to do?",
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I'm your CruxAI assistant. I can help you verify claims, check crisis alerts, or navigate the platform. How can I help you today?" }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    // Mock response based on keywords
    setTimeout(() => {
      let response = "I'm here to help! You can ask me about crisis alerts, agent status, or to verify claims.";
      
      const lowerInput = userMessage.toLowerCase();
      if (lowerInput.includes("crisis") || lowerInput.includes("alert")) {
        response = mockResponses.crisis;
      } else if (lowerInput.includes("verify") || lowerInput.includes("check") || lowerInput.includes("fact")) {
        response = mockResponses.verify;
      } else if (lowerInput.includes("agent") || lowerInput.includes("status")) {
        response = mockResponses.agent;
      } else if (lowerInput.includes("help")) {
        response = mockResponses.help;
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">CruxAI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
