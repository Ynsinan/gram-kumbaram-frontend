import { baseApi } from "@/shared/api/base-api";
import { API_PRICES } from "@/shared/constants/api-urls";
import type { GoldPricesMap, GoldPricesResponse, GoldPrice, GoldTypeId } from "./types";

export const pricesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrices: builder.query<
      { prices: GoldPricesMap; lastUpdated: string },
      { refresh?: boolean } | void
    >({
      query: (params) => ({
        url: API_PRICES.BASE,
        params: params ? { refresh: params.refresh } : undefined,
      }),
      transformResponse: (response: GoldPricesResponse) => response.data,
      providesTags: ["Prices"],
    }),
    getPriceByType: builder.query<GoldPrice, GoldTypeId>({
      query: (goldType) => API_PRICES.BY_TYPE(goldType),
      transformResponse: (response: { success: boolean; data: GoldPrice }) => response.data,
      providesTags: (_result, _error, goldType) => [{ type: "Prices", id: goldType }],
    }),
  }),
});

export const { useGetPricesQuery, useGetPriceByTypeQuery } = pricesApi;
