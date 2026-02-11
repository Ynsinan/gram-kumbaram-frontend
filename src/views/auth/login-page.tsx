"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { LoginButton } from "@/features/auth/components/login-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

const LoginSkeleton = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      role="status"
      aria-label="Giriş sayfası yükleniyor"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto mt-2 h-5 w-56" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    </div>
  );
};

export const LoginPage = () => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const isAuthChecking = isLoading || !isInitialized;

  useEffect(() => {
    if (!isAuthChecking && isAuthenticated) {
      router.replace(PAGE_URLS.DASHBOARD);
    }
  }, [isAuthenticated, isAuthChecking, router]);

  if (isAuthChecking) {
    return <LoginSkeleton />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4" aria-label="Giriş sayfası">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            <span className="gold-shimmer">Gram</span>
            <span className="ml-1">Kumbaram</span>
          </CardTitle>
          <CardDescription>Altın yatırımlarınızı takip etmek için giriş yapın.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <LoginButton className="w-full" />
          <p className="text-muted-foreground text-center text-xs">
            Giriş yaparak{" "}
            <a
              href="#"
              className="hover:text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Kullanım koşullarını oku"
            >
              kullanım koşullarını
            </a>{" "}
            kabul etmiş olursunuz.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
