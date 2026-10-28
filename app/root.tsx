import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import stylesheet from "~/styles/app.css?url";

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
  return (
    <html lang="en" className="h-full bg-brand-ivory">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-brand-ivory text-brand-dark">
        {children}
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-brand-ivory">
      <div className="w-16 h-16 rounded-full bg-brand-blush/30 flex items-center justify-center mb-4 text-brand-plum text-2xl font-serif">
        MM
      </div>
      <h1 className="text-2xl font-serif text-brand-plum mb-2">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : "Something went wrong"}
      </h1>
      <p className="text-brand-dark/70 max-w-sm mb-6 text-sm">
        {isRouteErrorResponse(error)
          ? error.data?.message || "The page you're looking for doesn't exist or has moved."
          : "An unexpected error occurred while loading this page."}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-medium hover:bg-brand-plum transition shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}
