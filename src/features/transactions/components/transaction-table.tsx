"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGetTransactionsQuery, useDeleteTransactionMutation } from "../transactions-api";
import { GOLD_TYPES, GoldTypeEnum } from "@/features/market/types";
import { cn, formatCurrency, formatShortDate, formatNumber } from "@/shared/utils/helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

export const TransactionTable = () => {
  const { data: transactions, isLoading, error } = useGetTransactionsQuery();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Bu işlemi silmek istediğinize emin misiniz?")) return;

    try {
      await deleteTransaction(id).unwrap();
      toast.success("İşlem silindi");
    } catch {
      toast.error("İşlem silinirken hata oluştu");
    }
  };

  // Early return for loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" role="status" aria-label="Yükleniyor">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Early return for error state
  if (error || !transactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center" role="alert">
            İşlem geçmişi yüklenemedi
          </p>
        </CardContent>
      </Card>
    );
  }

  // Early return for empty state
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">Henüz işlem bulunmuyor.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>İşlem Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table aria-label="İşlem geçmişi tablosu">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Tarih</TableHead>
              <TableHead scope="col">Tür</TableHead>
              <TableHead scope="col">Altın</TableHead>
              <TableHead scope="col" className="text-right">
                Miktar
              </TableHead>
              <TableHead scope="col" className="text-right">
                Birim Fiyat
              </TableHead>
              <TableHead scope="col" className="text-right">
                Toplam
              </TableHead>
              <TableHead scope="col" className="text-right">
                İşlem
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const goldTypeInfo = GOLD_TYPES[tx.goldType];
              const total = tx.quantity * tx.pricePerUnit;
              const isBuy = tx.type === "BUY";
              const transactionTypeLabel = isBuy ? "Alım" : "Satım";

              return (
                <TableRow key={tx.id}>
                  <TableCell>{formatShortDate(tx.transactionDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={isBuy ? "default" : "secondary"}
                      className={cn(
                        isBuy
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      )}
                      aria-label={`İşlem türü: ${transactionTypeLabel}`}
                    >
                      {transactionTypeLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{goldTypeInfo?.name || tx.goldType}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(tx.quantity, tx.goldType === GoldTypeEnum.GRAM ? 2 : 0)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(tx.pricePerUnit)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tx.id)}
                      disabled={isDeleting}
                      aria-label={`${goldTypeInfo?.name || tx.goldType} işlemini sil`}
                    >
                      <Trash2 className="text-destructive h-4 w-4" aria-hidden="true" />
                    </Button>
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
