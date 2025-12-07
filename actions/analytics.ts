"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, and, gte, lte } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, endOfYear, differenceInMonths } from "date-fns";

export async function getSpendingByCategory() {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const data = await db
    .select({
      name: categories.name,
      value: sql<number>`sum(${transactions.amount})`,
      color: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(categories.type, "expense"),
        gte(transactions.date, start),
        lte(transactions.date, end)
      )
    )
    .groupBy(categories.name, categories.color);

  return data.map((item) => ({
    ...item,
    value: Number(item.value),
  }));
}

export async function getForecastingData() {
  const { userId } = await auth();
  if (!userId) return null;

  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  // Calculate average monthly net income (Income - Expense) over last 6 months
  const history = await db
    .select({
      month: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`,
      type: categories.type,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, sixMonthsAgo),
        lte(transactions.date, endOfMonth(subMonths(now, 1))) // Exclude current partial month
      )
    )
    .groupBy(sql`to_char(${transactions.date}, 'YYYY-MM')`, categories.type);

  let totalNet = 0;
  let monthsCount = 0;
  const monthlyNet: Record<string, number> = {};

  history.forEach((h) => {
    if (!monthlyNet[h.month]) monthlyNet[h.month] = 0;
    if (h.type === "income") monthlyNet[h.month] += Number(h.total);
    else monthlyNet[h.month] -= Number(h.total);
  });

  const months = Object.values(monthlyNet);
  if (months.length > 0) {
    totalNet = months.reduce((a, b) => a + b, 0);
    monthsCount = months.length;
  }

  const avgMonthlyNet = monthsCount > 0 ? totalNet / monthsCount : 0;

  // Current Balance
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

  const currentBalance = Number(incomeResult[0]?.total || 0) - Number(expenseResult[0]?.total || 0);

  // Forecast
  const monthsRemaining = differenceInMonths(endOfYear(now), now);
  const estimatedBalance = currentBalance + avgMonthlyNet * monthsRemaining;

  return {
    currentBalance,
    avgMonthlyNet,
    estimatedBalance,
    monthsRemaining,
  };
}

export async function getMonthlySpending() {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const startOfYearDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year

  const data = await db
    .select({
      month: sql<string>`to_char(${transactions.date}, 'Mon')`,
      monthNum: sql<number>`extract(month from ${transactions.date})`,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(categories.type, "expense"),
        gte(transactions.date, startOfYearDate)
      )
    )
    .groupBy(sql`to_char(${transactions.date}, 'Mon')`, sql`extract(month from ${transactions.date})`)
    .orderBy(sql`extract(month from ${transactions.date})`);

  return data.map(item => ({
    name: item.month,
    amount: Number(item.total),
  }));
}
