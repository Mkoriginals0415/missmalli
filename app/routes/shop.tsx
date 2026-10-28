import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { SlidersHorizontal, ArrowUpDown, Sparkles, X, Check } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { getAllProducts } from "~/db/d1.server";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  return json({ products });
}

export default function ShopGridPage() {
  const { products } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSaved, toggleSave } = useSavedSarees();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const fabrics = ["all", "Silk", "Cotton", "Tussar"];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Fabric filter
    if (selectedFabric !== "all") {
      result = result.filter((p) => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => (v.stockCount || 0) > 0));
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedFabric, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-3 space-y-4">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
              All Sarees
            </h1>
            <p className="text-xs text-brand-dark/60">
              {filteredProducts.length} {filteredProducts.length === 1 ? "saree" : "sarees"} · tap one to open in feed
            </p>
          </div>

          <Link
            to="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feed View</span>
          </Link>
        </div>

        {/* Filter and Sort Chips (Screen 6 / 7) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedFabric !== "all" || inStockOnly
                ? "bg-brand-purple text-white border-brand-purple"
                : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter {selectedFabric !== "all" ? `(${selectedFabric})` : ""}</span>
          </button>

          <button
            onClick={() => {
              if (sortBy === "featured") setSortBy("price-asc");
              else if (sortBy === "price-asc") setSortBy("price-desc");
              else setSortBy("featured");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-brand-lavender/40 hover:bg-brand-ivory transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-purple" />
            <span>
              {sortBy === "featured" ? "Featured" : sortBy === "price-asc" ? "Price: Low to High" : "Price: High to Low"}
            </span>
          </button>

          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              inStockOnly
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
            }`}
          >
            In stock only
          </button>
        </div>

        {/* Saree Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {filteredProducts.map((saree) => (
            <div
              key={saree.id}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-lavender/20 shadow-sm flex flex-col justify-between"
            >
              {/* Image & Feed trigger */}
              <Link
                to={`/feed`}
                className="relative aspect-[3/4] bg-brand-ivory overflow-hidden block"
              >
                <img
                  src={saree.images[0]}
                  alt={saree.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSave(saree.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/70 transition"
                  aria-label="Save saree"
                >
                  <svg
                    className={`w-4 h-4 ${isSaved(saree.id) ? "fill-brand-rose stroke-brand-rose" : "stroke-white fill-none"}`}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-sm">
                  In stock
                </div>
              </Link>

              {/* Title & Price */}
              <div className="p-3">
                <Link to={`/p/${saree.slug}`} className="hover:text-brand-purple">
                  <h3 className="font-serif text-xs sm:text-sm font-semibold text-brand-dark line-clamp-1">
                    {saree.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs sm:text-sm font-bold text-brand-plum">
                    ₹ {saree.price.toLocaleString("en-IN")}
                  </span>
                  <Link
                    to={`/p/${saree.slug}`}
                    className="text-[11px] font-semibold text-brand-purple hover:underline"
                  >
                    Buy now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Screen 7: Filter Sheet Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-warmWhite rounded-t-3xl p-6 shadow-2xl border-t border-brand-lavender/30">
            <div className="flex items-center justify-between pb-4 border-b border-brand-lavender/20">
              <h3 className="font-serif text-lg font-bold text-brand-plum">Filter Sarees</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1 rounded-full text-brand-dark/50 hover:text-brand-purple"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold block mb-2">
                  Fabric
                </label>
                <div className="flex flex-wrap gap-2">
                  {fabrics.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFabric(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition ${
                        selectedFabric === f
                          ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                          : "bg-white text-brand-dark/80 border-brand-lavender/40"
                      }`}
                    >
                      {f === "all" ? "All Fabrics" : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-brand-lavender/20">
                <div>
                  <span className="text-sm font-semibold text-brand-dark block">In stock only</span>
                  <span className="text-xs text-brand-dark/60">Hide sold-out items</span>
                </div>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-5 h-5 accent-brand-purple rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-brand-lavender/20">
              <button
                onClick={() => {
                  setSelectedFabric("all");
                  setInStockOnly(false);
                }}
                className="px-5 py-3 rounded-full border border-brand-lavender/50 text-xs font-semibold text-brand-dark/70 hover:bg-brand-ivory"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
              >
                Show {filteredProducts.length} Sarees
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
