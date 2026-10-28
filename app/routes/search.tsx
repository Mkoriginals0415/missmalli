import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import { getAllProducts } from "~/db/d1.server";
import { BottomNav } from "~/components/layout/BottomNav";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  return json({ products });
}

export default function SearchPage() {
  const { products } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState("");

  const recentSearches = ["green silk", "wedding banarasi", "tussar", "festive gold"];
  const fabrics = ["Silk", "Cotton", "Tussar"];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      {/* Top Search Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-brand-lavender/30 p-3">
        <div className="flex items-center gap-2 max-w-xl mx-auto">
          <Link to="/" className="p-1.5 text-brand-dark/60 hover:text-brand-purple">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 relative flex items-center">
            <SearchIcon className="w-4 h-4 text-brand-dark/40 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, fabrics, colours..."
              className="w-full pl-9 pr-8 py-2.5 bg-brand-ivory rounded-full text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:ring-1 focus:ring-brand-purple"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 p-0.5 text-brand-dark/40 hover:text-brand-dark"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-5">
        {/* If no search typed yet, show Suggestions (Screen 8) */}
        {!query ? (
          <div className="space-y-5">
            {/* Recent Searches */}
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-dark/50 font-bold block mb-2">
                Recent Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-brand-lavender/40 text-xs font-medium text-brand-dark hover:bg-brand-purple hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Fabrics */}
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-dark/50 font-bold block mb-2">
                Browse Fabrics
              </span>
              <div className="flex flex-wrap gap-2">
                {fabrics.map((f) => (
                  <button
                    key={f}
                    onClick={() => setQuery(f)}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-brand-lavender/40 text-xs font-medium text-brand-dark hover:bg-brand-purple hover:text-white transition"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Results */
          <div className="space-y-3">
            <span className="text-xs text-brand-dark/60 block">
              {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for "{query}"
            </span>

            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-brand-dark/60">
                No matching sarees found. Try searching for "Banarasi", "Silk", or "Red".
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((saree) => (
                  <Link
                    key={saree.id}
                    to={`/p/${saree.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-brand-lavender/20 shadow-sm hover:shadow-md transition"
                  >
                    <div className="aspect-[3/4] bg-brand-ivory overflow-hidden">
                      <img src={saree.images[0]} alt={saree.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-xs font-semibold text-brand-dark truncate">{saree.name}</h3>
                      <p className="text-xs font-bold text-brand-plum mt-1">₹ {saree.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
