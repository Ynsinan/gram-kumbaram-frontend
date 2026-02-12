import type { Metadata } from "next";
import { LoginPage } from "@/views/auth/login-page";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description:
    "Google hesabınızla Gram Kumbaram'a giriş yapın. Altın portföyünüzü yönetin, işlemlerinizi takip edin.",
  openGraph: {
    title: "Giriş Yap | Gram Kumbaram",
    description:
      "Google hesabınızla giriş yapın ve altın yatırımlarınızı takip etmeye başlayın.",
  },
  alternates: {
    canonical: "/auth/login",
  },
};

export default function Login() {
  return <LoginPage />;
}
