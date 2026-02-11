import type { GoldTypeId } from "@/features/market/types";

export type TransactionType = "BUY" | "SELL";

export interface GoldTransaction {
  id: string; // UUID
  userId: string;
  type: TransactionType;
  goldType: GoldTypeId;
  quantity: number; // Always positive
  pricePerUnit: number; // Price at transaction time (TL)
  transactionDate: string;
  createdAt: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  goldType: GoldTypeId;
  quantity: number;
  pricePerUnit: number;
  date: string; // YYYY-MM-DD
}

export interface TransactionListResponse {
  success: boolean;
  data: GoldTransaction[];
}

export interface TransactionResponse {
  success: boolean;
  data: GoldTransaction;
}

export interface HoldingsResponse {
  success: boolean;
  data: Record<GoldTypeId, number>;
}
