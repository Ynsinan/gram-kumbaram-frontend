"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const DashboardSkeleton = () => {
  return (
    <div
      className="container mx-auto space-y-8 py-6"
      role="status"
      aria-label="Dashboard yükleniyor"
    >
      {/* Welcome Section Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 md:h-9" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Portfolio Summary Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-28" />
                <Skeleton className="mt-1 h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Prices Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tables Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const isAuthChecking = isLoading || !isInitialized;

  useEffect(() => {
    if (!isAuthChecking && !isAuthenticated) {
      router.push(PAGE_URLS.AUTH.LOGIN);
    }
  }, [isAuthenticated, isAuthChecking, router]);

  if (isAuthChecking) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
