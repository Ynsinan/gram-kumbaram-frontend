import type { MetadataRoute } from "next";
import { SEO } from "@/shared/constants/seo";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Gram Kumbaram - Fiziksel Altın Takip",
  short_name: "Gram Kumbaram",
  description: SEO.DEFAULT_DESCRIPTION,
  start_url: "/",
  display: "standalone",
  background_color: SEO.BACKGROUND_COLOR,
  theme_color: SEO.THEME_COLOR,
  orientation: "portrait-primary",
  categories: ["finance", "utilities"],
  lang: SEO.LANGUAGE,
  icons: [
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
});

export default manifest;
