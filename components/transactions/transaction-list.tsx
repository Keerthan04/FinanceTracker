"use client";

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { getTransactions } from "@/actions/transactions";
import { TransactionItem } from "./transaction-item";
import { Loader2 } from "lucide-react";

interface Transaction {
  id: number;
  amount: string;
  date: Date;
  description: string;
  category: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  type: string;
}

interface TransactionListProps {
  initialTransactions: Transaction[];
}

export function TransactionList({ initialTransactions }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const { data, hasMore: more } = await getTransactions(nextPage);
    
    // Convert date strings back to Date objects if needed (server actions serialize dates)
    const formattedData = data.map(t => ({
        ...t,
        date: new Date(t.date)
    }));

    setTransactions((prev) => [...prev, ...formattedData]);
    setPage(nextPage);
    setHasMore(more);
    setLoading(false);
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const dateStr = new Date(t.date).toDateString();
    if (!groupedTransactions[dateStr]) {
      groupedTransactions[dateStr] = [];
    }
    groupedTransactions[dateStr].push(t);
  });

  return (
    <div className="pb-20">
      {Object.entries(groupedTransactions).map(([date, items]) => (
        <div key={date} className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
            {date}
          </h3>
          {items.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      ))}
      
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        </div>
      )}
      
      {!hasMore && transactions.length > 0 && (
        <div className="text-center text-sm text-muted-foreground p-4">
          No more transactions
        </div>
      )}

      {transactions.length === 0 && (
        <div className="text-center text-muted-foreground p-8">
          No transactions found. Start by adding one!
        </div>
      )}
    </div>
  );
}
