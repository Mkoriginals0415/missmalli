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
import { getHomepageContent, getAllProducts } from "~/db/d1.server";
import { useSavedSarees } from "~/hooks/useLocalStorage";
import { Hero3DCoverFlow } from "~/components/home/Hero3DCoverFlow";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const [content, allProducts] = await Promise.all([
    getHomepageContent(env),
    getAllProducts(env),
  ]);

  return json({
    products: allProducts,
    newArrivals: allProducts.slice(0, content.newArrivals?.productLimit || 4),
    content,
  });
}

export default function HomePage() {
  const { products, newArrivals, content } = useLoaderData<typeof loader>();
  const { isSaved, toggleSave } = useSavedSarees();

  const handleToggleSave = (productId: number) => {
    toggleSave(productId);
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

      <main className="flex-1 space-y-8 sm:space-y-14 pb-20 lg:pb-16">
        {sections.map((section) => {
          if (!section.enabled) return null;

          switch (section.id) {
            /* =========================================================
               1. HERO SECTION (3D Cover-Flow Gallery with Tilt & Brand Colors)
               ========================================================= */
            case "hero": {
              const heroCards = [
                {
                  id: "card-1",
                  image: hero.desktopImages[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
                  title: "Pure Kanjivaram Silk",
                  subtitle: "Heirloom Gold Zari Drape",
                  tag: "Royal Heritage",
                  link: "/sarees?collection=kanjivaram",
                },
                {
                  id: "card-2",
                  image: hero.desktopImages[1] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
                  title: "Lilac Handloom Silk",
                  subtitle: "Soft Georgette Fall",
                  tag: "Pure Weave",
                  link: "/sarees?collection=handloom",
                },
                {
                  id: "card-3",
                  image: hero.desktopImages[2] || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
                  title: "Antique Zari Brocade",
                  subtitle: "Festive Crimson & Zari",
                  tag: "Bridal Trousseau",
                  link: "/sarees?collection=banarasi",
                },
                {
                  id: "card-4",
                  image: hero.desktopImages[3] || "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85",
                  title: "Lustrous Satin Crepe",
                  subtitle: "Contemporary Emerald Glow",
                  tag: "Modern Festive",
                  link: "/sarees?collection=crepe",
                },
                {
                  id: "card-5",
                  image: hero.desktopImages[4] || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85",
                  title: "Master Weaver Looms",
                  subtitle: "Handcrafted Heritage Art",
                  tag: "Artisan Loom",
                  link: "/artisans",
                },
                {
                  id: "card-6",
                  image: hero.desktopImages[5] || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
                  title: "Blossom Organza Weave",
                  subtitle: "Pastel Drapes & Resham",
                  tag: "Lightweight Luxury",
                  link: "/sarees?collection=organza",
                },
                {
                  id: "card-7",
                  image: hero.desktopImages[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
                  title: "Temple Border Silk",
                  subtitle: "Pure Mulberry Weave",
                  tag: "Temple Zari",
                  link: "/sarees",
                },
                {
                  id: "card-8",
                  image: hero.desktopImages[1] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
                  title: "Chanderi Gold Motif",
                  subtitle: "Featherlight Grace",
                  tag: "Classic Weave",
                  link: "/sarees",
                },
              ];

              return (
                <section key="hero" className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-6">
                  {/* Central Headline */}
                  <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-brand-deepPlum leading-[1.12]">
                      {hero.headline}
                    </h1>
                    {hero.subheadline && (
                      <p className="text-xs sm:text-sm text-brand-deepPlum/70 font-medium max-w-xl mx-auto">
                        {hero.subheadline}
                      </p>
                    )}
                  </div>

                  {/* ----------------------------------------------------------
                      3D COVER-FLOW GALLERY SHOWCASE (Desktop & Mobile)
                     ---------------------------------------------------------- */}
                  <div className="space-y-4">
                    <Hero3DCoverFlow items={heroCards} />

                    {/* Action Pill Buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                      <Link
                        to={hero.buttonLink || "/sarees"}
                        className="px-5 py-2 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md flex items-center gap-1.5"
                      >
                        <span>{hero.buttonText}</span>
                        <span>↗</span>
                      </Link>
                      <Link
                        to="/sarees"
                          className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/15 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                        >
                          Sarees
                        </Link>
                        <Link
                          to="/sarees?collection=dresses"
                          className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/15 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                        >
                          Dresses
                        </Link>
                        <Link
                          to="/sarees?filter=sale"
                          className="px-4 py-1.5 rounded-full bg-white border border-brand-deepPlum/15 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
                        >
                          Sale
                        </Link>
                      </div>
                    </div>
                </section>
              );
            }

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
                              handleToggleSave(product.id);
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
