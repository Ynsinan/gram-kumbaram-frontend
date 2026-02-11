"use client";

import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGetPricesQuery } from "../prices-api";
import { GOLD_TYPE_LIST, type GoldPricesMap, type GoldTypeCode } from "../types";
import { cn, formatCurrency, formatDateTime } from "@/shared/utils/helpers";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

type PriceDirection = "up" | "down" | "neutral";

interface PriceChange {
  buyDirection: PriceDirection;
  sellDirection: PriceDirection;
}

type PriceChanges = Record<GoldTypeCode, PriceChange>;

const initialPriceChanges: PriceChanges = {
  gram: { buyDirection: "neutral", sellDirection: "neutral" },
  ceyrek: { buyDirection: "neutral", sellDirection: "neutral" },
  yarim: { buyDirection: "neutral", sellDirection: "neutral" },
  cumhuriyet: { buyDirection: "neutral", sellDirection: "neutral" },
};

const calculateDirection = (current: number, previous: number): PriceDirection => {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
};

interface GoldPriceTickerProps {
  compact?: boolean;
  showRefresh?: boolean;
}

const REFRESH_COOLDOWN_SECONDS = 10;

export const GoldPriceTicker = ({ compact = false, showRefresh = true }: GoldPriceTickerProps) => {
  const { data, isLoading, isFetching, refetch } = useGetPricesQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
  });

  // Store previous prices and price changes in state
  const [previousPrices, setPreviousPrices] = useState<GoldPricesMap | null>(null);
  const [priceChanges, setPriceChanges] = useState<PriceChanges>(initialPriceChanges);

  // Cooldown state for refresh button
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Update price changes when data changes
  useEffect(() => {
    if (!data?.prices) return;

    // If we have previous prices, calculate changes
    if (previousPrices) {
      const changes: PriceChanges = { ...initialPriceChanges };

      (Object.keys(data.prices) as GoldTypeCode[]).forEach((code) => {
        const current = data.prices[code];
        const previous = previousPrices[code];

        if (current && previous) {
          changes[code] = {
            buyDirection: calculateDirection(current.buyPrice, previous.buyPrice),
            sellDirection: calculateDirection(current.sellPrice, previous.sellPrice),
          };
        }
      });

      setPriceChanges(changes);
    }

    // Store current prices for next comparison
    setPreviousPrices(data.prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.lastUpdated]); // Only trigger when lastUpdated changes

  const getPriceChange = (code: GoldTypeCode): PriceChange => {
    return priceChanges[code];
  };

  const renderDirectionIcon = (direction: PriceDirection, size: string) => {
    if (direction === "up") {
      return <TrendingUp className={cn(size, "text-green-500")} aria-hidden="true" />;
    }
    if (direction === "down") {
      return <TrendingDown className={cn(size, "text-red-500")} aria-hidden="true" />;
    }
    return <Minus className={cn(size, "text-muted-foreground")} aria-hidden="true" />;
  };

  const getDirectionColor = (direction: PriceDirection): string => {
    if (direction === "up") return "text-green-500";
    if (direction === "down") return "text-red-500";
    return "";
  };

  const getDirectionLabel = (direction: PriceDirection): string => {
    if (direction === "up") return "yükseliyor";
    if (direction === "down") return "düşüyor";
    return "değişmedi";
  };

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
        <span className="text-muted-foreground text-xs">
          Son güncelleme: {formatDateTime(data.lastUpdated)}
        </span>
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
            className="min-w-[40px]"
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
          const priceChange = getPriceChange(goldType.code);

          return (
            <Card
              key={goldType.id}
              className="transition-all hover:shadow-md"
              role="article"
              aria-label={`${goldType.name} fiyatları`}
            >
              <CardContent className={cn(compact ? "p-3" : "p-4")}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={cn("font-medium", compact ? "text-sm" : "text-base")}>
                    {goldType.name}
                  </span>
                  {/* Overall trend indicator based on sell price */}
                  {renderDirectionIcon(
                    priceChange.sellDirection,
                    compact ? "h-4 w-4" : "h-5 w-5"
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Alış:</span>
                    <div className="flex items-center gap-1">
                      {renderDirectionIcon(priceChange.buyDirection, "h-3 w-3")}
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          compact ? "text-sm" : "text-base",
                          getDirectionColor(priceChange.buyDirection)
                        )}
                        aria-label={`Alış fiyatı: ${formatCurrency(price.buyPrice)}, ${getDirectionLabel(priceChange.buyDirection)}`}
                      >
                        {formatCurrency(price.buyPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Satış:</span>
                    <div className="flex items-center gap-1">
                      {renderDirectionIcon(priceChange.sellDirection, "h-3 w-3")}
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          compact ? "text-sm" : "text-base",
                          priceChange.sellDirection !== "neutral"
                            ? getDirectionColor(priceChange.sellDirection)
                            : "text-primary"
                        )}
                        aria-label={`Satış fiyatı: ${formatCurrency(price.sellPrice)}, ${getDirectionLabel(priceChange.sellDirection)}`}
                      >
                        {formatCurrency(price.sellPrice)}
                      </span>
                    </div>
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
