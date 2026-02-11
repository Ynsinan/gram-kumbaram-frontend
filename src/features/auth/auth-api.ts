import { baseApi } from "@/shared/api/base-api";
import { API_AUTH } from "@/shared/constants/api-urls";
import type { AuthMeResponse, User } from "./types";

interface ExchangeCodeRequest {
  code: string;
}

interface ExchangeCodeResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exchangeCode: builder.mutation<ExchangeCodeResponse, ExchangeCodeRequest>({
      query: (body) => ({
        url: API_AUTH.EXCHANGE,
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => API_AUTH.ME,
      transformResponse: (response: AuthMeResponse): User => ({
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useExchangeCodeMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
