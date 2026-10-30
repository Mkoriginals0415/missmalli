import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { Heart, Check, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { getAllProducts } from "~/db/d1.server";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const filter = url.searchParams.get("filter");

  let list = await getAllProducts(env);
  let categoryTitle = "Sarees";
  let categorySubtitle = "Handcrafted pure silk, tissue and georgette drapes";
  let breadcrumbName = "Sarees";

  if (collection === "dresses") {
    categoryTitle = "Dresses";
    breadcrumbName = "Dresses";
    categorySubtitle = "Contemporary festive dresses and elegant handwoven silhouettes";
    list = list.filter((p) => p.collectionSlug === "dresses");
  } else if (collection === "materials") {
    categoryTitle = "Dress Materials";
    breadcrumbName = "Dress Materials";
    categorySubtitle = "Unstitched handloom fabrics and pure silk suit sets";
    list = list.filter((p) => p.collectionSlug === "materials");
  } else if (collection === "exclusive") {
    categoryTitle = "Exclusive Edit";
    breadcrumbName = "Exclusive";
    categorySubtitle = "Heirloom bridal weaves and master artisan limited editions";
    list = list.filter((p) => p.collectionSlug === "exclusive");
  } else if (filter === "sale") {
    categoryTitle = "Festive Sale · Flat 30% Off";
    breadcrumbName = "Sale";
    categorySubtitle = "Special festive markdowns on handwoven silk sarees";
    list = list.filter((p) => p.discount || p.originalPrice);
  } else if (collection) {
    categoryTitle = collection.charAt(0).toUpperCase() + collection.slice(1);
    breadcrumbName = categoryTitle;
    list = list.filter((p) => p.collectionSlug === collection);
  }

  return json({
    products: list,
    categoryTitle,
    categorySubtitle,
    breadcrumbName,
  });
}

export default function SareesListingPage() {
  const { products, categoryTitle, categorySubtitle, breadcrumbName } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { isSaved, toggleSave } = useSavedSarees();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleToggleSave = (productId: number, productName: string) => {
    toggleSave(productId);
    const wasSaved = isSaved(productId);
    setToastMessage(wasSaved ? `Removed "${productName}" from Wishlist` : `Saved "${productName}" to Wishlist`);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const fabrics = ["all", "Silk", "Cotton", "Georgette", "Linen"];
  const occasions = ["all", "Wedding", "Festive", "Daily"];

  // Count active non-default filters
  const activeFilterCount = (selectedFabric !== "all" ? 1 : 0) + (selectedOccasion !== "all" ? 1 : 0) + (maxPrice < 15000 ? 1 : 0);

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

  const resetAllFilters = () => {
    setSelectedFabric("all");
    setSelectedOccasion("all");
    setMaxPrice(15000);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="text-xs text-brand-deepPlum/70 mb-1.5 flex items-center gap-1.5 font-medium">
            <Link to="/" className="hover:text-brand-plum">Home</Link>
            <span>/</span>
            <span className="text-brand-deepPlum font-bold">{breadcrumbName}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-brand-deepPlum">
                {categoryTitle}
              </h1>
              <p className="text-xs text-brand-deepPlum/70 mt-0.5 font-medium">
                {filtered.length} authentic designs available · {categorySubtitle}
              </p>
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden sm:flex items-center gap-2">
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

        {/* -------------------------------------------------------------
            MOBILE FILTER BAR: Quick Swipe Fabric Chips + Filter Trigger
           ------------------------------------------------------------- */}
        <div className="lg:hidden space-y-3">
          {/* Quick fabric pill horizontal slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            {fabrics.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFabric(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition min-h-[38px] ${
                  selectedFabric === f
                    ? "bg-brand-deepPlum text-white shadow-xs"
                    : "bg-white text-brand-deepPlum border border-brand-deepPlum/15 hover:bg-brand-lilac/10"
                }`}
              >
                {f === "all" ? "All Sarees" : f}
              </button>
            ))}
          </div>

          {/* Mobile Filter & Sort Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum shadow-2xs min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-plum" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none py-2.5 px-4 pr-8 rounded-xl bg-white border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum shadow-2xs min-h-[44px] focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Sort: Low to High</option>
                <option value="price-desc">Sort: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-brand-deepPlum/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout Grid: Desktop Left Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar Filter (Desktop only: hidden lg:block) */}
          <aside className="hidden lg:block bg-white rounded-[24px] p-6 border border-brand-lilac/40 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wider uppercase text-brand-deepPlum">
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-brand-plum font-bold hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

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
              onClick={resetAllFilters}
              className="w-full py-2.5 rounded-full border border-brand-deepPlum/30 text-xs font-bold text-brand-deepPlum hover:bg-brand-ivory transition"
            >
              Reset Filters
            </button>
          </aside>

          {/* Right Saree Grid (Cards are 100% clickable directly to Product Detail) */}
          <div className="lg:col-span-3 space-y-8">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[24px] border border-brand-lilac/30 p-8 space-y-3">
                <p className="text-sm font-bold text-brand-deepPlum">No sarees match your selected filters</p>
                <p className="text-xs text-brand-deepPlum/70">Try resetting price or selecting all fabrics.</p>
                <button
                  onClick={resetAllFilters}
                  className="mt-2 px-5 py-2 rounded-full bg-brand-deepPlum text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/p/${product.slug}`}
                    className="group bg-white rounded-[18px] sm:rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    {/* Photo container - 2:3 vertical portrait with object-top */}
                    <div className="relative aspect-[2/3] bg-brand-ivory/60 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />

                      {/* Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {product.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-deepPlum text-white text-[9.5px] sm:text-[10px] font-bold shadow-xs">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSave(product.id, product.name);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-brand-deepPlum hover:text-brand-plum transition shadow-xs min-w-[38px] min-h-[38px] flex items-center justify-center"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${isSaved(product.id) ? "fill-brand-plum text-brand-plum" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                      <h3 className="font-sans text-xs sm:text-sm font-bold text-brand-deepPlum line-clamp-1 group-hover:text-brand-plum transition">
                        {product.name}
                      </h3>
                      <p className="text-[10.5px] sm:text-[11px] text-brand-deepPlum/70 font-medium">{product.fabric}</p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm font-bold text-brand-deepPlum">
                            ₹ {product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] sm:text-[11px] text-brand-deepPlum/50 line-through hidden xs:inline">
                              ₹ {product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] font-bold text-brand-plum group-hover:underline">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center pt-2 pb-6">
              <button
                onClick={() => setToastMessage("All master handloom editions are currently loaded")}
                className="px-8 py-3 rounded-full border border-brand-deepPlum text-brand-deepPlum text-xs font-bold hover:bg-brand-deepPlum hover:text-white transition shadow-xs min-h-[44px]"
              >
                Load more designs
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------
          MOBILE FILTER BOTTOM SHEET / DRAWER MODAL
         ------------------------------------------------------------- */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-brand-deepPlum/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-brand-ivory rounded-t-[28px] shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-t border-brand-lilac/40 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-brand-lilac/30 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-plum" />
                <h3 className="font-bold text-sm text-brand-deepPlum uppercase tracking-wider">
                  Filters & Sorting
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 -mr-2 text-brand-deepPlum hover:text-brand-plum rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="p-5 space-y-6 overflow-y-auto">
              {/* Fabric Filter */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum block">
                  Fabric Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {fabrics.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFabric(f)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition min-h-[40px] ${
                        selectedFabric === f
                          ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-xs"
                          : "bg-white text-brand-deepPlum border-brand-lilac/50 hover:bg-brand-ivory"
                      }`}
                    >
                      {f === "all" ? "All Fabrics" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-brand-deepPlum">
                  <span>Price Range</span>
                  <span className="text-brand-plum">Up to ₹ {maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-plum h-2 bg-brand-lilac/30 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-brand-deepPlum/70 font-semibold">
                  <span>₹ 2,000</span>
                  <span>₹ 15,000</span>
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum block">
                  Occasion
                </label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition min-h-[40px] ${
                        selectedOccasion === occ
                          ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-xs"
                          : "bg-white text-brand-deepPlum border-brand-lilac/50 hover:bg-brand-ivory"
                      }`}
                    >
                      {occ === "all" ? "All Occasions" : occ}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-brand-lilac/30 bg-white flex items-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-3 px-4 rounded-full border border-brand-deepPlum/30 text-xs font-bold text-brand-deepPlum hover:bg-brand-ivory transition min-h-[44px]"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md min-h-[44px]"
              >
                Show {filtered.length} Sarees
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-brand-deepPlum text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-brand-lilac/30">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{toastMessage}</span>
            <Link
              to="/wishlist"
              className="ml-2 px-2.5 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-[11px] underline"
            >
              View Wishlist →
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
