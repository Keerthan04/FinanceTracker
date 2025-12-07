import { getTransactions } from "@/actions/transactions";
import { TransactionList } from "@/components/transactions/transaction-list";

export default async function TransactionsPage() {
  const { data } = await getTransactions(1);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
      <TransactionList initialTransactions={data} />
    </div>
  );
}
