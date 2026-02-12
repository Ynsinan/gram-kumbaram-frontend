import type { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/callback", "/dashboard"],
    },
  ],
  sitemap: `${env.FRONTEND_URL}/sitemap.xml`,
});

export default robots;
