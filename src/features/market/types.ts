// Gold Type Enum - Integer-based
export const GoldTypeEnum = {
  GRAM: 1,
  CEYREK: 2,
  YARIM: 3,
  CUMHURIYET: 4,
} as const;

export type GoldTypeId = (typeof GoldTypeEnum)[keyof typeof GoldTypeEnum]; // 1 | 2 | 3 | 4

// Gold type metadata for UI
export const GOLD_TYPES: Record<GoldTypeId, { id: GoldTypeId; name: string; code: string }> = {
  [GoldTypeEnum.GRAM]: { id: GoldTypeEnum.GRAM, name: "Gram Altın", code: "gram" },
  [GoldTypeEnum.CEYREK]: { id: GoldTypeEnum.CEYREK, name: "Çeyrek Altın", code: "ceyrek" },
  [GoldTypeEnum.YARIM]: { id: GoldTypeEnum.YARIM, name: "Yarım Altın", code: "yarim" },
  [GoldTypeEnum.CUMHURIYET]: { id: GoldTypeEnum.CUMHURIYET, name: "Cumhuriyet Altını", code: "cumhuriyet" },
};

export const GOLD_TYPE_LIST = Object.values(GOLD_TYPES);

export interface GoldPrice {
  id: GoldTypeId;
  name: string; // Display name (Turkish)
  buyPrice: number; // Alış fiyatı (TL)
  sellPrice: number; // Satış fiyatı (TL)
  dailyChangePercent?: number; // Günlük değişim yüzdesi (%)
}

export type GoldPricesMap = Record<GoldTypeId, GoldPrice>;

export interface GoldPricesResponse {
  success: boolean;
  data: {
    prices: GoldPricesMap;
    lastUpdated: string;
  };
}
