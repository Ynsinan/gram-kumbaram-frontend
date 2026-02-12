import type { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = env.FRONTEND_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
};

export default sitemap;
