import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";
import { env } from "@/shared/config/env";

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_URL,
  timeout: env.API_TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Prices", "Transactions", "Portfolio", "Holdings"],
  endpoints: () => ({}),
});
