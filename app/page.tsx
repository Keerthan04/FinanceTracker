import { getDashboardData } from "@/actions/dashboard";
import { SpendingSparkline } from "@/components/dashboard/sparkline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, Wallet } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { LandingPage } from "@/components/landing-page";
import { auth } from "@clerk/nextjs/server";
import { SalaryAllocator } from "@/components/salary-allocator";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return <LandingPage />;
  }

  const data = await getDashboardData();

  // Handle case where user is signed in but data fetching failed or returned null (e.g. new user)
  // Ideally getDashboardData should handle empty states gracefully
  const { balance, safeToSpend, incomeThisMonth, expenseThisMonth, chartData } = data || {
      balance: 0,
      safeToSpend: 0,
      incomeThisMonth: 0,
      expenseThisMonth: 0,
      chartData: []
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <SalaryAllocator />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground">
              Current available funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe to Spend</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(safeToSpend)}</div>
            <p className="text-xs text-muted-foreground">
              Income - Expenses (This Month)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
          <Card>
              <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Income</div>
                  <div className="text-lg font-bold text-green-500 flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(incomeThisMonth)}
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Expense</div>
                  <div className="text-lg font-bold text-red-500 flex items-center">
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(expenseThisMonth)}
                  </div>
              </CardContent>
          </Card>
      </div>

      <SpendingSparkline data={chartData} />

      {/* Recent Transactions Preview could go here */}
    </div>
  );
}
