"use client";

import { Suspense } from "react";
import { CallbackPage } from "@/views/auth/callback-page";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";

const CallbackLoading = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <Card className="w-full max-w-md">
      <CardContent className="space-y-4 pt-6">
        <Skeleton className="mx-auto h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mx-auto h-4 w-3/4" />
      </CardContent>
    </Card>
  </div>
);

export default function AuthCallback() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackPage />
    </Suspense>
  );
}
