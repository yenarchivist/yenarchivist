const BASE = "https://studio.yenament.com";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/dingu`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/yenarity`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/myrepo`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/goodrepo`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];
}
