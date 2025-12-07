import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import * as Icons from "lucide-react";

interface TransactionItemProps {
  transaction: {
    id: number;
    amount: string;
    date: Date;
    description: string;
    category: string;
    categoryIcon: string | null;
    categoryColor: string | null;
    type: string;
  };
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const Icon = transaction.categoryIcon
    ? (Icons[transaction.categoryIcon as keyof typeof Icons] as React.ElementType)
    : Icons.HelpCircle;

  return (
    <Card className="mb-2">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: transaction.categoryColor || "#e5e7eb",
              color: "white",
            }}
          >
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")} • {transaction.category}
            </p>
          </div>
        </div>
        <div
          className={`font-bold ${
            transaction.type === "income" ? "text-green-500" : "text-red-500"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(Number(transaction.amount))}
        </div>
      </CardContent>
    </Card>
  );
}
