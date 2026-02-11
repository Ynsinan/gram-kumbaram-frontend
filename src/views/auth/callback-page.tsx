"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setToken, setCredentials } from "@/features/auth/auth-slice";
import { useLazyGetMeQuery } from "@/features/auth/auth-api";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const tokenFromQuery = searchParams.get("token");
      const tokenFromHash =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token")
          : null;
      const token = tokenFromQuery || tokenFromHash;
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(errorParam);
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 3000);
        return;
      }

      if (!token) {
        setError("Token bulunamadı");
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 3000);
        return;
      }

      try {
        // Remove token from URL to reduce accidental sharing / screenshots
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Store token in localStorage AND Redux store
        localStorage.setItem("token", token);
        dispatch(setToken(token));

        // Small delay to ensure token is in store
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Get user data
        const userData = await getMe().unwrap();
        dispatch(setCredentials({ user: userData, token }));

        // Redirect to dashboard
        router.push(PAGE_URLS.DASHBOARD);
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Giriş işlemi başarısız oldu");
        localStorage.removeItem("token");
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, getMe, dispatch]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-2 font-medium">Hata</p>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-muted-foreground mt-4 text-sm">
              Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 pt-6">
          <div className="text-center">
            <p className="mb-2 font-medium">Giriş yapılıyor...</p>
            <p className="text-muted-foreground text-sm">Lütfen bekleyin, yönlendiriliyorsunuz.</p>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
