import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";
import { AIChatButton } from "@/components/ai-chat-button";

export default function InfoPage() {
  const resources = [
    {
      title: "Dave Ramsey",
      description: "Practical advice for getting out of debt and building wealth.",
      url: "https://www.youtube.com/@TheRamseyShow",
    },
    {
      title: "Graham Stephan",
      description: "Real estate investing and personal finance tips.",
      url: "https://www.youtube.com/@GrahamStephan",
    },
    {
      title: "Ali Abdaal",
      description: "Productivity and financial independence.",
      url: "https://www.youtube.com/@aliabdaal",
    },
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold">Financial Resources</h1>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Need help budgeting or understanding financial terms? Ask our AI assistant!
            We&apos;ll pre-fill the chat with your current financial stats.
          </p>
          <AIChatButton />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recommended Channels</h2>
        {resources.map((resource, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium flex items-center gap-2">
                  {resource.title}
                  <PlayCircle className="h-4 w-4 text-red-500" />
                </h3>
                <p className="text-xs text-muted-foreground">
                  {resource.description}
                </p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={resource.url} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
