import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/store/store-provider";
import { Header } from "@/shared/ui/header";
import { Toaster } from "@/shared/ui/sonner";
import { validateEnv, logEnvConfig, env } from "@/shared/config/env";
import { SEO } from "@/shared/constants/seo";
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
  metadataBase: new URL(env.FRONTEND_URL),
  title: {
    default: SEO.DEFAULT_TITLE,
    template: SEO.SITE_TITLE_TEMPLATE,
  },
  description: SEO.DEFAULT_DESCRIPTION,
  keywords: SEO.KEYWORDS,
  authors: [{ name: SEO.SITE_NAME }],
  creator: SEO.SITE_NAME,
  publisher: SEO.SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SEO.LOCALE,
    siteName: SEO.SITE_NAME,
    title: SEO.DEFAULT_TITLE,
    description: SEO.DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.DEFAULT_TITLE,
    description: SEO.DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: SEO.BACKGROUND_COLOR },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
