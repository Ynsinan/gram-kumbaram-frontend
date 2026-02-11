"use client";

import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGetPricesQuery } from "../prices-api";
import { GOLD_TYPE_LIST } from "../types";
import { cn, formatCurrency, formatDateTime } from "@/shared/utils/helpers";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

interface GoldPriceTickerProps {
  compact?: boolean;
  showRefresh?: boolean;
}

const REFRESH_COOLDOWN_SECONDS = 10;

export const GoldPriceTicker = ({ compact = false, showRefresh = true }: GoldPriceTickerProps) => {
  const { data, isLoading, isFetching, refetch } = useGetPricesQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
  });

  // Cooldown state for refresh button
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Auto-refresh countdown state (60 seconds polling)
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(60);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Auto-refresh countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshCountdown((prev) => {
        if (prev <= 1) return 60; // Reset when reaching 0
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    if (cooldownSeconds > 0) return;
    refetch();
    setCooldownSeconds(REFRESH_COOLDOWN_SECONDS);
  };

  const isRefreshDisabled = isFetching || cooldownSeconds > 0;

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4" role="status" aria-label="Yükleniyor">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-1 h-6 w-32" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Early return for error/no data state
  if (!data?.prices) {
    return (
      <Card className="p-6" role="alert">
        <p className="text-muted-foreground text-center">Fiyat bilgisi yüklenemedi</p>
      </Card>
    );
  }

  return (
    <section className="space-y-4" aria-label="Altın fiyatları">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span>Son güncelleme: {formatDateTime(data.lastUpdated)}</span>
          <span className="text-muted-foreground/70">(Sonraki: {autoRefreshCountdown}s)</span>
        </div>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshDisabled}
            aria-label={
              cooldownSeconds > 0
                ? `${cooldownSeconds} saniye bekleyin`
                : "Fiyatları yenile"
            }
            className="min-w-10"
          >
            {cooldownSeconds > 0 ? (
              <span className="text-muted-foreground text-xs font-medium">{cooldownSeconds}</span>
            ) : (
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            )}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "grid gap-4",
          compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {GOLD_TYPE_LIST.map((goldType) => {
          const price = data.prices[goldType.code];
          const dailyChange = price.dailyChangePercent ?? 0;

          return (
            <Card
              key={goldType.id}
              className={cn(
                "transition-all hover:shadow-md",
                dailyChange > 0 && "border-green-500/20 bg-green-500/10",
                dailyChange < 0 && "border-red-500/20 bg-red-500/10"
              )}
              role="article"
              aria-label={`${goldType.name} fiyatları`}
            >
              <CardContent className={cn(compact ? "p-3" : "p-4")}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={cn("font-medium", compact ? "text-sm" : "text-base")}>
                    {goldType.name}
                  </span>
                  {/* Daily change percentage and trend indicator */}
                  <div className="flex items-center gap-1">
                    {dailyChange > 0 && (
                      <TrendingUp className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-green-500")} aria-hidden="true" />
                    )}
                    {dailyChange < 0 && (
                      <TrendingDown className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-red-500")} aria-hidden="true" />
                    )}
                    {dailyChange === 0 && (
                      <Minus className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-muted-foreground")} aria-hidden="true" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        dailyChange > 0
                          ? "text-green-500"
                          : dailyChange < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                      )}
                      aria-label={`Günlük değişim: ${dailyChange > 0 ? "+" : ""}${dailyChange.toFixed(2)}%`}
                    >
                      {dailyChange > 0 ? "+" : ""}
                      {dailyChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Alış:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        compact ? "text-sm" : "text-base"
                      )}
                      aria-label={`Alış fiyatı: ${formatCurrency(price.buyPrice)}`}
                    >
                      {formatCurrency(price.buyPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Satış:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        compact ? "text-sm" : "text-base"
                      )}
                      aria-label={`Satış fiyatı: ${formatCurrency(price.sellPrice)}`}
                    >
                      {formatCurrency(price.sellPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
