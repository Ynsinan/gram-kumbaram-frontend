"use client";

import { useGetPortfolioQuery } from "../portfolio-api";
import { GOLD_TYPES } from "@/features/market/types";
import { cn, formatCurrency, formatNumber } from "@/shared/utils/helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";

export const PortfolioTable = () => {
  const { data: portfolio, isLoading, error } = useGetPortfolioQuery();

  // Early return for loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Varlıklarım</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" role="status" aria-label="Yükleniyor">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Early return for error state
  if (error || !portfolio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Varlıklarım</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center" role="alert">
            Varlık bilgisi yüklenemedi
          </p>
        </CardContent>
      </Card>
    );
  }

  // Early return for empty state
  if (portfolio.assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Varlıklarım</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            Henüz varlık bulunmuyor. İlk işleminizi ekleyin!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Varlıklarım</CardTitle>
      </CardHeader>
      <CardContent>
        <Table aria-label="Portföy varlıkları tablosu">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Altın Türü</TableHead>
              <TableHead scope="col" className="text-right">
                Miktar
              </TableHead>
              <TableHead scope="col" className="text-right">
                Ort. Maliyet
              </TableHead>
              <TableHead scope="col" className="text-right">
                Güncel Fiyat
              </TableHead>
              <TableHead scope="col" className="text-right">
                Toplam Değer
              </TableHead>
              <TableHead scope="col" className="text-right">
                K/Z
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.assets.map((asset) => {
              const isProfit = asset.unrealizedProfitLoss >= 0;
              const goldTypeInfo = GOLD_TYPES[asset.goldType];
              const profitLossLabel = isProfit ? "Kar" : "Zarar";

              return (
                <TableRow key={asset.goldType}>
                  <TableCell className="font-medium">
                    {goldTypeInfo?.name || asset.goldType}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(asset.netQuantity, asset.goldType === "gram" ? 2 : 0)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(asset.averageCost)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(asset.currentPrice)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(asset.currentValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={isProfit ? "default" : "destructive"}
                      className={cn(isProfit && "bg-green-500/10 text-green-500 hover:bg-green-500/20")}
                      aria-label={`${profitLossLabel}: ${formatCurrency(asset.unrealizedProfitLoss)}`}
                    >
                      {isProfit ? "+" : ""}
                      {formatCurrency(asset.unrealizedProfitLoss)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
