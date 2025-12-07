export const ALLOCATION_RULES = [
  { id: "1", category: "Wealth Creation (SIP)", percent: 9.5, color: "bg-blue-500" },
  { id: "2", category: "Emergency Fund", percent: 6.0, color: "bg-red-500", note: "Stop at ₹3L" },
  { id: "3", category: "PPF (Anchor)", percent: 3.5, color: "bg-yellow-500" },
  { id: "4", category: "Term Insurance", percent: 1.0, color: "bg-orange-500" },
  { id: "5", category: "Family Support", percent: 24.0, color: "bg-purple-500" },
  { id: "6", category: "Living Expenses", percent: 41.5, color: "bg-green-500" },
  { id: "7", category: "Guilt-Free Buffer", percent: 14.5, color: "bg-pink-500" }
];

export interface AllocationResult {
  ruleId: string;
  category: string;
  amount: number;
  percent: number;
  color: string;
  note?: string;
}

export function calculateAllocation(salary: number): AllocationResult[] {
  return ALLOCATION_RULES.map(rule => ({
    ruleId: rule.id,
    category: rule.category,
    amount: (salary * rule.percent) / 100,
    percent: rule.percent,
    color: rule.color,
    note: rule.note
  }));
}
