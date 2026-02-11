"use client";

import { useGetPortfolioQuery } from "../portfolio-api";
import { GOLD_TYPES, GoldTypeEnum, type GoldTypeId } from "@/features/market/types";
import { cn, formatCurrency, formatNumber } from "@/shared/utils/helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { PieChart, Pie, ResponsiveContainer, Legend } from "recharts";

const CHART_COLORS: Record<GoldTypeId, string> = {
  [GoldTypeEnum.GRAM]: "#10b981",
  [GoldTypeEnum.CEYREK]: "#3b82f6",
  [GoldTypeEnum.YARIM]: "#f59e0b",
  [GoldTypeEnum.CUMHURIYET]: "#ef4444",
};

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

  // Filter out assets with zero quantity
  const ownedAssets = portfolio.assets.filter((asset) => asset.netQuantity > 0);

  // Early return for empty state
  if (ownedAssets.length === 0) {
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

  // Calculate percentage distribution for pie chart
  const totalValue = portfolio.totalPortfolioValue;
  const chartData = ownedAssets.map((asset) => {
    const goldTypeInfo = GOLD_TYPES[asset.goldType];
    const percentage = totalValue > 0 ? (asset.currentValue / totalValue) * 100 : 0;
    return {
      name: goldTypeInfo?.name || asset.goldType,
      value: asset.currentValue,
      percentage,
      goldType: asset.goldType,
      fill: CHART_COLORS[asset.goldType],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Varlıklarım</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="chart">Grafik</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
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
                {ownedAssets.map((asset) => {
                  const isProfit = asset.unrealizedProfitLoss >= 0;
                  const goldTypeInfo = GOLD_TYPES[asset.goldType];
                  const profitLossLabel = isProfit ? "Kar" : "Zarar";

                  return (
                    <TableRow key={asset.goldType}>
                      <TableCell className="font-medium">
                        {goldTypeInfo?.name || asset.goldType}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(asset.netQuantity, asset.goldType === GoldTypeEnum.GRAM ? 2 : 0)}
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
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <div className="flex flex-col items-center space-y-4">
              <ResponsiveContainer width="100%" height={350} className="pointer-events-none">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    dataKey="value"
                    paddingAngle={2}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                {chartData.map((item) => (
                  <div
                    key={item.goldType}
                    className="flex flex-col items-center space-y-1 rounded-lg border p-3"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[item.goldType] }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">%{item.percentage.toFixed(1)}</span>
                    <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
