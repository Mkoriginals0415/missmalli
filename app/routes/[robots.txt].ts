import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getSeoSettings } from "~/utils/seo.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const seo = await getSeoSettings(env);
  const domain = (seo.canonicalDomain || "https://missmalli.in").replace(/\/+$/, "");

  let content = "";
  if (seo.robotsIndexing === "noindex") {
    content = `User-agent: *
Disallow: /
`;
  } else {
    content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*
Disallow: /bag
Disallow: /track
Disallow: /r/*

Sitemap: ${domain}/sitemap.xml
`;
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
