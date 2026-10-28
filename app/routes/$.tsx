import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname.includes(".well-known") || url.pathname.endsWith(".json")) {
    return json({ error: "Not found" }, { status: 404 });
  }
  return json({}, { status: 404 });
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-serif font-bold text-brand-plum mb-2">404</h1>
        <p className="text-sm text-brand-dark/70 mb-6">The page you requested could not be found.</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
        >
          Return to Store
        </Link>
      </main>
      <BottomNav />
    </div>
  );
}
