"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql, eq, and, desc } from "drizzle-orm";

export async function getUserStatsForAI() {
  const user = await currentUser();
  const { userId } = await auth();
  
  if (!userId || !user) return null;

  // 1. Current Balance
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

  const balance = Number(incomeResult[0]?.total || 0) - Number(expenseResult[0]?.total || 0);

  // 2. Recent Transactions (Last 5)
  const recentTransactions = await db
    .select({
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      category: categories.name,
      type: categories.type,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(5);

  // 3. Top Expense Categories (All time)
  const topExpenses = await db
    .select({
      category: categories.name,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.userId, userId), eq(categories.type, "expense")))
    .groupBy(categories.name)
    .orderBy(desc(sql`sum(${transactions.amount})`))
    .limit(3);

  return {
    username: user.firstName || "User",
    balance,
    recentTransactions,
    topExpenses,
  };
}
