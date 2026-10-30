import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Play, 
  ArrowRight, 
  Heart, 
  Star,
  Sparkles,
  Award,
  Truck,
  MessageCircle,
  RotateCcw,
  Check
} from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { INITIAL_PRODUCTS } from "~/db/mock-data";
import { getHomepageContent } from "~/db/d1.server";
import { useSavedSarees } from "~/hooks/useLocalStorage";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const content = await getHomepageContent(env);

  return json({
    products: INITIAL_PRODUCTS,
    newArrivals: INITIAL_PRODUCTS.slice(0, content.newArrivals?.productLimit || 4),
    content,
  });
}

export default function HomePage() {
  const { products, newArrivals, content } = useLoaderData<typeof loader>();
  const { isSaved, toggleSave } = useSavedSarees();

  // Floating notification toast for user interactions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleSave = (productId: number, productName: string) => {
    toggleSave(productId);
    const wasSaved = isSaved(productId);
    setToastMessage(wasSaved ? `Removed "${productName}" from Wishlist` : `Saved "${productName}" to Wishlist`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Safe fallback configurations
  const sections = content.sections || [
    { id: "hero", name: "Hero Showcase", enabled: true },
    { id: "trustBadges", name: "Trust Badges", enabled: true },
    { id: "categories", name: "Categories", enabled: true },
    { id: "newArrivals", name: "New Arrivals", enabled: true },
    { id: "promotion", name: "Promotion", enabled: true },
    { id: "artisan", name: "Artisan Heritage", enabled: true },
    { id: "testimonials", name: "Testimonials", enabled: true },
  ];

  const hero = content.hero;
  const categories = content.categories;
  const newArrivalsConfig = content.newArrivals;
  const promotion = content.promotion;
  const artisan = content.artisan;
  const testimonials = content.testimonials;
  const trustBadges = content.trustBadges;

  // Icon mapping for trust badges
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="w-5 h-5 text-brand-plum" />;
      case "Truck":
        return <Truck className="w-5 h-5 text-brand-plum" />;
      case "MessageCircle":
        return <MessageCircle className="w-5 h-5 text-brand-plum" />;
      case "RotateCcw":
        return <RotateCcw className="w-5 h-5 text-brand-plum" />;
      default:
        return <Award className="w-5 h-5 text-brand-plum" />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans selection:bg-brand-lilac selection:text-brand-deepPlum">
      <Navbar />

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-brand-deepPlum text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-brand-lilac/30">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1 space-y-12 sm:space-y-24 pb-24 lg:pb-16">
        {sections.map((section) => {
          if (!section.enabled) return null;

          switch (section.id) {
            /* =========================================================
               1. HERO SECTION (Customizable images, titles, review strip)
               ========================================================= */
            case "hero":
              return (
                <section key="hero" className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
                  {/* Top Bar: Circular Badge + Central Headline + Social Avatars */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-10">
                    {/* Circular Rotating Badge (Desktop) */}
                    <div className="hidden lg:flex items-center gap-3">
                      <Link to="/artisans" className="relative w-20 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition" title="Learn about our master artisans">
                        <svg className="w-full h-full animate-[spin_14s_linear_infinite]" viewBox="0 0 100 100">
                          <path
                            id="circlePath"
                            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                            fill="none"
                          />
                          <text className="text-[9.5px] uppercase tracking-[0.25em] font-bold fill-brand-deepPlum">
                            <textPath xlinkHref="#circlePath">
                              {hero.badgeText || "Learn about our master artisans •"}
                            </textPath>
                          </text>
                        </svg>
                        <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-brand-deepPlum text-white flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </Link>
                    </div>

                    {/* Central Headline */}
                    <div className="text-center max-w-3xl mx-auto space-y-2">
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-brand-deepPlum leading-[1.12]">
                        {hero.headline}
                      </h1>
                      {hero.subheadline && (
                        <p className="text-xs sm:text-sm text-brand-deepPlum/70 font-medium max-w-xl mx-auto">
                          {hero.subheadline}
                        </p>
                      )}
                    </div>

                    {/* Social Proof Avatar Cluster (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="flex -space-x-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                          alt="Collector"
                          className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                          alt="Collector"
                          className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                          alt="Collector"
                          className="w-9 h-9 rounded-full border-2 border-brand-ivory object-cover shadow-sm"
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-deepPlum text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        +
                      </div>
                    </div>
                  </div>

                  {/* ----------------------------------------------------------
                      MOBILE HERO VIEW: Interlocking Bento Moodboard Showcase
                     ---------------------------------------------------------- */}
                  <div className="block lg:hidden space-y-4">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 py-1 scroll-smooth">
                      {/* Card 1: Tall Arched Pill */}
                      <div className="snap-center shrink-0 w-[65vw] sm:w-[45vw] h-[360px] rounded-t-full rounded-b-[32px] overflow-hidden relative shadow-md bg-brand-plum/20">
                        <img
                          src={hero.mobileImages[0] || hero.desktopImages[0]}
                          alt="Heritage Silk"
                          className="w-full h-full object-cover object-top"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/85 via-transparent to-transparent flex items-end p-4">
                          <div className="text-white">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-lilac block">Heirloom Weave</span>
                            <span className="text-sm font-serif italic">Pure Handloom Silk</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Stack of 2 Rounded Bento Blocks */}
                      <div className="snap-center shrink-0 w-[65vw] sm:w-[45vw] h-[360px] flex flex-col gap-3">
                        <div className="flex-1 rounded-[28px] overflow-hidden relative shadow-sm bg-brand-gold/20">
                          <img
                            src={hero.mobileImages[2] || hero.desktopImages[2]}
                            alt="Antique Gold Zari"
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-3.5">
                            <span className="text-xs font-serif text-white">Antique Zari Brocade</span>
                          </div>
                        </div>
                        <div className="h-[140px] rounded-full overflow-hidden relative shadow-sm bg-brand-lilac/30">
                          <img
                            src={hero.mobileImages[4] || hero.desktopImages[4]}
                            alt="Master Loom"
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-3.5 px-5">
                            <span className="text-[11px] font-serif italic text-white">Master Weaver Looms</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Tall Rounded Rectangle with Inverted Arch */}
                      <div className="snap-center shrink-0 w-[65vw] sm:w-[45vw] h-[360px] rounded-t-[32px] rounded-b-full overflow-hidden relative shadow-md bg-brand-blush/30">
                        <img
                          src={hero.mobileImages[1] || hero.desktopImages[1]}
                          alt="Georgette Drape"
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/85 via-transparent to-transparent flex items-end p-4">
                          <div className="text-white">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-lilac block">Fluid Grace</span>
                            <span className="text-sm font-serif italic">Serene Georgette Fall</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Stack of Horizontal Pill & Square Card */}
                      <div className="snap-center shrink-0 w-[65vw] sm:w-[45vw] h-[360px] flex flex-col gap-3">
                        <div className="h-[140px] rounded-full overflow-hidden relative shadow-sm bg-brand-plum/30">
                          <img
                            src={hero.mobileImages[3] || hero.desktopImages[3]}
                            alt="Satin Crepe"
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-3.5 px-5">
                            <span className="text-[11px] font-serif italic text-white">Lustrous Satin Drape</span>
                          </div>
                        </div>
                        <div className="flex-1 rounded-[28px] overflow-hidden relative shadow-sm bg-brand-gold/30">
                          <img
                            src={hero.mobileImages[0] || hero.desktopImages[0]}
                            alt="Palace Drape"
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-3.5">
                            <span className="text-xs font-serif text-white">Crafted for Milestones</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px] text-brand-deepPlum/60 font-semibold">
                      <span>Swipe to explore editorial moodboard</span>
                      <span>→</span>
                    </div>

                    {/* Centered Explore Button on Mobile */}
                    <div className="pt-1">
                      <Link
                        to={hero.buttonLink || "/sarees"}
                        className="w-full py-3.5 px-6 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>{hero.buttonText}</span>
                        <span>↗</span>
                      </Link>
                    </div>

                    {/* Quick Category Chips */}
                    <div className="flex justify-center gap-2 pt-1 flex-wrap">
                      <Link
                        to="/sarees"
                        className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                      >
                        Sarees
                      </Link>
                      <Link
                        to="/sarees?collection=dresses"
                        className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                      >
                        Dresses
                      </Link>
                      <Link
                        to="/sarees?filter=sale"
                        className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                      >
                        Sale
                      </Link>
                    </div>
                  </div>

                  {/* ----------------------------------------------------------
                      DESKTOP HERO VIEW: Interlocking Bento Moodboard Showcase
                     ---------------------------------------------------------- */}
                  <div className="hidden lg:grid grid-cols-12 gap-3.5 h-[520px] items-stretch bento-hero-mosaic">
                    {/* Column 1 (span 3): Horizontal pill top + tall vertical card bottom */}
                    <div className="col-span-3 flex flex-col gap-3.5">
                      <div className="relative h-[160px] rounded-[36px] overflow-hidden bg-brand-lilac/30 shadow-sm group">
                        <img
                          src={hero.desktopImages[4] || hero.desktopImages[0]}
                          alt="Master Loom Weaving"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-4">
                          <span className="text-[11px] font-serif italic text-white/95">Master Weaver Looms</span>
                        </div>
                      </div>
                      <div className="relative flex-1 rounded-[36px] overflow-hidden bg-brand-gold/20 shadow-md group border border-brand-gold/30">
                        <img
                          src={hero.desktopImages[0]}
                          alt="Heritage Silk Drape"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/75 via-transparent to-transparent flex items-end p-4">
                          <span className="text-xs font-serif text-white font-medium">Pure Kanjivaram Silk</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 (span 3): Tall Arched Organic Card + Explore Pill */}
                    <div className="col-span-3 flex flex-col gap-3.5">
                      <div className="relative flex-1 rounded-t-full rounded-b-[36px] overflow-hidden bg-brand-plum/20 shadow-lg group">
                        <img
                          src={hero.desktopImages[1]}
                          alt="Lilac Handloom Silk"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/80 via-transparent to-transparent flex items-end p-5">
                          <div className="text-white space-y-0.5">
                            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-lilac block">Heirloom Weave</span>
                            <span className="text-sm font-serif italic">Soft Georgette Fall</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={hero.buttonLink || "/sarees"}
                        className="h-[56px] rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md flex items-center justify-between px-6 group"
                      >
                        <span>{hero.buttonText}</span>
                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition">↗</span>
                      </Link>
                    </div>

                    {/* Column 3 (span 3): Square Rounded Card + Inverted Arched Card */}
                    <div className="col-span-3 flex flex-col gap-3.5">
                      <div className="relative h-[230px] rounded-[36px] overflow-hidden bg-brand-blush/30 shadow-md group">
                        <img
                          src={hero.desktopImages[2]}
                          alt="Antique Gold Zari"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/65 via-transparent to-transparent flex items-end p-4">
                          <span className="text-xs font-serif text-white">Antique Gold Zari Brocade</span>
                        </div>
                      </div>
                      <div className="relative flex-1 rounded-t-[36px] rounded-b-full overflow-hidden bg-brand-lilac/30 shadow-sm group">
                        <img
                          src={hero.desktopImages[5] || hero.desktopImages[1]}
                          alt="Artisan Craftsmanship"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/70 via-transparent to-transparent flex items-end p-4">
                          <span className="text-[11px] font-serif italic text-white/95">Centuries of Heritage</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 4 (span 3): Tall Vertical Card + Horizontal Pill */}
                    <div className="col-span-3 flex flex-col gap-3.5">
                      <div className="relative flex-1 rounded-[36px] overflow-hidden bg-brand-gold/30 shadow-md group">
                        <img
                          src={hero.desktopImages[3]}
                          alt="Emerald Satin Crepe"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/75 via-transparent to-transparent flex items-end p-4">
                          <span className="text-xs font-serif text-white">Lustrous Satin Crepe</span>
                        </div>
                      </div>
                      <div className="relative h-[150px] rounded-full overflow-hidden bg-brand-deepPlum/20 shadow-sm group">
                        <img
                          src={hero.desktopImages[4] || hero.desktopImages[2]}
                          alt="Artisan Loom"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-deepPlum/80 via-transparent to-transparent flex items-center px-6">
                          <span className="text-xs font-serif italic text-white">Crafted by Master Hands</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );

            /* =========================================================
               2. TRUST BADGES / BRAND GUARANTEES
               ========================================================= */
            case "trustBadges":
              return (
                <section key="trustBadges" className="max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-[28px] bg-white border border-brand-lilac/30 shadow-xs">
                    {trustBadges.items.map((badge, idx) => (
                      <div key={badge.id || idx} className="flex items-start gap-3.5 p-2">
                        <div className="w-10 h-10 rounded-2xl bg-brand-ivory border border-brand-deepPlum/10 flex items-center justify-center shrink-0 shadow-2xs">
                          {renderBadgeIcon(badge.icon)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-brand-deepPlum">{badge.title}</h4>
                          <p className="text-[11px] text-brand-deepPlum/70 font-medium leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            /* =========================================================
               3. CATEGORIES / COLLECTIONS
               ========================================================= */
            case "categories":
              return (
                <section key="categories" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
                      {categories.title}
                    </h2>
                    {categories.subtitle && (
                      <p className="text-xs text-brand-deepPlum/70 font-medium">
                        {categories.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {categories.items.filter((cat) => cat.onHome !== false).map((cat, idx) => (
                      <Link
                        key={cat.id || idx}
                        to={`/sarees?collection=${cat.slug}`}
                        className={`group relative overflow-hidden aspect-[3/4] bg-white border border-brand-lilac/30 shadow-sm hover:shadow-lg transition flex flex-col justify-end p-5 ${
                          categories.layout === "notched" && idx % 2 === 0 ? "notched-tl" : "rounded-[22px]"
                        }`}
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepPlum/90 via-brand-deepPlum/20 to-transparent" />
                        <div className="relative z-10 text-white space-y-0.5">
                          <h3 className="font-sans text-base sm:text-lg font-bold">{cat.name}</h3>
                          <p className="text-xs text-brand-lilac font-medium">{cat.count}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );

            /* =========================================================
               4. NEW ARRIVALS (Clickable directly to PDP)
               ========================================================= */
            case "newArrivals":
              return (
                <section key="newArrivals" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
                        {newArrivalsConfig.title}
                      </h2>
                      {newArrivalsConfig.subtitle && (
                        <p className="text-xs text-brand-deepPlum/70 font-medium mt-0.5">
                          {newArrivalsConfig.subtitle}
                        </p>
                      )}
                    </div>
                    <Link
                      to={newArrivalsConfig.viewAllLink || "/sarees"}
                      className="text-xs font-bold text-brand-plum hover:underline flex items-center gap-1"
                    >
                      <span>{newArrivalsConfig.viewAllText || "View all"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {newArrivals.map((product) => (
                      <Link
                        key={product.id}
                        to={`/p/${product.slug}`}
                        className="group bg-white rounded-[22px] overflow-hidden border border-brand-lilac/30 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div className="relative aspect-[2/3] bg-brand-ivory/60 overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                          />

                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {product.badge && (
                              <span className="px-2.5 py-0.5 rounded-full bg-brand-deepPlum text-white text-[10px] font-bold shadow-sm">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleSave(product.id, product.name);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-brand-deepPlum hover:text-brand-plum transition shadow-sm"
                            aria-label="Wishlist"
                          >
                            <Heart
                              className={`w-4 h-4 ${isSaved(product.id) ? "fill-brand-plum text-brand-plum" : ""}`}
                            />
                          </button>
                        </div>

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
                </section>
              );

            /* =========================================================
               5. FESTIVE / PROMOTIONS
               ========================================================= */
            case "promotion":
              return (
                <section key="promotion" className="max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="rounded-[28px] overflow-hidden bg-brand-plum text-white p-6 sm:p-12 relative flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="space-y-3 max-w-lg z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold bg-black/20 px-3 py-1 rounded-full">
                          {promotion.discountTag}
                        </span>
                        {promotion.couponCode && (
                          <span className="text-[11px] font-bold font-mono tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                            CODE: {promotion.couponCode}
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
                        {promotion.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-brand-lilac leading-relaxed">
                        {promotion.subtitle}
                      </p>
                      <div className="pt-2">
                        <Link
                          to={promotion.buttonLink || "/sarees?filter=sale"}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-ivory text-brand-deepPlum font-bold text-xs hover:bg-white transition shadow-md"
                        >
                          <span>{promotion.buttonText || "Shop the Sale"}</span>
                          <span>↗</span>
                        </Link>
                      </div>
                    </div>

                    <div className="w-full sm:w-80 aspect-[4/3] rounded-[22px] bg-brand-gold/30 overflow-hidden relative border border-brand-gold/40 shadow-inner">
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </section>
              );

            /* =========================================================
               6. ARTISAN HERITAGE
               ========================================================= */
            case "artisan":
              return (
                <section key="artisan" className="max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="rounded-[28px] p-6 sm:p-12 bg-white border border-brand-lilac/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-md">
                      <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-deepPlum leading-tight">
                        {artisan.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-brand-deepPlum/80 leading-relaxed font-medium">
                        {artisan.description}
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                        <Link
                          to="/artisans"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Watch the story</span>
                        </Link>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 aspect-[16/9] rounded-[22px] overflow-hidden bg-brand-lilac/20 shadow-md relative">
                      <img
                        src={artisan.image}
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
              );

            /* =========================================================
               7. TESTIMONIALS
               ========================================================= */
            case "testimonials":
              return (
                <section key="testimonials" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-bold text-brand-deepPlum">
                      {testimonials.title}
                    </h2>
                    {testimonials.subtitle && (
                      <p className="text-xs text-brand-deepPlum/70 font-semibold">
                        {testimonials.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
                    {testimonials.items.map((t, idx) => (
                      <div
                        key={t.id || idx}
                        className="w-[280px] sm:w-auto shrink-0 p-5 sm:p-6 rounded-[22px] bg-white border border-brand-lilac/30 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition"
                      >
                        <div className="space-y-2.5">
                          <div className="flex text-amber-500">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-brand-deepPlum/90 leading-relaxed font-sans font-medium">
                            "{t.quote}"
                          </p>
                        </div>
                        <div className="pt-3 border-t border-brand-lilac/20 flex items-center gap-3">
                          {t.avatar && (
                            <img
                              src={t.avatar}
                              alt={t.author}
                              className="w-9 h-9 rounded-full object-cover border border-brand-deepPlum/10"
                            />
                          )}
                          <div>
                            <span className="font-bold text-xs text-brand-deepPlum block">— {t.author}</span>
                            <span className="text-[11px] text-brand-deepPlum/60 font-medium">{t.city}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </main>

      <Footer />
    </div>
  );
}
