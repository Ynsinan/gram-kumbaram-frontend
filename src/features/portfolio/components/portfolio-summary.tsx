"use client";

import { TrendingUp, TrendingDown, Wallet, Coins } from "lucide-react";
import { useGetPortfolioQuery } from "../portfolio-api";
import { cn, formatCurrency, formatNumber, calculateProfitPercentage } from "@/shared/utils/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export const PortfolioSummary = () => {
  const { data: portfolio, isLoading, error } = useGetPortfolioQuery();

  // Early return for loading state
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-label="Yükleniyor"
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 h-8 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Early return for error state
  if (error || !portfolio) {
    return (
      <Card className="p-6" role="alert">
        <p className="text-muted-foreground text-center">Portföy bilgisi yüklenemedi</p>
      </Card>
    );
  }

  const profitPercentage = calculateProfitPercentage(
    portfolio.totalPortfolioValue,
    portfolio.totalCost
  );
  const isUnrealizedProfit = portfolio.totalUnrealizedProfitLoss >= 0;
  const isRealizedProfit = portfolio.totalRealizedProfit >= 0;

  return (
    <section
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      aria-label="Portföy özeti"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
          <Wallet className="text-muted-foreground h-4 w-4" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalPortfolioValue)}</div>
          <p className="text-muted-foreground text-xs">Güncel piyasa değeri</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Maliyet</CardTitle>
          <Coins className="text-muted-foreground h-4 w-4" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalCost)}</div>
          <p className="text-muted-foreground text-xs">Yatırım tutarı</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gerçekleşmemiş K/Z</CardTitle>
          {isUnrealizedProfit ? (
            <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={cn("text-2xl font-bold", isUnrealizedProfit ? "text-green-500" : "text-red-500")}
            aria-label={`Gerçekleşmemiş ${isUnrealizedProfit ? "kar" : "zarar"}: ${formatCurrency(portfolio.totalUnrealizedProfitLoss)}`}
          >
            {isUnrealizedProfit ? "+" : ""}
            {formatCurrency(portfolio.totalUnrealizedProfitLoss)}
          </div>
          <p className={cn("text-xs", isUnrealizedProfit ? "text-green-500" : "text-red-500")}>
            {isUnrealizedProfit ? "+" : ""}
            {formatNumber(profitPercentage)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gerçekleşmiş K/Z</CardTitle>
          {isRealizedProfit ? (
            <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={cn("text-2xl font-bold", isRealizedProfit ? "text-green-500" : "text-red-500")}
            aria-label={`Gerçekleşmiş ${isRealizedProfit ? "kar" : "zarar"}: ${formatCurrency(portfolio.totalRealizedProfit)}`}
          >
            {isRealizedProfit ? "+" : ""}
            {formatCurrency(portfolio.totalRealizedProfit)}
          </div>
          <p className="text-muted-foreground text-xs">Satışlardan elde edilen</p>
        </CardContent>
      </Card>
    </section>
  );
};
