import type { MetadataRoute } from "next";

function siteUrl() {
  return "https://missedcallquotes.com";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  return [
    { url: origin, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
