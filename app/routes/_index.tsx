import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { getAllProducts, getStoreSettings } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const products = await getAllProducts(env);
  const settings = await getStoreSettings(env);

  return json({
    products: products.slice(0, 6),
    settings,
  });
}

export default function HomePage() {
  const { products } = useLoaderData<typeof loader>();

  const categories = [
    { name: "Pure Silk", slug: "silk", count: "24 sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80" },
    { name: "Festive Specials", slug: "festive", count: "18 sarees", image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80" },
    { name: "Cotton Silk", slug: "cotton", count: "12 sarees", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80" },
    { name: "Bridal Heirloom", slug: "silk", count: "16 sarees", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 space-y-6">
        {/* Screen 1 / W1 Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-r from-brand-plum to-brand-purple text-white p-6 sm:p-8">
          <div className="max-w-md space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/30 text-brand-ivory text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              Festive Edit 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Find your festive saree
            </h1>
            <p className="text-sm text-brand-lavender/90 font-sans">
              Hand-woven Banarasi, Kanjivaram and wild Tussar silks. Handpicked for your moments.
            </p>
            <div className="pt-2">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-warmWhite text-brand-plum font-semibold text-sm hover:bg-brand-ivory transition shadow-lg"
              >
                <span>Explore Saree Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 sm:opacity-40 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
        </div>

        {/* Shop By Category */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-brand-plum">Shop by category</h2>
            <Link to="/shop" className="text-xs text-brand-purple font-semibold hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/feed?collection=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-brand-ivory shadow-sm border border-brand-lavender/20 flex flex-col justify-end p-3 transition hover:shadow-md"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="font-serif text-sm font-bold">{cat.name}</h3>
                  <span className="text-[11px] text-white/80">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-brand-plum">New arrivals</h2>
            <Link to="/shop" className="text-xs text-brand-purple font-semibold hover:underline">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {products.map((saree) => (
              <Link
                key={saree.id}
                to={`/p/${saree.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-lavender/20 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="aspect-[3/4] relative bg-brand-ivory overflow-hidden">
                  <img
                    src={saree.images[0]}
                    alt={saree.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-sm">
                    In stock
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-serif text-xs sm:text-sm font-semibold text-brand-dark line-clamp-1 group-hover:text-brand-purple transition">
                    {saree.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs sm:text-sm font-bold text-brand-plum">
                      ₹ {saree.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-brand-purple font-medium group-hover:underline">
                      Buy now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Festive Offer Banner */}
        <section className="rounded-2xl p-4 sm:p-5 bg-brand-ivory border border-brand-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Festive offer</span>
              <span className="text-[11px] bg-brand-gold/20 text-brand-plum px-2 py-0.5 rounded-full font-medium">Limited Period</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-brand-plum">
              Complimentary Fall & Pico on all Pure Silks
            </h3>
            <p className="text-xs text-brand-dark/70">
              Orders placed directly on WhatsApp include complimentary saree finishing and express shipping.
            </p>
          </div>
          <Link
            to="/feed"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition whitespace-nowrap shadow-sm"
          >
            Shop the Collection
          </Link>
        </section>

        {/* Store Trust Badges */}
        <section className="grid grid-cols-3 gap-2 py-4 border-t border-brand-lavender/20 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <ShieldCheck className="w-5 h-5 text-brand-purple" />
            <span className="text-xs font-bold text-brand-dark">100% Authentic</span>
            <span className="text-[10px] text-brand-dark/60">Certified Handloom</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <Truck className="w-5 h-5 text-brand-purple" />
            <span className="text-xs font-bold text-brand-dark">Express Shipping</span>
            <span className="text-[10px] text-brand-dark/60">Dispatched in 24h</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <RefreshCw className="w-5 h-5 text-brand-purple" />
            <span className="text-xs font-bold text-brand-dark">Direct Support</span>
            <span className="text-[10px] text-brand-dark/60">WhatsApp Concierge</span>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
