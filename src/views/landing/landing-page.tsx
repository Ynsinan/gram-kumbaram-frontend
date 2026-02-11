"use client";

import { ArrowRight, Shield, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/use-auth";
import { PAGE_URLS } from "@/shared/constants/page-urls";
import { GoldPriceTicker } from "@/features/market/components/gold-price-ticker";
import { ProfitCalculator } from "@/features/calculator/components/profit-calculator";
import { LoginButton } from "@/features/auth/components/login-button";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Live Prices Section */}
      <section className="bg-muted/30 px-4 py-12">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Canlı Altın Fiyatları</h2>
          <GoldPriceTicker compact />
        </div>
      </section>
      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Fiziksel{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Altın
            </span>{" "}
            Yatırımlarınızı
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Takip Edin
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Canlı altın fiyatlarını izleyin, değer hesaplayın ve portföyünüzü kolayca yönetin.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link href={PAGE_URLS.DASHBOARD}>
                  Portföye Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <LoginButton size="lg" />
            )}
            <Button variant="outline" size="lg" asChild>
              <a href={PAGE_URLS.ANCHORS.CALCULATOR}>Hesaplayıcıyı Dene</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="bg-muted/30 px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            Altın Değer Hesaplayıcı
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-center">
            Altın türü ve miktara göre güncel alış/satış değerlerini görün.
          </p>
          <ProfitCalculator />
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Portföyünüzü Yönetmeye Başlayın</h2>
            <p className="text-muted-foreground mb-8">
              Ücretsiz hesap oluşturun ve altın yatırımlarınızı profesyonelce takip edin.
            </p>
            <LoginButton size="lg" />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">Neden Gram Kumbaram?</h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Canlı Fiyat Takibi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gram, çeyrek, yarım ve cumhuriyet altını fiyatlarını anlık olarak takip edin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Wallet className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Portföy Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Alım-satım işlemlerinizi kaydedin, FIFO yöntemi ile kar/zarar hesaplayın.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Güvenli Giriş</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Google hesabınızla güvenli bir şekilde giriş yapın, verileriniz güvende.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="mt-auto border-t px-4 py-6">
        <div className="text-muted-foreground container mx-auto text-center text-sm">
          <p>© 2026 Gram Kumbaram. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};
