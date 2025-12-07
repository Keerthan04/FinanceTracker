"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ForecastingChartProps {
  currentBalance: number;
  estimatedBalance: number;
  monthsRemaining: number;
}

export function ForecastingChart({ currentBalance, estimatedBalance, monthsRemaining }: ForecastingChartProps) {
  const data = [
    {
      name: "Now",
      amount: currentBalance,
    },
    {
      name: "Year End",
      amount: estimatedBalance,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year End Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Based on your average spending, you are projected to have 
          <span className="font-bold text-foreground"> {formatCurrency(estimatedBalance)} </span>
          by the end of the year ({monthsRemaining} months remaining).
        </div>
      </CardContent>
    </Card>
  );
}
