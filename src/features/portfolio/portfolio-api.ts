import { baseApi } from "@/shared/api/base-api";
import { API_PORTFOLIO } from "@/shared/constants/api-urls";
import type { PortfolioSummary, PortfolioResponse } from "./types";

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolio: builder.query<PortfolioSummary, void>({
      query: () => API_PORTFOLIO.BASE,
      transformResponse: (response: PortfolioResponse) => response.data,
      providesTags: ["Portfolio"],
    }),
  }),
});

export const { useGetPortfolioQuery } = portfolioApi;
