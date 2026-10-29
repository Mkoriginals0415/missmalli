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
import { DEFAULT_THEME_COLORS, StoreThemeColors } from "~/db/mock-data";
import { BottomNav } from "~/components/layout/BottomNav";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);
  let themeColors: StoreThemeColors = DEFAULT_THEME_COLORS;

  try {
    if (settings.theme_colors) {
      themeColors = { ...DEFAULT_THEME_COLORS, ...JSON.parse(settings.theme_colors) };
    }
  } catch (e) {
    // Fallback to default
  }

  return json({ themeColors });
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

  return (
    <html lang="en" className="h-full bg-brand-ivory">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-brand-plum: ${themeColors.primaryPlum};
                --color-brand-deep-plum: ${themeColors.deepPlum};
                --color-brand-ivory: ${themeColors.ivoryCanvas};
                --color-brand-gold: ${themeColors.accentGold};
                --color-brand-lilac: ${themeColors.accentLilac};
                --color-brand-blush: ${themeColors.accentBlush};
              }
            `,
          }}
        />
      </head>
      <body className="h-full bg-brand-ivory text-brand-dark overflow-x-hidden antialiased pb-16 lg:pb-0 selection:bg-brand-lilac/30 selection:text-brand-deepPlum">
        {children}
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
