import type { GoldTypeCode } from "@/features/market/types";

export interface PortfolioAsset {
  goldType: GoldTypeCode;
  netQuantity: number;
  averageCost: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  unrealizedProfitLoss: number;
  realizedProfit: number;
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  totalCost: number;
  totalUnrealizedProfitLoss: number;
  totalRealizedProfit: number;
  assets: PortfolioAsset[];
}

export interface PortfolioResponse {
  success: boolean;
  data: PortfolioSummary;
}
