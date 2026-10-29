import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { 
  Save, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  Star,
  Upload,
  Palette
} from "lucide-react";
import { getHomepageContent, updateHomepageContent } from "~/db/d1.server";
import { HomepageContent, CollectionItem, TestimonialItem, HomepageSection } from "~/db/mock-data";
import { ImageUpload, processImageFile } from "~/components/ui/ImageUpload";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const content = await getHomepageContent(env);
  return json({ content });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const formData = await request.formData();
  const rawJson = formData.get("homepageJson");

  if (!rawJson || typeof rawJson !== "string") {
    return json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    const parsedData = JSON.parse(rawJson) as HomepageContent;
    const updated = await updateHomepageContent(parsedData, env);
    return json({ success: true, content: updated });
  } catch (err: any) {
    return json({ success: false, error: err.message || "Failed to parse JSON" }, { status: 400 });
  }
}

export default function AdminHomepageEditor() {
  const data = useLoaderData<typeof loader>();
  const content = (data?.content || {}) as HomepageContent;
  const fetcher = useFetcher<typeof action>();

  const [activeTab, setActiveTab] = useState<
    "order" | "hero" | "categories" | "newArrivals" | "promotion" | "artisan" | "testimonials" | "trustBadges" | "colors"
  >("order");

  // State managed as full structured config
  const [sections, setSections] = useState<HomepageSection[]>(content.sections || [
    { id: "hero", name: "Hero Showcase & Drape Gallery", enabled: true },
    { id: "trustBadges", name: "Brand Guarantees & Trust Badges", enabled: true },
    { id: "categories", name: "Shop by Category / Collections", enabled: true },
    { id: "newArrivals", name: "New Arrivals (Fresh from Loom)", enabled: true },
    { id: "promotion", name: "Festive Offer & Promo Banner", enabled: true },
    { id: "artisan", name: "Master Weavers & Artisan Heritage", enabled: true },
    { id: "testimonials", name: "Customer Testimonials & Stories", enabled: true },
  ]);

  const [hero, setHero] = useState(content.hero);
  const [categories, setCategories] = useState(content.categories);
  const [newArrivals, setNewArrivals] = useState(content.newArrivals);
  const [promotion, setPromotion] = useState(content.promotion);
  const [artisan, setArtisan] = useState(content.artisan);
  const [testimonials, setTestimonials] = useState(content.testimonials);
  const [trustBadges, setTrustBadges] = useState(content.trustBadges);

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  // Reorder Sections
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSections(updated);
  };

  const toggleSectionEnabled = (index: number) => {
    const updated = [...sections];
    updated[index].enabled = !updated[index].enabled;
    setSections(updated);
  };

  // Category Item Helpers
  const addCategoryItem = () => {
    const newItem: CollectionItem = {
      id: `cat_${Date.now()}`,
      name: "New Collection",
      count: "50+ styles",
      slug: "sarees",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    };
    setCategories({
      ...categories,
      items: [...categories.items, newItem],
    });
  };

  const removeCategoryItem = (id: string) => {
    setCategories({
      ...categories,
      items: categories.items.filter((item) => item.id !== id),
    });
  };

  const updateCategoryItem = (id: string, updates: Partial<CollectionItem>) => {
    setCategories({
      ...categories,
      items: categories.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  // Testimonial Item Helpers
  const addTestimonial = () => {
    const newT: TestimonialItem = {
      id: `test_${Date.now()}`,
      quote: "Absolutely stunning drape, authentic pure silk and beautiful craftsmanship!",
      author: "Pooja V.",
      city: "Mumbai",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    };
    setTestimonials({
      ...testimonials,
      items: [...testimonials.items, newT],
    });
  };

  const removeTestimonial = (id: string) => {
    setTestimonials({
      ...testimonials,
      items: testimonials.items.filter((item) => item.id !== id),
    });
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    setTestimonials({
      ...testimonials,
      items: testimonials.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const handleSave = () => {
    const fullPayload: HomepageContent = {
      sections,
      hero,
      categories,
      newArrivals,
      promotion,
      artisan,
      testimonials,
      trustBadges,
      // Legacy mirror
      heroTitle: hero.headline,
      heroButtonText: hero.buttonText,
      categoriesTitle: categories.title,
      newArrivalsTitle: newArrivals.title,
      festiveTitle: promotion.title,
      festiveSubtitle: promotion.subtitle,
      festiveDiscount: promotion.discountTag,
      artisanTitle: artisan.title,
      artisanDescription: artisan.description,
      reviewQuote: hero.reviewQuote,
      reviewAuthor: hero.reviewAuthor,
      reviewLocation: hero.reviewLocation,
    };

    const formData = new FormData();
    formData.append("homepageJson", JSON.stringify(fullPayload));
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header & Save Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brand-deepPlum/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-[11px] tracking-wide uppercase">
              Admin CMS
            </span>
            <span className="text-brand-deepPlum/40">•</span>
            <span className="text-xs font-semibold text-brand-deepPlum/70">Full Storefront Customizer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-deepPlum mt-1">
            Homepage Design & Layout Manager
          </h1>
          <p className="text-xs text-brand-deepPlum/70 font-medium">
            Customize images, section ordering, testimonials, promotions, and collection layouts live
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/"
            target="_blank"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 text-brand-deepPlum text-xs font-bold hover:bg-brand-ivory transition min-h-[44px]"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Publish Live Changes"}</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>All homepage sections, images, ordering, and content were updated successfully!</span>
        </div>
      )}

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-brand-deepPlum/10 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {[
          { id: "order", label: "1. Section Reordering", icon: Layers },
          { id: "hero", label: "2. Hero & Images", icon: ImageIcon },
          { id: "categories", label: "3. Collections & Layout", icon: Sparkles },
          { id: "newArrivals", label: "4. New Arrivals", icon: Layers },
          { id: "promotion", label: "5. Festive / Promotions", icon: Sparkles },
          { id: "artisan", label: "6. Artisan Story", icon: Layers },
          { id: "testimonials", label: "7. Testimonials", icon: Star },
          { id: "trustBadges", label: "8. Trust Badges", icon: CheckCircle2 },
          { id: "colors", label: "9. Brand Colors & Theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? "bg-brand-deepPlum text-white shadow-sm"
                  : "bg-white text-brand-deepPlum/70 hover:text-brand-deepPlum hover:bg-brand-ivory border border-brand-deepPlum/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: SECTION REORDERING & VISIBILITY
         ======================================================== */}
      {activeTab === "order" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-brand-deepPlum">
              Section Layout & Display Order
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium mt-0.5">
              Reorder or hide any section of your storefront. Changes reflect immediately on save.
            </p>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition space-y-3 ${
                  section.enabled
                    ? "bg-brand-ivory/60 border-brand-deepPlum/15"
                    : "bg-gray-100/60 border-gray-300 opacity-60"
                }`}
              >
                {/* Top Row: Number + Section Name + Enabled Status */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-brand-deepPlum text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-brand-deepPlum truncate">
                        {section.name}
                      </h4>
                      <span className="text-[10px] text-brand-deepPlum/60 font-semibold uppercase block truncate">
                        ID: {section.id}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Enabled Badge */}
                  <button
                    type="button"
                    onClick={() => toggleSectionEnabled(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition border shrink-0 min-h-[34px] ${
                      section.enabled
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }`}
                  >
                    {section.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Row: Reorder Up/Down + Edit Content button */}
                <div className="flex items-center justify-between pt-2 border-t border-brand-deepPlum/10">
                  <div className="flex items-center gap-1.5">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, "up")}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-30 text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span className="text-[10.5px]">Up</span>
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, "down")}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-30 text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span className="text-[10.5px]">Down</span>
                    </button>
                  </div>

                  {/* Quick Edit Link */}
                  <button
                    type="button"
                    onClick={() => setActiveTab(section.id as any)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-deepPlum/10 text-brand-deepPlum text-xs font-bold hover:bg-brand-deepPlum hover:text-white transition min-h-[36px] flex items-center gap-1"
                  >
                    <span>Edit Content</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: HERO SECTION & IMAGES
         ======================================================== */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
          <div className="border-b border-brand-deepPlum/10 pb-4">
            <h3 className="font-bold text-base text-brand-deepPlum">
              Hero Section & Showcase Images
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Update central typography, desktop 5-image gallery, and mobile hero visuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={hero.headline}
                onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Hero Subheadline / Note
              </label>
              <input
                type="text"
                value={hero.subheadline || ""}
                onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={hero.buttonText}
                onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Rotating Artisan Badge Text
              </label>
              <input
                type="text"
                value={hero.badgeText}
                onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
              />
            </div>
          </div>

          {/* Desktop Images Editor (5 Images) */}
          <div className="space-y-3 pt-4 border-t border-brand-deepPlum/10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum">
                Desktop 5-Column Gallery Images
              </h4>
              <p className="text-[11px] text-brand-deepPlum/60">
                Upload photos directly from your computer for each column of the desktop gallery
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {hero.desktopImages.map((imgUrl, i) => (
                <div key={i} className="p-3 rounded-2xl bg-brand-ivory/50 border border-brand-deepPlum/15 space-y-2 flex flex-col justify-between">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white relative border border-brand-deepPlum/10 shadow-2xs group">
                    <img src={imgUrl} alt={`Col ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                      Column {i + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-2 rounded-xl bg-brand-deepPlum text-white text-[11px] font-bold cursor-pointer hover:bg-brand-plum transition shadow-xs">
                      <Upload className="w-3 h-3 text-brand-lilac" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const dataUrl = await processImageFile(e.target.files[0]);
                            const updated = [...hero.desktopImages];
                            updated[i] = dataUrl;
                            setHero({ ...hero, desktopImages: updated });
                          }
                        }}
                      />
                    </label>

                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => {
                        const updated = [...hero.desktopImages];
                        updated[i] = e.target.value;
                        setHero({ ...hero, desktopImages: updated });
                      }}
                      placeholder="Or paste link..."
                      className="w-full px-2 py-1 rounded-lg border border-brand-deepPlum/20 text-[9px] text-brand-deepPlum font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Hero Images (2 Images) */}
          <div className="space-y-3 pt-4 border-t border-brand-deepPlum/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum">
              Mobile 2-Card Notched Images (Page 11 Design)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hero.mobileImages.map((imgUrl, i) => (
                <div key={i} className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-deepPlum/15">
                  <ImageUpload
                    value={imgUrl}
                    onChange={(newVal) => {
                      const updated = [...hero.mobileImages];
                      updated[i] = newVal;
                      setHero({ ...hero, mobileImages: updated });
                    }}
                    label={`Mobile Notched Card ${i + 1}`}
                    aspectRatio="portrait"
                    helpText="Upload a portrait photo for the mobile hero card"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Review Strip */}
          <div className="space-y-3 pt-4 border-t border-brand-deepPlum/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum">
              Hero Bottom Social Proof Strip
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                  Customer Quote
                </label>
                <input
                  type="text"
                  value={hero.reviewQuote}
                  onChange={(e) => setHero({ ...hero, reviewQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                  Author & City
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={hero.reviewAuthor}
                    onChange={(e) => setHero({ ...hero, reviewAuthor: e.target.value })}
                    placeholder="Name"
                    className="w-full px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={hero.reviewLocation}
                    onChange={(e) => setHero({ ...hero, reviewLocation: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: COLLECTIONS / CATEGORIES & LAYOUT
         ======================================================== */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-deepPlum/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-brand-deepPlum">
                Collections & Categories Manager
              </h3>
              <p className="text-xs text-brand-deepPlum/70 font-medium">
                Customize collection titles, layouts, image URLs, and navigation targets
              </p>
            </div>
            <button
              type="button"
              onClick={addCategoryItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={categories.title}
                onChange={(e) => setCategories({ ...categories, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={categories.subtitle}
                onChange={(e) => setCategories({ ...categories, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Layout Style
              </label>
              <select
                value={categories.layout}
                onChange={(e) => setCategories({ ...categories, layout: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum bg-white"
              >
                <option value="grid">Standard 4-Column Grid</option>
                <option value="notched">Notched Luxury Drapes</option>
                <option value="cards">Editorial Landscape Cards</option>
              </select>
            </div>
          </div>

          {/* Collection Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {categories.items.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-deepPlum/15 space-y-3 relative group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white relative border border-brand-deepPlum/10">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeCategoryItem(cat.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm opacity-90"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategoryItem(cat.id, { name: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                      Styles Count Label
                    </label>
                    <input
                      type="text"
                      value={cat.count}
                      onChange={(e) => updateCategoryItem(cat.id, { count: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                      Filter Slug
                    </label>
                    <input
                      type="text"
                      value={cat.slug}
                      onChange={(e) => updateCategoryItem(cat.id, { slug: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                    />
                  </div>

                  <div className="pt-1">
                    <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-2 rounded-xl bg-brand-deepPlum text-white text-[11px] font-bold cursor-pointer hover:bg-brand-plum transition shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-brand-lilac" />
                      <span>Upload Card Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const dataUrl = await processImageFile(e.target.files[0]);
                            updateCategoryItem(cat.id, { image: dataUrl });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: NEW ARRIVALS
         ======================================================== */}
      {activeTab === "newArrivals" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="border-b border-brand-deepPlum/10 pb-4">
            <h3 className="font-bold text-base text-brand-deepPlum">
              New Arrivals Showcase Settings
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Products are sourced directly from inventory and 100% clickable to Product Details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={newArrivals.title}
                onChange={(e) => setNewArrivals({ ...newArrivals, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={newArrivals.subtitle}
                onChange={(e) => setNewArrivals({ ...newArrivals, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                View All Link Text
              </label>
              <input
                type="text"
                value={newArrivals.viewAllText}
                onChange={(e) => setNewArrivals({ ...newArrivals, viewAllText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Max Products Displayed
              </label>
              <select
                value={newArrivals.productLimit}
                onChange={(e) => setNewArrivals({ ...newArrivals, productLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum bg-white"
              >
                <option value={4}>4 Sarees (1 row)</option>
                <option value={8}>8 Sarees (2 rows)</option>
                <option value={12}>12 Sarees (3 rows)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: FESTIVE / PROMOTIONS
         ======================================================== */}
      {activeTab === "promotion" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
          <div className="border-b border-brand-deepPlum/10 pb-4">
            <h3 className="font-bold text-base text-brand-deepPlum">
              Festive Edit Promotion Banner
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Manage highlight discount campaigns, promo codes, and luxury banner imagery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Banner Headline
              </label>
              <input
                type="text"
                value={promotion.title}
                onChange={(e) => setPromotion({ ...promotion, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Discount Tag Badge
              </label>
              <input
                type="text"
                value={promotion.discountTag}
                onChange={(e) => setPromotion({ ...promotion, discountTag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Banner Description
              </label>
              <textarea
                rows={2}
                value={promotion.subtitle}
                onChange={(e) => setPromotion({ ...promotion, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={promotion.couponCode}
                onChange={(e) => setPromotion({ ...promotion, couponCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={promotion.buttonText}
                onChange={(e) => setPromotion({ ...promotion, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <ImageUpload
                value={promotion.image}
                onChange={(img) => setPromotion({ ...promotion, image: img })}
                label="Promotion Banner Graphic"
                aspectRatio="landscape"
                helpText="Upload a photo from your computer for the festive sale banner"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: ARTISAN STORY
         ======================================================== */}
      {activeTab === "artisan" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="border-b border-brand-deepPlum/10 pb-4">
            <h3 className="font-bold text-base text-brand-deepPlum">
              Master Weavers & Artisan Heritage Section
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Honor centuries of handloom heritage with storytelling and direct concierge assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Headline
              </label>
              <input
                type="text"
                value={artisan.title}
                onChange={(e) => setArtisan({ ...artisan, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={artisan.buttonText}
                onChange={(e) => setArtisan({ ...artisan, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Story Description
              </label>
              <textarea
                rows={3}
                value={artisan.description}
                onChange={(e) => setArtisan({ ...artisan, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <ImageUpload
                value={artisan.image}
                onChange={(img) => setArtisan({ ...artisan, image: img })}
                label="Artisan / Master Weaver Photo"
                aspectRatio="banner"
                helpText="Upload a photo of artisans at loom for the story section"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: TESTIMONIALS
         ======================================================== */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-deepPlum/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-brand-deepPlum">
                Customer Testimonials & Reviews
              </h3>
              <p className="text-xs text-brand-deepPlum/70 font-medium">
                Add, edit, or remove customer experiences and real ratings
              </p>
            </div>
            <button
              type="button"
              onClick={addTestimonial}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={testimonials.title}
                onChange={(e) => setTestimonials({ ...testimonials, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={testimonials.subtitle}
                onChange={(e) => setTestimonials({ ...testimonials, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {testimonials.items.map((t, idx) => (
              <div
                key={t.id || idx}
                className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-deepPlum/15 space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => removeTestimonial(t.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm opacity-80"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 border border-brand-deepPlum/20">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-brand-lilac text-brand-deepPlum">
                        {t.author.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-deepPlum block">Review #{idx + 1}</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                      Quote
                    </label>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                        Author
                      </label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => updateTestimonial(t.id, { author: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                        City
                      </label>
                      <input
                        type="text"
                        value={t.city}
                        onChange={(e) => updateTestimonial(t.id, { city: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                      Customer Avatar Photo
                    </label>
                    <label className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg bg-brand-deepPlum text-white text-[11px] font-bold cursor-pointer hover:bg-brand-plum transition shadow-xs">
                      <Upload className="w-3 h-3 text-brand-lilac" />
                      <span>Upload Avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const dataUrl = await processImageFile(e.target.files[0], 200);
                            updateTestimonial(t.id, { avatar: dataUrl });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: TRUST BADGES
         ======================================================== */}
      {activeTab === "trustBadges" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="border-b border-brand-deepPlum/10 pb-4">
            <h3 className="font-bold text-base text-brand-deepPlum">
              Brand Guarantees & Trust Badges
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Highlighted credentials displayed directly beneath hero or in your customized layout
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustBadges.items.map((badge, idx) => (
              <div key={badge.id || idx} className="p-4 rounded-2xl bg-brand-ivory/50 border border-brand-deepPlum/15 space-y-2">
                <span className="text-xs font-bold text-brand-plum">Badge #{idx + 1}</span>
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => {
                      const updated = [...trustBadges.items];
                      updated[idx].title = e.target.value;
                      setTrustBadges({ ...trustBadges, items: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={badge.description}
                    onChange={(e) => {
                      const updated = [...trustBadges.items];
                      updated[idx].description = e.target.value;
                      setTrustBadges({ ...trustBadges, items: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 9: BRAND COLORS & THEME
         ======================================================== */}
      {activeTab === "colors" && (
        <div className="bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-deepPlum/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-plum/10 text-brand-plum flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-deepPlum">
                Storefront Brand & Theme Palette
              </h3>
              <p className="text-xs text-brand-deepPlum/70 font-medium">
                Customize primary plum, buttons, canvas ivory, and zari gold accents
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-4">
            <p className="text-xs text-brand-deepPlum/80 leading-relaxed font-medium">
              You can customize the store's full color palette (Primary Plum, Deep Plum, Ivory Canvas, Zari Gold, Lilac, and Blush) with real-time color pickers and curated luxury schemes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/admin/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md"
              >
                <Palette className="w-4 h-4 text-brand-lilac" />
                <span>Open Theme Colors Editor in Settings →</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
