import type { MetadataRoute } from "next";

function siteUrl() {
  return "https://missedcallquotes.com";
}

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/onboarding", "/auth/", "/api/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
