import { getSpendingByCategory, getForecastingData, getMonthlySpending } from "@/actions/analytics";
import { SpendingPieChart } from "@/components/analytics/spending-pie-chart";
import { ForecastingChart } from "@/components/analytics/forecasting-chart";
import { MonthlySpendingChart } from "@/components/analytics/monthly-spending-chart";

export default async function AnalyticsPage() {
  const spendingData = await getSpendingByCategory();
  const forecastingData = await getForecastingData();
  const monthlySpendingData = await getMonthlySpending();

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      {monthlySpendingData.length > 0 && (
        <MonthlySpendingChart data={monthlySpendingData} />
      )}

      {spendingData.length > 0 ? (
        <SpendingPieChart data={spendingData} />
      ) : (
        <div className="p-4 border rounded-lg text-center text-muted-foreground">
          No spending data for this month.
        </div>
      )}

      {forecastingData && (
        <ForecastingChart 
          currentBalance={forecastingData.currentBalance}
          estimatedBalance={forecastingData.estimatedBalance}
          monthsRemaining={forecastingData.monthsRemaining}
        />
      )}
    </div>
  );
}
