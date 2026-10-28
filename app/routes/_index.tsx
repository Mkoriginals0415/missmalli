import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Play, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  ChevronRight,
  Eye,
  MessageCircle,
  Star
} from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { QuickViewModal } from "~/components/product/QuickViewModal";
import { INITIAL_PRODUCTS, SeedProduct } from "~/db/mock-data";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ context }: LoaderFunctionArgs) {
  return json({
    products: INITIAL_PRODUCTS,
    newArrivals: INITIAL_PRODUCTS.slice(0, 4),
  });
}

export default function HomePage() {
  const { products, newArrivals } = useLoaderData<typeof loader>();
  const [quickViewProduct, setQuickViewProduct] = useState<SeedProduct | null>(null);
  const { isSaved, toggleSave } = useSavedSarees();

  const categories = [
    {
      name: "Sarees",
      count: "240+ styles",
      slug: "sarees",
      bgColor: "bg-brand-blush/60",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dresses",
      count: "120+ styles",
      slug: "dresses",
      bgColor: "bg-brand-plum/40",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dress Materials",
      count: "90+ styles",
      slug: "materials",
      bgColor: "bg-brand-gold/40",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Exclusive",
      count: "40+ styles",
      slug: "exclusive",
      bgColor: "bg-brand-lilac/60",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const testimonials = [
    {
      quote: "Beautiful fabric and the zari work is exquisite. Felt like a piece of art.",
      author: "Rafi H.",
      city: "Hyderabad",
    },
    {
      quote: "The drape and pure silk texture surpassed my expectations. Ordering on WhatsApp was so seamless!",
      author: "Anjali S.",
      city: "Chennai",
    },
    {
      quote: "Heirloom grade Banarasi. Fast delivery and the personal WhatsApp assistance was incredible.",
      author: "Meera K.",
      city: "Bengaluru",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans selection:bg-brand-lilac selection:text-brand-deepPlum">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* =========================================================
            HERO SECTION (From new design.jpg & new design.pdf Page 01)
           ========================================================= */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-8">
          {/* Top Hero Badges: Circular Artisan Badge + Heading + Avatar Cluster */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            {/* Circular Rotating Badge: "Learn about our artisans" */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] uppercase tracking-[0.25em] font-bold fill-brand-deepPlum">
                    <textPath xlinkHref="#circlePath">
                      Learn about our artisans •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-brand-deepPlum text-white flex items-center justify-center shadow-md">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Central Hero Headline */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Handwoven With Love</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-deepPlum leading-[1.12]">
                Elevate Your Grace With Heritage Drape
              </h1>
            </div>

            {/* Social Proof Avatar Cluster */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-deepPlum text-white text-xs font-bold flex items-center justify-center shadow-sm">
                +
              </div>
            </div>
          </div>

          {/* 5-Column Notched Hero Cards Gallery (Signature new design layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
            {/* Column 1: Pink Saree Top + Zari Texture Bottom */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] notched-tl overflow-hidden bg-brand-lilac/30 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Rani Pink Saree"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden bg-brand-blush/30 shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
                  alt="Zari Textile"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* Column 2: Tall Arched Lavender Saree */}
            <div className="relative aspect-[9/16] sm:aspect-[3/5] notched-arch overflow-hidden bg-brand-lilac/40 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt="Lavender Georgette"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-serif italic">Pure Lilac Handloom</span>
              </div>
            </div>

            {/* Column 3: Center Gold Tissue with "Explore Collections" Pill */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-full aspect-[4/5] rounded-[22px] overflow-hidden bg-brand-gold/20 shadow-md group border border-brand-gold/30">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  alt="Gold Tissue Silk"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <Link
                to="/sarees"
                className="w-full py-3.5 px-6 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Explore Collections</span>
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">↗</span>
              </Link>
            </div>

            {/* Column 4: Arched Plum Kurta/Drape */}
            <div className="relative aspect-[9/16] sm:aspect-[3/5] notched-arch overflow-hidden bg-brand-plum/30 shadow-lg group hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Plum Kurta"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-serif italic">Zari Kurta Ensemble</span>
              </div>
            </div>

            {/* Column 5: Bridal Veil Top + Rani Pink Bottom */}
            <div className="flex flex-col gap-4 hidden lg:flex">
              <div className="relative aspect-[4/3] notched-tr overflow-hidden bg-brand-blush/30 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                  alt="Bridal Veil"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-[22px] overflow-hidden bg-brand-lilac/30 shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  alt="Drape"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom Hero Review & Saree Link Strip */}
          <div className="mt-12 pt-6 border-t border-brand-lilac/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Quote */}
            <div className="flex items-start gap-3 max-w-xl">
              <span className="text-4xl font-serif text-brand-plum leading-none">“</span>
              <div>
                <p className="text-xs sm:text-sm text-brand-deepPlum/80 leading-relaxed font-sans">
                  miss malli is a piece of art... handwoven typography review it piece of art.... loved the saree!
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="font-serif italic font-bold text-sm text-brand-deepPlum bg-yellow-200/60 px-2 py-0.5 rounded">
                    Rafi H.
                  </span>
                  <span className="text-[11px] text-brand-deepPlum/50">Verified Buyer</span>
                </div>
              </div>
            </div>

            {/* Right Tag */}
            <Link
              to="/sarees"
              className="flex items-center gap-3 text-brand-deepPlum hover:text-brand-plum transition group"
            >
              <div>
                <span className="text-2xl font-bold font-sans">01</span>
                <span className="text-xs text-brand-deepPlum/50 ml-1">/ Sarees</span>
                <h3 className="text-sm font-bold tracking-tight">Drape Your Way With Traditional Crafts</h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-ivory border border-brand-deepPlum/30 flex items-center justify-center group-hover:bg-brand-deepPlum group-hover:text-white transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </section>

        {/* =========================================================
            SHOP BY CATEGORY: "Find Your Drape" (Page 01)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
              Find Your Drape
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/sarees?collection=${cat.slug}`}
                className="group relative rounded-[22px] overflow-hidden aspect-[3/4] bg-white border border-brand-lilac/30 shadow-sm hover:shadow-lg transition flex flex-col justify-end p-5"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/85 via-brand-deepPlum/20 to-transparent" />
                <div className="relative z-10 text-white space-y-0.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold">{cat.name}</h3>
                  <p className="text-xs text-brand-lilac">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================
            NEW ARRIVALS: "Fresh From The Loom" (Page 01)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold">
                New Arrivals
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
                Fresh From The Loom
              </h2>
            </div>
            <Link
              to="/sarees"
              className="text-xs font-semibold text-brand-plum hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] bg-brand-lilac/10 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-deepPlum text-white text-[10px] font-bold shadow-sm">
                        {product.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-brand-deepPlum text-[9px] font-bold">
                      #{product.code}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleSave(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-brand-deepPlum hover:text-brand-plum transition shadow-sm"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved(product.id) ? "fill-brand-blush text-brand-plum" : ""}`}
                    />
                  </button>

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full py-2 rounded-full bg-white/95 backdrop-blur-md text-brand-deepPlum text-xs font-semibold shadow-md hover:bg-brand-deepPlum hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>quick view +</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <Link to={`/p/${product.slug}`} className="block group-hover:text-brand-plum">
                    <h3 className="font-sans text-xs sm:text-sm font-semibold text-brand-deepPlum line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-brand-deepPlum/60">{product.fabric}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-brand-deepPlum">
                        ₹ {product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-brand-deepPlum/40 line-through">
                          ₹ {product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/p/${product.slug}`}
                      className="text-[11px] font-bold text-brand-plum hover:underline"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            FESTIVE EDIT 2026 PROMOTION BANNER (Page 01)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-[28px] overflow-hidden bg-brand-plum text-white p-6 sm:p-12 relative flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-lg z-10">
              <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold">
                Festive Edit · 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
                Flat 30% off<br />on Silk Sarees
              </h2>
              <p className="text-xs sm:text-sm text-brand-lilac leading-relaxed">
                Handcrafted pure Katan, Kanjivaram and wild Tussar silks. Order directly on WhatsApp with complimentary fall, pico and express delivery.
              </p>
              <div className="pt-2">
                <Link
                  to="/sarees?filter=festive"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-ivory text-brand-deepPlum font-semibold text-xs hover:bg-white transition shadow-md"
                >
                  <span>Shop the Sale</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            <div className="w-full sm:w-80 aspect-[4/3] rounded-[22px] bg-brand-gold/30 overflow-hidden relative border border-brand-gold/40 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                alt="Festive Silk Offer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            OUR ARTISANS SPOTLIGHT (Page 01)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-[28px] p-6 sm:p-12 bg-white border border-brand-lilac/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold">
                Our Artisans
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum leading-tight">
                Woven by hands,<br />worn with pride
              </h2>
              <p className="text-xs sm:text-sm text-brand-deepPlum/70 leading-relaxed">
                Each saree is crafted by master weavers from Kanchipuram, Varanasi and Pochampally. Every weave honors centuries of loom heritage.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20tell%20me%20about%20your%20artisans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-deepPlum text-brand-deepPlum text-xs font-semibold hover:bg-brand-deepPlum hover:text-white transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Chat With Our Concierge</span>
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/2 aspect-[16/9] rounded-[22px] overflow-hidden bg-brand-lilac/20 shadow-md relative">
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"
                alt="Master Artisan at Loom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md text-brand-deepPlum flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-brand-deepPlum ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            LOVED BY OUR CUSTOMERS (Page 01)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
              Loved by Our Customers
            </h2>
            <p className="text-xs text-brand-deepPlum/60">Real reviews from our WhatsApp saree collectors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[22px] bg-white border border-brand-lilac/30 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-deepPlum/80 leading-relaxed font-sans">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-lilac/20">
                  <span className="font-bold text-xs text-brand-deepPlum block">— {t.author}</span>
                  <span className="text-[11px] text-brand-deepPlum/50">{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
