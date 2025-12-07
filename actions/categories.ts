"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string || "Circle"; // Default icon

  await db.insert(categories).values({
    name,
    type,
    color,
    icon,
    userId, // User-specific category
  });

  revalidatePath("/");
  revalidatePath("/transactions");
}
