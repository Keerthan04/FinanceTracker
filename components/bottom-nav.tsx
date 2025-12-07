"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, PieChart, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddTransactionDrawer } from "./transactions/add-transaction-drawer";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        
        <Link
          href="/transactions"
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            pathname === "/transactions" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <List className="h-5 w-5" />
          <span>Transactions</span>
        </Link>

        <div className="relative">
            <AddTransactionDrawer />
        </div>

        <Link
          href="/analytics"
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            pathname === "/analytics" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <PieChart className="h-5 w-5" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/info"
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            pathname === "/info" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Bot className="h-5 w-5" />
          <span>Info</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
