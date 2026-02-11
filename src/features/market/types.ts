// Gold Types based on backend schema
export type GoldTypeCode = "gram" | "ceyrek" | "yarim" | "cumhuriyet";

export interface GoldPrice {
  id: number; // 1, 2, 3, or 4
  name: string; // Display name (Turkish)
  buyPrice: number; // Alış fiyatı (TL)
  sellPrice: number; // Satış fiyatı (TL)
}

export interface GoldPricesMap {
  gram: GoldPrice;
  ceyrek: GoldPrice;
  yarim: GoldPrice;
  cumhuriyet: GoldPrice;
}

export interface GoldPricesResponse {
  success: boolean;
  data: {
    prices: GoldPricesMap;
    lastUpdated: string;
  };
}

// Gold type metadata for UI
export const GOLD_TYPES: Record<GoldTypeCode, { id: number; name: string; code: GoldTypeCode }> = {
  gram: { id: 1, name: "Gram Altın", code: "gram" },
  ceyrek: { id: 2, name: "Çeyrek Altın", code: "ceyrek" },
  yarim: { id: 3, name: "Yarım Altın", code: "yarim" },
  cumhuriyet: { id: 4, name: "Cumhuriyet Altını", code: "cumhuriyet" },
};

export const GOLD_TYPE_LIST = Object.values(GOLD_TYPES);
