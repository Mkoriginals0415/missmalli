import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { Heart } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { INITIAL_PRODUCTS } from "~/db/mock-data";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");

  let list = [...INITIAL_PRODUCTS];
  if (collection) {
    list = list.filter((p) => p.collectionSlug === collection);
  }

  return json({ products: list });
}

export default function SareesListingPage() {
  const { products } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { isSaved, toggleSave } = useSavedSarees();

  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const fabrics = ["all", "Silk", "Cotton", "Georgette", "Linen"];
  const occasions = ["all", "Wedding", "Festive", "Daily"];

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedFabric !== "all") {
      result = result.filter((p) => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
    }

    if (selectedOccasion !== "all") {
      result = result.filter((p) => p.occasion === selectedOccasion);
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedFabric, selectedOccasion, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="text-xs text-brand-deepPlum/70 mb-2 flex items-center gap-1.5 font-medium">
            <Link to="/" className="hover:text-brand-plum">Home</Link>
            <span>/</span>
            <span className="text-brand-deepPlum font-bold">Sarees</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-deepPlum">
                Sarees
              </h1>
              <p className="text-xs text-brand-deepPlum/70 mt-0.5 font-medium">
                {filtered.length} designs crafted by master weavers
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-brand-deepPlum font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2 rounded-full bg-white border border-brand-deepPlum/30 text-xs font-bold text-brand-deepPlum focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar Filter (Page 02) */}
          <aside className="bg-white rounded-[22px] p-6 border border-brand-lilac/40 shadow-sm space-y-6">
            <h3 className="font-bold text-sm tracking-wider uppercase text-brand-deepPlum">
              Filters
            </h3>

            {/* Fabric Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum block">
                Fabric
              </label>
              <div className="flex flex-wrap gap-2">
                {fabrics.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFabric(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                      selectedFabric === f
                        ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                        : "bg-brand-ivory text-brand-deepPlum border-brand-lilac/50 hover:bg-white"
                    }`}
                  >
                    {f === "all" ? "All Fabrics" : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-brand-deepPlum">
                <span>Price</span>
                <span>Up to ₹ {maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-plum cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-brand-deepPlum/70 font-semibold">
                <span>₹ 1,000</span>
                <span>₹ 15,000</span>
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum block">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                      selectedOccasion === occ
                        ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                        : "bg-brand-ivory text-brand-deepPlum border-brand-lilac/50 hover:bg-white"
                    }`}
                  >
                    {occ === "all" ? "All Occasions" : occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedFabric("all");
                setSelectedOccasion("all");
                setMaxPrice(15000);
              }}
              className="w-full py-2.5 rounded-full border border-brand-deepPlum/30 text-xs font-bold text-brand-deepPlum hover:bg-brand-ivory transition"
            >
              Reset Filters
            </button>
          </aside>

          {/* Right Saree Grid (Cards are 100% clickable directly to Product Detail) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  to={`/p/${product.slug}`}
                  className="group bg-white rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[3/4] bg-brand-lilac/10 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Badge (NO highlighted product ID overlay per user request) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-deepPlum text-white text-[10px] font-bold shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist toggle */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSave(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-brand-deepPlum hover:text-brand-plum transition shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved(product.id) ? "fill-brand-plum text-brand-plum" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-sans text-xs sm:text-sm font-bold text-brand-deepPlum line-clamp-1 group-hover:text-brand-plum transition">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-brand-deepPlum/70 font-medium">{product.fabric}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-brand-deepPlum">
                          ₹ {product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-brand-deepPlum/50 line-through">
                            ₹ {product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-brand-plum group-hover:underline">
                        Buy Now →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => alert("All available handloom drapes loaded!")}
                className="px-8 py-3 rounded-full border border-brand-deepPlum text-brand-deepPlum text-xs font-bold hover:bg-brand-deepPlum hover:text-white transition shadow-sm"
              >
                Load more
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
