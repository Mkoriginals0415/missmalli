import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Plus, Search, Minus, Edit, ExternalLink } from "lucide-react";
import { getAllProducts } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  return json({ products });
}

export default function AdminProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  const [productList, setProductList] = useState(products);
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");

  const handleStockChange = (productId: number, delta: number) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const current = p.variants[0]?.stockCount || 0;
        const updated = Math.max(0, current + delta);
        const newVariants = [...p.variants];
        if (newVariants[0]) newVariants[0] = { ...newVariants[0], stockCount: updated };
        return { ...p, variants: newVariants };
      })
    );
  };

  const filtered = productList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCol = collectionFilter === "all" || p.collectionSlug === collectionFilter;
    return matchesSearch && matchesCol;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-plum">
            Products ({productList.length})
          </h1>
          <p className="text-xs text-brand-dark/60">
            Manage saree catalog, variants, and live inventory
          </p>
        </div>

        <Link
          to="/admin/edit/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-purple"
          />
        </div>

        <select
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
          className="px-3 py-2 bg-white rounded-xl border border-brand-lavender/40 text-xs font-medium text-brand-dark"
        >
          <option value="all">All Collections</option>
          <option value="silk">Pure Silk</option>
          <option value="cotton">Cotton Silk</option>
          <option value="festive">Festive Specials</option>
        </select>
      </div>

      {/* Products Display: Responsive Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-brand-lavender/30 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-brand-dark/60 font-medium">
            No products found matching your search.
          </div>
        ) : (
          <>
            {/* --------------------------------------------------------
                MOBILE PRODUCT CARDS VIEW (Visible only on < md screens)
               -------------------------------------------------------- */}
            <div className="md:hidden divide-y divide-brand-lavender/20">
              {filtered.map((product) => {
                const stock = product.variants[0]?.stockCount ?? 0;
                return (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex gap-3 items-start">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-18 rounded-xl object-cover bg-brand-ivory shrink-0 border border-brand-deepPlum/10 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-xs text-brand-deepPlum truncate">
                            {product.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold shrink-0 ${
                            product.status === "live" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                          }`}>
                            {product.status === "live" ? "Live" : "Draft"}
                          </span>
                        </div>

                        <p className="text-[11px] text-brand-dark/60 font-medium truncate">
                          {product.fabric} · #{product.code || product.id}
                        </p>

                        <div className="text-xs font-bold text-brand-plum">
                          ₹ {product.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {/* Stock Stepper & Action Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-brand-lavender/20">
                      {/* Stock Stepper */}
                      <div className="flex items-center gap-1.5 bg-brand-ivory/60 px-2.5 py-1 rounded-xl border border-brand-deepPlum/15">
                        <span className="text-[10px] uppercase font-bold text-brand-dark/60 mr-1">Stock:</span>
                        <button
                          onClick={() => handleStockChange(product.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum flex items-center justify-center hover:bg-brand-plum hover:text-white transition shadow-2xs active:scale-95"
                          aria-label="Decrease stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`w-7 text-center font-bold text-xs ${stock === 0 ? "text-red-500" : "text-brand-deepPlum"}`}>
                          {stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(product.id, 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum flex items-center justify-center hover:bg-brand-plum hover:text-white transition shadow-2xs active:scale-95"
                          aria-label="Increase stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & View Buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/p/${product.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-white transition min-w-[38px] min-h-[38px] flex items-center justify-center"
                          title="View on store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/edit/${product.id}`}
                          className="px-3.5 py-2 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs flex items-center gap-1.5 min-h-[38px]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --------------------------------------------------------
                DESKTOP TABLE VIEW (Visible on >= md screens)
               -------------------------------------------------------- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-brand-dark/60 border-b border-brand-lavender/20 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-lavender/20">
                  {filtered.map((product) => {
                    const stock = product.variants[0]?.stockCount ?? 0;
                    return (
                      <tr key={product.id} className="hover:bg-brand-ivory/50 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-12 rounded-lg object-cover bg-brand-ivory shrink-0"
                            />
                            <div>
                              <span className="font-serif font-bold text-brand-dark block">
                                {product.name}
                              </span>
                              <span className="text-[11px] text-brand-dark/60">
                                {product.fabric}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-brand-plum">
                          ₹ {product.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          {/* Inline stock adjustment buttons (- stock +) */}
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStockChange(product.id, -1)}
                              className="w-6 h-6 rounded-lg bg-brand-ivory border border-brand-lavender/40 text-brand-dark flex items-center justify-center hover:bg-brand-lavender/30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`w-6 text-center font-bold ${stock === 0 ? "text-red-500" : ""}`}>
                              {stock}
                            </span>
                            <button
                              onClick={() => handleStockChange(product.id, 1)}
                              className="w-6 h-6 rounded-lg bg-brand-ivory border border-brand-lavender/40 text-brand-dark flex items-center justify-center hover:bg-brand-lavender/30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            product.status === "live" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                          }`}>
                            {product.status === "live" ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/edit/${product.id}`}
                              className="p-1.5 text-brand-dark/60 hover:text-brand-purple rounded-lg hover:bg-brand-ivory"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/p/${product.slug}`}
                              target="_blank"
                              className="p-1.5 text-brand-dark/60 hover:text-brand-purple rounded-lg hover:bg-brand-ivory"
                              title="View public page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
