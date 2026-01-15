"use server";

import { db } from "@/db";
import { transactions, categories, users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 20;

export async function getTransactions(page: number = 1) {
  const { userId } = await auth();
  if (!userId) return { data: [], hasMore: false };

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const data = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      date: transactions.date,
      description: transactions.description,
      category: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      type: categories.type,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  const hasMore = data.length === ITEMS_PER_PAGE;
  return { data, hasMore };
}

export async function addTransaction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Sync user if not exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
      });
    }

    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const date = formData.get("date") as string;
    const isRecurring = formData.get("isRecurring") === "on";

    if (!amount || !description || !categoryId || !date) {
      return { success: false, error: "Missing required fields" };
    }

    await db.insert(transactions).values({
      amount: amount,
      description,
      categoryId: parseInt(categoryId),
      date: new Date(date),
      userId: user.id,
      isRecurring,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add transaction:", error);
    return { success: false, error: "Failed to add transaction" };
  }
}

export async function getCategories() {
    const data = await db.select().from(categories);
    return data;
}
