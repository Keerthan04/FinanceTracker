"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, and, gte, lte, desc } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) return null;

  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  // 1. Total Balance (All time)
  const incomeResult = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.userId, userId), eq(categories.type, "income")));

  const expenseResult = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.userId, userId), eq(categories.type, "expense")));

  const totalIncome = Number(incomeResult[0]?.total || 0);
  const totalExpense = Number(expenseResult[0]?.total || 0);
  const balance = totalIncome - totalExpense;

  // 2. Safe to Spend (This Month)
  // Income this month - Expenses this month
  const incomeThisMonthResult = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(categories.type, "income"),
        gte(transactions.date, startOfCurrentMonth),
        lte(transactions.date, endOfCurrentMonth)
      )
    );

  const expenseThisMonthResult = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(categories.type, "expense"),
        gte(transactions.date, startOfCurrentMonth),
        lte(transactions.date, endOfCurrentMonth)
      )
    );

  const incomeThisMonth = Number(incomeThisMonthResult[0]?.total || 0);
  const expenseThisMonth = Number(expenseThisMonthResult[0]?.total || 0);
  const safeToSpend = incomeThisMonth - expenseThisMonth;

  // 3. Sparkline Data (Last 30 Days Spending)
  // Group by date
  const last30Days = subMonths(now, 1);
  const sparklineData = await db
    .select({
      date: transactions.date,
      amount: transactions.amount,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(categories.type, "expense"),
        gte(transactions.date, last30Days)
      )
    )
    .orderBy(transactions.date);

  // Process sparkline data to aggregate by day
  const dailySpending: Record<string, number> = {};
  sparklineData.forEach((t) => {
    const dateStr = format(t.date, "yyyy-MM-dd");
    dailySpending[dateStr] = (dailySpending[dateStr] || 0) + Number(t.amount);
  });

  const chartData = Object.entries(dailySpending).map(([date, amount]) => ({
    date,
    amount,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    balance,
    safeToSpend,
    incomeThisMonth,
    expenseThisMonth,
    chartData,
  };
}
