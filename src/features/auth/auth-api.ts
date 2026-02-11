import { baseApi } from "@/shared/api/base-api";
import { API_AUTH } from "@/shared/constants/api-urls";
import type { AuthMeResponse, User } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetMeQuery, useLazyGetMeQuery } = authApi;
