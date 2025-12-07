"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { getUserStatsForAI } from "@/actions/ai";
import { useState } from "react";

export function AIChatButton() {
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const stats = await getUserStatsForAI();
      if (!stats) return;

      const prompt = `Hi, I am ${stats.username}. I need financial advice.
Here are my current stats:
- Current Balance: $${stats.balance.toFixed(2)}
- Recent Transactions: ${stats.recentTransactions.map(t => `${t.description} ($${t.amount})`).join(", ")}
- Top Expenses: ${stats.topExpenses.map(e => `${e.category} ($${e.total})`).join(", ")}

Can you analyze this and give me some tips?`;

      const encodedPrompt = encodeURIComponent(prompt);
      window.open(`https://gemini.google.com/app?text=${encodedPrompt}`, "_blank");
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full gap-2" onClick={handleStartChat} disabled={loading}>
      {loading ? "Preparing Context..." : "Start Chat with AI"} <Bot className="h-4 w-4" />
    </Button>
  );
}
