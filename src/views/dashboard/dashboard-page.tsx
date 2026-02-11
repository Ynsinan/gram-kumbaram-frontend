"use client";

import { GoldPriceTicker } from "@/features/market/components/gold-price-ticker";
import { PortfolioSummary } from "@/features/portfolio/components/portfolio-summary";
import { PortfolioTable } from "@/features/portfolio/components/portfolio-table";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { useAuth } from "@/shared/hooks/use-auth";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto space-y-8 py-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Hoş geldin, {user?.name?.split(" ")[0] || "Kullanıcı"}
          </h1>
          <p className="text-muted-foreground">Altın kumbaranızı buradan yönetebilirsiniz.</p>
        </div>
        <TransactionForm />
      </div>

      {/* Portfolio Summary */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Portföy Özeti</h2>
        <PortfolioSummary />
      </section>

      {/* Live Prices */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Güncel Fiyatlar</h2>
        <GoldPriceTicker compact />
      </section>

      {/* Portfolio Assets */}
      <section>
        <PortfolioTable />
      </section>

      {/* Transaction History */}
      <section>
        <TransactionTable />
      </section>
    </div>
  );
};
