import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { categories } from "./schema";

const initialCategories = [
  { name: "Salary", type: "income", color: "#22c55e", icon: "Wallet" },
  { name: "Freelance", type: "income", color: "#3b82f6", icon: "Briefcase" },
  { name: "Investments", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
  { name: "Food", type: "expense", color: "#ef4444", icon: "Utensils" },
  { name: "Rent", type: "expense", color: "#f97316", icon: "Home" },
  { name: "Transport", type: "expense", color: "#eab308", icon: "Car" },
  { name: "Utilities", type: "expense", color: "#06b6d4", icon: "Zap" },
  { name: "Entertainment", type: "expense", color: "#ec4899", icon: "Film" },
  { name: "Health", type: "expense", color: "#14b8a6", icon: "Heart" },
  { name: "Shopping", type: "expense", color: "#f43f5e", icon: "ShoppingBag" },
  { name: "Education", type: "expense", color: "#6366f1", icon: "GraduationCap" },
];

async function main() {
  console.log("Seeding categories with pg driver...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client);

  await db.insert(categories).values(initialCategories);
  console.log("Categories seeded!");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
