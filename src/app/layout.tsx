import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/store/store-provider";
import { Header } from "@/shared/ui/header";
import { Toaster } from "@/shared/ui/sonner";
import { validateEnv, logEnvConfig } from "@/shared/config/env";
import "./globals.css";

// Validate environment variables on app initialization
validateEnv();

// Log environment configuration in development
if (process.env.NODE_ENV === "development") {
  logEnvConfig();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gram Kumbaram - Fiziksel Altın Takip Uygulaması",
  description:
    "Fiziksel altın yatırımlarınızı takip edin, canlı fiyatları izleyin ve kar/zarar hesaplayın. Gram, çeyrek, yarım ve cumhuriyet altını portföy yönetimi.",
  keywords: ["altın", "yatırım", "portföy", "gram altın", "çeyrek altın", "kumbara", "altın takip"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
