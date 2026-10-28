import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Heart, Share2, Sparkles, Trash2 } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { getAllProducts } from "~/db/d1.server";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  return json({ products });
}

export default function SavedPage() {
  const { products } = useLoaderData<typeof loader>();
  const { savedIds, toggleSave, isLoaded } = useSavedSarees();

  const savedSarees = products.filter((p) => savedIds.includes(p.id));

  const handleSharePicks = async () => {
    const text = `Here are my favorite Miss Malli sarees:\n` +
      savedSarees.map((s) => `• ${s.name} (₹ ${s.price.toLocaleString("en-IN")})`).join("\n");
      
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Miss Malli Wishlist",
          text,
          url: window.location.origin,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Your saved picks have been copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
              Saved ({savedSarees.length})
            </h1>
            <p className="text-xs text-brand-dark/60">
              Stored privately on your device
            </p>
          </div>

          {savedSarees.length > 0 && (
            <button
              onClick={handleSharePicks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple text-brand-purple text-xs font-semibold hover:bg-brand-purple hover:text-white transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send my picks</span>
            </button>
          )}
        </div>

        {isLoaded && savedSarees.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-blush/20 text-brand-purple mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-lg font-bold text-brand-plum">No saved sarees yet</h2>
            <p className="text-xs text-brand-dark/70 max-w-xs mx-auto">
              Tap the heart icon while browsing the feed or catalog to save your favorite sarees here.
            </p>
            <div className="pt-2">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explore Saree Feed
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {savedSarees.map((saree) => (
              <div
                key={saree.id}
                className="bg-white rounded-2xl overflow-hidden border border-brand-lavender/20 shadow-sm flex flex-col justify-between"
              >
                <Link to={`/p/${saree.slug}`} className="relative aspect-[3/4] bg-brand-ivory block">
                  <img src={saree.images[0]} alt={saree.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSave(saree.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:text-red-400"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Link>

                <div className="p-3">
                  <h3 className="font-serif text-xs font-semibold text-brand-dark truncate">{saree.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-brand-plum">₹ {saree.price.toLocaleString("en-IN")}</span>
                    <Link
                      to={`/p/${saree.slug}`}
                      className="px-3 py-1 rounded-full bg-brand-purple text-white text-[10px] font-semibold hover:bg-brand-plum transition"
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
