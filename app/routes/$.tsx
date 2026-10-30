import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname.includes(".well-known") || url.pathname.endsWith(".json")) {
    return json({ error: "Not found" }, { status: 404 });
  }
  return json({}, { status: 404 });
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-brand-blush/30 flex items-center justify-center mb-4 text-brand-plum text-xl font-serif">
          MM
        </div>
        <h1 className="text-4xl font-serif font-bold text-brand-deepPlum mb-2">404</h1>
        <p className="text-sm text-brand-deepPlum/70 mb-6">The page you requested could not be found or has moved.</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
        >
          Return to Store
        </Link>
      </main>
      <Footer />
    </div>
  );
}
