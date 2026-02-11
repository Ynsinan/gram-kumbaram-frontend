"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { useGetPricesQuery } from "@/features/market/prices-api";
import { GOLD_TYPE_LIST, type GoldTypeCode } from "@/features/market/types";
import { formatCurrency } from "@/shared/utils/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

export const ProfitCalculator = () => {
  const { data: pricesData, isLoading } = useGetPricesQuery();
  const [goldType, setGoldType] = useState<GoldTypeCode>("gram");
  const [quantity, setQuantity] = useState<string>("1");

  const calculation = useMemo(() => {
    if (!pricesData?.prices || !quantity) {
      return null;
    }

    const qty = parseFloat(quantity);
    const prices = pricesData.prices[goldType];

    if (isNaN(qty) || qty <= 0) {
      return null;
    }

    return {
      buyPrice: prices.buyPrice,
      sellPrice: prices.sellPrice,
      totalBuyValue: qty * prices.buyPrice,
      totalSellValue: qty * prices.sellPrice,
    };
  }, [pricesData, goldType, quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const selectedGoldName = GOLD_TYPE_LIST.find((t) => t.code === goldType)?.name || "";

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Altın Değer Hesaplayıcı
        </CardTitle>
        <CardDescription>
          Altın türü ve miktara göre güncel alış/satış değerlerini görün
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="goldType">Altın Türü</Label>
            <Select value={goldType} onValueChange={(value) => setGoldType(value as GoldTypeCode)}>
              <SelectTrigger id="goldType">
                <SelectValue placeholder="Altın türü seçin" />
              </SelectTrigger>
              <SelectContent>
                {GOLD_TYPE_LIST.map((type) => (
                  <SelectItem key={type.id} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Adet / Gram</Label>
            <Input
              id="quantity"
              type="text"
              inputMode="decimal"
              placeholder="Örn: 5"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 pt-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : calculation ? (
          <div className="grid grid-cols-2 gap-4 pt-4">
            {/* Buy Price Card */}
            <div className="space-y-2 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-muted-foreground text-sm">Alış Fiyatı</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(calculation.buyPrice)}
              </p>
              <hr className="border-green-500/20" />
              <p className="text-muted-foreground text-xs">
                {quantity} {selectedGoldName} Toplam
              </p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(calculation.totalBuyValue)}
              </p>
            </div>

            {/* Sell Price Card */}
            <div className="space-y-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-muted-foreground text-sm">Satış Fiyatı</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatCurrency(calculation.sellPrice)}
              </p>
              <hr className="border-red-500/20" />
              <p className="text-muted-foreground text-xs">
                {quantity} {selectedGoldName} Toplam
              </p>
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(calculation.totalSellValue)}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
