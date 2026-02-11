"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/use-auth";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { LoginButton } from "@/features/auth/components/login-button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./button";
import { Skeleton } from "./skeleton";

export const Header = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderAuthSection = () => {
    // Early return for loading/unmounted state
    if (!mounted || isLoading) {
      return <Skeleton className="h-9 w-9 rounded-full" aria-label="Yükleniyor" />;
    }

    // Early return for authenticated state
    if (isAuthenticated) {
      return <UserMenu />;
    }

    return <LoginButton variant="outline" size="sm" />;
  };

  return (
    <header
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={PAGE_URLS.HOME}
          className="text-xl font-bold transition-opacity hover:opacity-80"
          aria-label="Ana sayfa - Gram Kumbaram"
        >
          <span className="gold-shimmer">Gram</span>
          <span className="ml-1">Kumbaram</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Ana navigasyon">
          {mounted && isAuthenticated && (
            <Button variant="ghost" asChild>
              <Link href={PAGE_URLS.DASHBOARD}>Portföy</Link>
            </Button>
          )}
          <ThemeToggle />
          {renderAuthSection()}
        </nav>
      </div>
    </header>
  );
};
