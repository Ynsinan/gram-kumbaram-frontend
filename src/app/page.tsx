import type { Metadata } from "next";
import { LandingPage } from "@/views/landing/landing-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <LandingPage />;
}
