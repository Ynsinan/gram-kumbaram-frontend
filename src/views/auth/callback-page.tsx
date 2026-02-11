"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/auth-slice";
import { useExchangeCodeMutation } from "@/features/auth/auth-api";
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
    code_not_found: { title: "Giriş hatası", description: "Authorization code bulunamadı." },
  };

  return errorMap[error] || { title: "Bir hata oluştu", description: error };
};

export const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [exchangeCode] = useExchangeCodeMutation();
  const [hasError, setHasError] = useState(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setHasError(true);
        const { title, description } = getErrorMessage(errorParam);
        toast.error(title, { description });
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 2000);
        return;
      }

      if (!code) {
        setHasError(true);
        const { title, description } = getErrorMessage("code_not_found");
        toast.error(title, { description });
        setTimeout(() => router.push(PAGE_URLS.AUTH.LOGIN), 2000);
        return;
      }

      try {
        // Remove code from URL immediately
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Exchange authorization code for token
        const response = await exchangeCode({ code }).unwrap();

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Store credentials in Redux
        dispatch(
          setCredentials({
            user: {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
            },
            token: response.data.token,
          })
        );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
