import { baseApi } from "@/shared/api/base-api";
import { API_TRANSACTIONS } from "@/shared/constants/api-urls";
import type {
  GoldTransaction,
  CreateTransactionDto,
  TransactionListResponse,
  TransactionResponse,
  HoldingsResponse,
} from "./types";
import type { GoldTypeCode } from "@/features/market/types";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<GoldTransaction[], void>({
      query: () => API_TRANSACTIONS.BASE,
      transformResponse: (response: TransactionListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Transactions" as const, id })),
              { type: "Transactions", id: "LIST" },
            ]
          : [{ type: "Transactions", id: "LIST" }],
    }),
    getTransaction: builder.query<GoldTransaction, string>({
      query: (id) => API_TRANSACTIONS.BY_ID(id),
      transformResponse: (response: TransactionResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Transactions", id }],
    }),
    getHoldings: builder.query<Record<GoldTypeCode, number>, void>({
      query: () => API_TRANSACTIONS.HOLDINGS,
      transformResponse: (response: HoldingsResponse) => response.data,
      providesTags: ["Holdings"],
    }),
    createTransaction: builder.mutation<GoldTransaction, CreateTransactionDto>({
      query: (body) => ({
        url: API_TRANSACTIONS.BASE,
        method: "POST",
        body,
      }),
      transformResponse: (response: TransactionResponse) => response.data,
      invalidatesTags: [{ type: "Transactions", id: "LIST" }, "Holdings", "Portfolio"],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: API_TRANSACTIONS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Transactions", id: "LIST" }, "Holdings", "Portfolio"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetHoldingsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
