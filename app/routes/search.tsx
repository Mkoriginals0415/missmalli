import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Search as SearchIcon, X, Eye } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { QuickViewModal } from "~/components/product/QuickViewModal";
import { SeedProduct } from "~/db/mock-data";
import { getAllProducts } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  return json({ products });
}

export default function SearchPage() {
  const { products } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<SeedProduct | null>(null);

  const popularTags = ["Rani Pink", "Banarasi", "Kanjivaram", "Tissue", "Georgette", "Wedding"];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <div className="space-y-4 text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-deepPlum">
            Search Our Collection
          </h1>
          <div className="relative flex items-center">
            <SearchIcon className="w-5 h-5 text-brand-deepPlum/40 absolute left-4 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by saree name, fabric, or product ID (#MM-SK01)..."
              className="w-full pl-12 pr-10 py-3.5 bg-white rounded-full text-sm text-brand-deepPlum placeholder:text-brand-deepPlum/40 border border-brand-lilac/40 focus:outline-none focus:border-brand-plum shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 p-1 text-brand-deepPlum/40 hover:text-brand-deepPlum"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!query ? (
          <div className="text-center space-y-4 pt-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-deepPlum/50 block">
              Popular Searches
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 rounded-full bg-white border border-brand-lilac/40 text-xs font-medium text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-xs text-brand-deepPlum/60 block">
              {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for "{query}"
            </span>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center text-xs text-brand-deepPlum/60 bg-white rounded-[28px] border border-brand-lilac/30 p-8">
                No matching drapes found. Try searching for "Kanjivaram", "Tissue", or "Pink".
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-[2/3] bg-brand-ivory/60 overflow-hidden">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-top" />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-brand-deepPlum text-white text-[9px] font-bold">
                        #{product.code}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <Link to={`/p/${product.slug}`} className="hover:text-brand-plum">
                        <h3 className="font-bold text-xs sm:text-sm text-brand-deepPlum truncate">{product.name}</h3>
                      </Link>
                      <p className="text-[11px] text-brand-deepPlum/60">{product.fabric}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs sm:text-sm font-bold text-brand-deepPlum">₹ {product.price.toLocaleString("en-IN")}</span>
                        <Link to={`/p/${product.slug}`} className="text-[11px] font-bold text-brand-plum hover:underline">
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
