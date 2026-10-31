import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAllProducts } from "~/db/d1.server";
import { getSeoSettings } from "~/utils/seo.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const [seo, products] = await Promise.all([
    getSeoSettings(env),
    getAllProducts(env),
  ]);

  const domain = (seo.canonicalDomain || "https://missmalli.in").replace(/\/+$/, "");
  const now = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { path: "", changefreq: "daily", priority: "1.0" },
    { path: "/sarees", changefreq: "daily", priority: "0.9" },
    { path: "/dresses", changefreq: "weekly", priority: "0.8" },
    { path: "/exclusive", changefreq: "weekly", priority: "0.8" },
    { path: "/sale", changefreq: "daily", priority: "0.8" },
    { path: "/artisans", changefreq: "monthly", priority: "0.7" },
    { path: "/info", changefreq: "monthly", priority: "0.6" },
  ];

  const productEntries = products
    .filter((p) => p.status === "live")
    .map((product) => {
      return `  <url>
    <loc>${domain}/p/${escapeXml(product.slug)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

  const staticEntries = staticRoutes.map((route) => {
    return `  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join("\n")}
${productEntries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
