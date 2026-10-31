import { json, type LinksFunction, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useRouteLoaderData,
  Link,
} from "@remix-run/react";
import stylesheet from "~/styles/app.css?url";
import { getStoreSettings } from "~/db/d1.server";
import { DEFAULT_THEME_COLORS, StoreThemeColors, DEFAULT_NAV_LINKS, NavLinkItem } from "~/db/mock-data";
import { BottomNav } from "~/components/layout/BottomNav";
import { ToastContainer } from "~/components/ui/ToastNotification";
import { getSeoSettings, buildOrganizationSchema, buildWebSiteSchema } from "~/utils/seo.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const [settings, seoSettings] = await Promise.all([
    getStoreSettings(env),
    getSeoSettings(env),
  ]);

  let themeColors: StoreThemeColors = DEFAULT_THEME_COLORS;
  try {
    if (settings.theme_colors) {
      themeColors = { ...DEFAULT_THEME_COLORS, ...JSON.parse(settings.theme_colors) };
    }
  } catch (e) {
    // Fallback to default
  }

  let navLinks: NavLinkItem[] = DEFAULT_NAV_LINKS;
  try {
    if (settings.nav_links) {
      const parsed = JSON.parse(settings.nav_links);
      if (Array.isArray(parsed) && parsed.length > 0) {
        navLinks = parsed;
      }
    }
  } catch (e) {
    // Fallback to default
  }

  const sellerPhone = settings.seller_whatsapp_number || "919876543210";
  const url = new URL(request.url);
  const domain = (seoSettings.canonicalDomain || "https://missmalli.in").replace(/\/+$/, "");
  const canonicalUrl = `${domain}${url.pathname === "/" ? "" : url.pathname}`;

  return json({
    themeColors,
    sellerPhone,
    navLinks,
    seoSettings,
    canonicalUrl,
    orgSchema: buildOrganizationSchema(domain, sellerPhone),
    webSiteSchema: buildWebSiteSchema(domain),
  });
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/brand/favicon.png", type: "image/png" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Miss Malli | Made for Her Moments" },
    { name: "description", content: "Exclusive handpicked Indian sarees, festive collections, and pure silks. Buy directly on WhatsApp." },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
    { property: "og:site_name", content: "Miss Malli" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const themeColors = data?.themeColors || DEFAULT_THEME_COLORS;
  const seo = data?.seoSettings;
  const canonicalUrl = data?.canonicalUrl;
  const orgSchema = data?.orgSchema;
  const webSiteSchema = data?.webSiteSchema;

  const hexToRgb = (hex: string, fallback: string) => {
    const clean = hex?.replace(/^#/, "");
    if (!clean || clean.length !== 6) return fallback;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? fallback : `${r} ${g} ${b}`;
  };

  return (
    <html lang="en" className="h-full bg-brand-ivory">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {seo?.googleSiteVerification && (
          <meta name="google-site-verification" content={seo.googleSiteVerification} />
        )}
        {seo?.bingSiteVerification && (
          <meta name="msvalidate.01" content={seo.bingSiteVerification} />
        )}
        {seo?.robotsIndexing === "noindex" ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}
        <Meta />
        <Links />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-brand-plum: ${themeColors.primaryPlum};
                --color-brand-plum-rgb: ${hexToRgb(themeColors.primaryPlum, "91 42 110")};
                --color-brand-deep-plum: ${themeColors.deepPlum};
                --color-brand-deep-plum-rgb: ${hexToRgb(themeColors.deepPlum, "42 18 53")};
                --color-brand-ivory: ${themeColors.ivoryCanvas};
                --color-brand-ivory-rgb: ${hexToRgb(themeColors.ivoryCanvas, "251 248 242")};
                --color-brand-gold: ${themeColors.accentGold};
                --color-brand-gold-rgb: ${hexToRgb(themeColors.accentGold, "184 146 58")};
                --color-brand-lilac: ${themeColors.accentLilac};
                --color-brand-lilac-rgb: ${hexToRgb(themeColors.accentLilac, "201 182 228")};
                --color-brand-blush: ${themeColors.accentBlush};
                --color-brand-blush-rgb: ${hexToRgb(themeColors.accentBlush, "232 180 196")};
              }
            `,
          }}
        />
        {/* Google Analytics 4 (if configured) */}
        {seo?.ga4MeasurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.ga4MeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seo.ga4MeasurementId}');
                `,
              }}
            />
          </>
        )}
        {/* Structured Data: Organization */}
        {orgSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
        )}
        {/* Structured Data: WebSite */}
        {webSiteSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
          />
        )}
      </head>
      <body className="h-full bg-brand-ivory text-brand-dark overflow-x-hidden antialiased pb-20 lg:pb-0 selection:bg-brand-lilac/30 selection:text-brand-deepPlum">
        <div className="page-enter min-h-full flex flex-col">
          {children}
        </div>
        <ToastContainer />
        <BottomNav />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || "The page you're looking for doesn't exist or has moved.";
  } else if (error && typeof error === "object") {
    message = (error as any).message || (error as any).statusText || (error as any).data || JSON.stringify(error);
  } else if (typeof error === "string") {
    message = error;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-brand-ivory font-sans">
      <div className="w-16 h-16 rounded-full bg-brand-blush/30 flex items-center justify-center mb-4 text-brand-plum text-2xl font-serif">
        MM
      </div>
      <h1 className="text-2xl font-serif text-brand-plum mb-2">
        {title}
      </h1>
      <p className="text-brand-dark/70 max-w-sm mb-6 text-xs leading-relaxed">
        {message}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
          className="px-6 py-2.5 rounded-full border border-brand-purple/40 text-brand-purple text-xs font-semibold hover:bg-brand-purple/5 transition"
        >
          Try Again
        </button>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
