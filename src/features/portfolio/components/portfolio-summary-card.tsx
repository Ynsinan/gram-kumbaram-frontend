"use client";

import { TrendingUp, TrendingDown, Wallet, Coins } from "lucide-react";
import { useGetPortfolioQuery } from "../portfolio-api";
import { formatCurrency, formatNumber, calculateProfitPercentage } from "@/shared/utils/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export const PortfolioSummaryCard = () => {
  const { data: portfolio, isLoading, error } = useGetPortfolioQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Portföy bilgisi yüklenemedi</p>
      </Card>
    );
  }

  const profitPercentage = calculateProfitPercentage(
    portfolio.totalPortfolioValue,
    portfolio.totalCost
  );
  const isProfit = portfolio.totalUnrealizedProfitLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
          <Wallet className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalPortfolioValue)}</div>
          <p className="text-muted-foreground text-xs">Güncel piyasa değeri</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Maliyet</CardTitle>
          <Coins className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalCost)}</div>
          <p className="text-muted-foreground text-xs">Yatırım tutarı</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gerçekleşmemiş K/Z</CardTitle>
          {isProfit ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}>
            {isProfit ? "+" : ""}
            {formatCurrency(portfolio.totalUnrealizedProfitLoss)}
          </div>
          <p className="text-muted-foreground text-xs">
            {isProfit ? "+" : ""}
            {formatNumber(profitPercentage)}% değişim
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gerçekleşen Kar</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalRealizedProfit)}</div>
          <p className="text-muted-foreground text-xs">Satışlardan elde edilen</p>
        </CardContent>
      </Card>
    </div>
  );
};
