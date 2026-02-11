"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateTransactionMutation } from "../transactions-api";
import { useGetPricesQuery } from "@/features/market/prices-api";
import { GOLD_TYPE_LIST, GoldTypeEnum, type GoldTypeId } from "@/features/market/types";
import type { TransactionType } from "../types";
import { formatCurrency } from "@/shared/utils/helpers";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/form";

// Format number to Turkish locale (1.234,56)
const formatTurkishNumber = (value: string): string => {
  // Remove all non-numeric characters except comma
  const cleanValue = value.replace(/[^\d,]/g, "");

  // Split by comma (decimal separator in Turkish)
  const parts = cleanValue.split(",");
  const integerPart = parts[0] || "";
  const decimalPart = parts[1];

  // Add thousand separators (dots)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Return with decimal part if exists
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }
  return formattedInteger;
};

// Parse Turkish formatted number to raw number string
const parseTurkishNumber = (value: string): string => {
  // Remove thousand separators (dots) and replace comma with dot for parsing
  return value.replace(/\./g, "").replace(",", ".");
};

const transactionSchema = z.object({
  type: z.enum(["BUY", "SELL"]),
  goldType: z.string().refine((val) => [1, 2, 3, 4].includes(Number(val)), {
    message: "Geçersiz altın türü",
  }),
  quantity: z.string().refine(
    (val) => {
      const num = parseFloat(parseTurkishNumber(val));
      return !isNaN(num) && num > 0;
    },
    { message: "Miktar pozitif bir sayı olmalıdır" }
  ),
  pricePerUnit: z.string().refine(
    (val) => {
      const num = parseFloat(parseTurkishNumber(val));
      return !isNaN(num) && num > 0;
    },
    { message: "Fiyat pozitif bir sayı olmalıdır" }
  ),
  date: z.string().min(1, "Tarih gereklidir"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const TransactionForm = () => {
  const [open, setOpen] = useState(false);
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const { data: pricesData } = useGetPricesQuery();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "BUY",
      goldType: String(GoldTypeEnum.GRAM),
      quantity: "1",
      pricePerUnit: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedGoldType = form.watch("goldType");
  const transactionType = form.watch("type");

  const handleSetCurrentPrice = () => {
    const goldTypeId = Number(selectedGoldType) as GoldTypeId;
    if (pricesData?.prices && goldTypeId) {
      const price =
        transactionType === "BUY"
          ? pricesData.prices[goldTypeId].buyPrice
          : pricesData.prices[goldTypeId].sellPrice;
      // Format price with Turkish locale
      const formatted = price.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      form.setValue("pricePerUnit", formatted);
    }
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const rawValue = e.target.value;
    const formatted = formatTurkishNumber(rawValue);
    onChange(formatted);
  };

  const handleFormSubmit = async (values: TransactionFormValues) => {
    try {
      await createTransaction({
        type: values.type as TransactionType,
        goldType: Number(values.goldType) as GoldTypeId,
        quantity: parseFloat(parseTurkishNumber(values.quantity)),
        pricePerUnit: parseFloat(parseTurkishNumber(values.pricePerUnit)),
        date: values.date,
      }).unwrap();

      toast.success(values.type === "BUY" ? "Alım işlemi eklendi" : "Satım işlemi eklendi");
      form.reset();
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { error?: string; message?: string } };
      toast.error(err.data?.message || err.data?.error || "İşlem eklenirken hata oluştu");
    }
  };

  const handleFormError = () => {
    const errors = form.formState.errors;
    if (errors.quantity) {
      toast.error(errors.quantity.message || "Geçersiz miktar");
    } else if (errors.pricePerUnit) {
      toast.error(errors.pricePerUnit.message || "Geçersiz fiyat");
    } else if (errors.date) {
      toast.error(errors.date.message || "Geçersiz tarih");
    }
  };

  // Get current price for display
  const selectedGoldTypeId = Number(selectedGoldType) as GoldTypeId;
  const currentPrice = pricesData?.prices?.[selectedGoldTypeId]
    ? transactionType === "BUY"
      ? pricesData.prices[selectedGoldTypeId].buyPrice
      : pricesData.prices[selectedGoldTypeId].sellPrice
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          İşlem Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni İşlem</DialogTitle>
          <DialogDescription>Altın alım veya satım işlemi ekleyin.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşlem Türü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="İşlem türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BUY">Alım</SelectItem>
                      <SelectItem value="SELL">Satım</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goldType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altın Türü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Altın türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GOLD_TYPE_LIST.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miktar</FormLabel>
                  <FormControl>
                    <Input type="text" inputMode="decimal" placeholder="Örn: 5" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Birim Fiyat (TL)</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleSetCurrentPrice}
                      className="h-auto p-0 text-xs"
                    >
                      Güncel fiyatı kullan
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Örn: 7.000,00"
                      value={field.value}
                      onChange={(e) => handlePriceChange(e, field.onChange)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  {currentPrice && (
                    <p className="text-muted-foreground text-xs">
                      Güncel {transactionType === "BUY" ? "alış" : "satış"}:{" "}
                      {formatCurrency(currentPrice)}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşlem Tarihi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ekleniyor..." : "Ekle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
