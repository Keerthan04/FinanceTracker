import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, Wallet, TrendingUp } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Wallet className="h-6 w-6 text-primary" />
          <span>FinanceTracker</span>
        </div>
        <SignInButton mode="modal">
          <Button variant="ghost">Sign In</Button>
        </SignInButton>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 gap-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Master Your Money <span className="text-primary">Effortlessly</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track expenses, visualize trends, and forecast your financial future with our mobile-first personal finance tracker.
          </p>
        </div>

        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </SignInButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
          <div className="flex flex-col items-center p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Expense Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Quickly add transactions and categorize them to see where your money goes.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Understand your spending habits with beautiful charts and monthly breakdowns.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Smart Forecasting</h3>
            <p className="text-sm text-muted-foreground">
              Project your year-end balance based on your current spending trends.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FinanceTracker. All rights reserved.
      </footer>
    </div>
  );
}
