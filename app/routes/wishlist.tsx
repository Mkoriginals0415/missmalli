import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { INITIAL_PRODUCTS } from "~/db/mock-data";
import { useSavedSarees, useBag } from "~/hooks/useLocalStorage";

export async function loader({ context }: LoaderFunctionArgs) {
  return json({ products: INITIAL_PRODUCTS });
}

export default function WishlistPage() {
  const { products } = useLoaderData<typeof loader>();
  const { savedIds, toggleSave, isLoaded } = useSavedSarees();
  const { addToBag } = useBag();

  const savedSarees = products.filter((p) => savedIds.includes(p.id));

  const handleMoveAllToBag = () => {
    savedSarees.forEach((saree) => {
      addToBag({
        productId: saree.id,
        name: saree.name,
        slug: saree.slug,
        colorName: saree.variants[0]?.colorName || "Original",
        colorHex: saree.variants[0]?.colorHex || "#5B2A6E",
        blouseOption: "with",
        price: saree.price,
        imageUrl: saree.images[0],
      });
      toggleSave(saree.id);
    });
    alert(`Moved ${savedSarees.length} sarees to your bag!`);
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-deepPlum">
              My Wishlist
            </h1>
            <p className="text-xs text-brand-deepPlum/60 mt-0.5">
              {savedSarees.length} saved pieces on your device
            </p>
          </div>

          {savedSarees.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="px-6 py-2.5 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm self-start sm:self-auto"
            >
              Move all to bag
            </button>
          )}
        </div>

        {isLoaded && savedSarees.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[28px] border border-brand-lilac/30 p-8">
            <div className="w-16 h-16 rounded-full bg-brand-blush/30 text-brand-plum mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-brand-deepPlum">Your wishlist is empty</h2>
            <p className="text-xs text-brand-deepPlum/70 max-w-sm mx-auto">
              Save your favorite drapes while exploring our collection.
            </p>
            <div className="pt-2">
              <Link
                to="/sarees"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
              >
                <span>Discover Handlooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {savedSarees.map((saree) => (
              <div
                key={saree.id}
                className="bg-white rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-brand-lilac/10 overflow-hidden">
                  <img
                    src={saree.images[0]}
                    alt={saree.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-brand-deepPlum text-white text-[9px] font-bold">
                    #{saree.code}
                  </span>
                  <button
                    onClick={() => toggleSave(saree.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-brand-plum hover:text-red-500 shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <Link to={`/p/${saree.slug}`} className="block hover:text-brand-plum">
                    <h3 className="font-semibold text-xs sm:text-sm text-brand-deepPlum line-clamp-1">
                      {saree.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-brand-deepPlum/60">{saree.fabric}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm font-bold text-brand-deepPlum">
                      ₹ {saree.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={() => {
                        addToBag({
                          productId: saree.id,
                          name: saree.name,
                          slug: saree.slug,
                          colorName: saree.variants[0]?.colorName || "Original",
                          colorHex: saree.variants[0]?.colorHex || "#5B2A6E",
                          blouseOption: "with",
                          price: saree.price,
                          imageUrl: saree.images[0],
                        });
                        toggleSave(saree.id);
                        alert(`Moved ${saree.name} to bag!`);
                      }}
                      className="text-[11px] font-bold text-brand-plum hover:underline"
                    >
                      + Add to bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
