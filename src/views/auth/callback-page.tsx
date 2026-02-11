"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setToken, setCredentials } from "@/features/auth/auth-slice";
import { useLazyGetMeQuery } from "@/features/auth/auth-api";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

// Hata mesajlarını kullanıcı dostu metinlere çevir
const getErrorMessage = (error: string): { title: string; description?: string } => {
  const errorMap: Record<string, { title: string; description?: string }> = {
    auth_failed: { title: "Giriş başarısız", description: "Google ile giriş yapılamadı." },
    no_user: { title: "Kullanıcı bulunamadı", description: "Lütfen tekrar deneyin." },
    rate_limit: {
      title: "Çok fazla giriş denemesi",
      description: "Lütfen 1 dakika bekleyip tekrar deneyin.",
    },
    token_not_found: { title: "Giriş hatası", description: "Token bulunamadı." },
  };

  return errorMap[error] || { title: "Bir hata oluştu", description: error };
};

export const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();
  const [hasError, setHasError] = useState(false);

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
        setHasError(true);
        const { title, description } = getErrorMessage(errorParam);
        toast.error(title, { description });
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 2000);
        return;
      }

      if (!token) {
        setHasError(true);
        const { title, description } = getErrorMessage("token_not_found");
        toast.error(title, { description });
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 2000);
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

        // Başarılı giriş bildirimi
        toast.success("Giriş başarılı!", {
          description: "Hoş geldiniz, yönlendiriliyorsunuz...",
        });

        // Redirect to dashboard
        setTimeout(() => router.push(PAGE_URLS.DASHBOARD), 500);
      } catch (err) {
        console.error("Auth callback error:", err);
        setHasError(true);
        toast.error("Giriş işlemi başarısız", {
          description: "Lütfen tekrar deneyin.",
        });
        localStorage.removeItem("token");
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, getMe, dispatch]);

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <p className="mb-2 font-medium">Giriş sayfasına yönlendiriliyorsunuz...</p>
              <p className="text-muted-foreground text-sm">Lütfen bekleyin.</p>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-3/4" />
            </div>
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
