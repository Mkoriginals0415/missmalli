import { useState } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, useNavigation, Form } from "@remix-run/react";
import { 
  Globe, 
  Search, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ExternalLink,
  Laptop,
  Smartphone,
  Layers,
  FileText,
  KeyRound,
  Check,
  Sparkles
} from "lucide-react";
import { requireAdmin } from "~/utils/auth.server";
import { getSeoSettings, updateSeoSettings, GlobalSeoSettings, DEFAULT_SEO_SETTINGS } from "~/utils/seo.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const env = (context as any)?.cloudflare?.env;
  const seo = await getSeoSettings(env);
  return json({ seo });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAdmin(request);
  const env = (context as any)?.cloudflare?.env;
  const formData = await request.formData();
  const rawPayload = formData.get("seo_payload");

  if (typeof rawPayload === "string") {
    try {
      const parsed = JSON.parse(rawPayload);
      const updated = await updateSeoSettings(parsed, env);
      return json({ success: true, updated, message: "SEO configurations updated successfully!" });
    } catch (e: any) {
      return json({ success: false, error: e.message || "Failed to parse SEO payload" }, { status: 400 });
    }
  }

  return json({ success: false, error: "Missing payload" }, { status: 400 });
}

export default function AdminSeoPage() {
  const { seo: initialSeo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const [activeTab, setActiveTab] = useState<"global" | "pages" | "categories" | "webmaster">("global");
  const [selectedPageKey, setSelectedPageKey] = useState<string>("home");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("silk");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const [seo, setSeo] = useState<GlobalSeoSettings>(initialSeo);

  // Compute live completeness score
  const computeCompletenessScore = () => {
    let score = 0;
    if (seo.siteTitle?.length > 10) score += 20;
    if (seo.defaultDescription?.length >= 80 && seo.defaultDescription?.length <= 160) score += 25;
    else if (seo.defaultDescription?.length > 0) score += 15;
    if (seo.defaultOgImage?.startsWith("http")) score += 20;
    if (seo.canonicalDomain?.startsWith("http")) score += 15;
    if (seo.googleSiteVerification || seo.bingSiteVerification) score += 10;
    if (seo.robotsIndexing === "all") score += 10;
    return Math.min(100, score);
  };

  const completenessScore = computeCompletenessScore();

  // Active page preview values
  const activePageSeo = seo.pages[selectedPageKey] || {
    title: seo.siteTitle,
    description: seo.defaultDescription,
  };

  const activeTitle = activePageSeo.title || seo.siteTitle;
  const activeDesc = activePageSeo.description || seo.defaultDescription;
  const activeUrl = `${seo.canonicalDomain || "https://missmalli.in"}${
    selectedPageKey === "home" ? "" : `/${selectedPageKey}`
  }`;
  const activeOgImage = activePageSeo.ogImage || seo.defaultOgImage || "/brand/logo.png";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-lilac/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-deepPlum">
              SEO & Search Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum text-[10px] font-bold uppercase tracking-wider">
              Production Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-deepPlum/70 mt-1">
            Configure global search indexing, meta descriptions, social sharing cards, and webmaster verification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-deepPlum/15 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
          >
            <span>View XML Sitemap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-deepPlum/15 text-xs font-semibold text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition shadow-2xs"
          >
            <span>View Robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionData?.success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              {actionData.message || "SEO configurations saved and applied!"}
            </span>
          </div>
          <span className="text-xs text-emerald-700 bg-white/70 px-2.5 py-0.5 rounded-full">
            D1 Persisted
          </span>
        </div>
      )}

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-brand-lilac/30 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("global")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "global"
                  ? "bg-brand-deepPlum text-white shadow-xs"
                  : "text-brand-deepPlum/70 hover:text-brand-deepPlum"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("pages")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "pages"
                  ? "bg-brand-deepPlum text-white shadow-xs"
                  : "text-brand-deepPlum/70 hover:text-brand-deepPlum"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Page-Level SEO</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "categories"
                  ? "bg-brand-deepPlum text-white shadow-xs"
                  : "text-brand-deepPlum/70 hover:text-brand-deepPlum"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories & Collections</span>
            </button>

            <button
              onClick={() => setActiveTab("webmaster")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "webmaster"
                  ? "bg-brand-deepPlum text-white shadow-xs"
                  : "text-brand-deepPlum/70 hover:text-brand-deepPlum"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Webmaster & GA4</span>
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-brand-lilac/30 shadow-xs space-y-6">
            {/* 1. GLOBAL SEO TAB */}
            {activeTab === "global" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-deepPlum">
                    Global Brand Metadata
                  </h3>
                  <p className="text-xs text-brand-deepPlum/60">
                    Default values used across the site when a page lacks explicit overrides.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Website SEO Title
                    </label>
                    <input
                      type="text"
                      value={seo.siteTitle}
                      onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      placeholder="e.g. Miss Malli | Made for Her Moments"
                    />
                    <div className="flex justify-between items-center text-[11px] text-brand-deepPlum/50 mt-1">
                      <span>Appears in Google tab and search snippets</span>
                      <span className={seo.siteTitle.length > 60 ? "text-amber-600 font-bold" : ""}>
                        {seo.siteTitle.length} / 60 chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Default Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seo.defaultDescription}
                      onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      placeholder="Short editorial summary for search engines..."
                    />
                    <div className="flex justify-between items-center text-[11px] text-brand-deepPlum/50 mt-1">
                      <span>Recommended: 120–160 characters</span>
                      <span
                        className={
                          seo.defaultDescription.length < 80 || seo.defaultDescription.length > 160
                            ? "text-amber-600 font-bold"
                            : "text-emerald-600 font-bold"
                        }
                      >
                        {seo.defaultDescription.length} / 160 chars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                        Canonical Domain URL
                      </label>
                      <input
                        type="url"
                        value={seo.canonicalDomain}
                        onChange={(e) => setSeo({ ...seo, canonicalDomain: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                        placeholder="https://missmalli.in"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                        Search Engine Indexing
                      </label>
                      <select
                        value={seo.robotsIndexing}
                        onChange={(e) => setSeo({ ...seo, robotsIndexing: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      >
                        <option value="all">Index & Follow (Public Crawling Allowed)</option>
                        <option value="noindex">Noindex, Nofollow (Block All Crawlers)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Default Social Share Image (OG Image)
                    </label>
                    <input
                      type="url"
                      value={seo.defaultOgImage}
                      onChange={(e) => setSeo({ ...seo, defaultOgImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      placeholder="https://missmalli.in/brand/logo.png"
                    />
                    <p className="text-[11px] text-brand-deepPlum/50 mt-1">
                      Shown when sharing links on WhatsApp, iMessage, and Facebook (1200×630 recommended).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PAGE-LEVEL SEO TAB */}
            {activeTab === "pages" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-deepPlum">
                    Page-Specific Overrides
                  </h3>
                  <p className="text-xs text-brand-deepPlum/60">
                    Select a page to customize its unique title, description, and preview cards.
                  </p>
                </div>

                {/* Page Selector Pill Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {[
                    { key: "home", label: "Home (/)" },
                    { key: "sarees", label: "Sarees (/sarees)" },
                    { key: "dresses", label: "Dresses (/dresses)" },
                    { key: "collections", label: "Collections (/exclusive)" },
                    { key: "sale", label: "Sale (/sale)" },
                    { key: "artisans", label: "Artisans (/artisans)" },
                    { key: "info", label: "Info & FAQs (/info)" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setSelectedPageKey(p.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                        selectedPageKey === p.key
                          ? "bg-brand-plum text-white shadow-xs"
                          : "bg-brand-ivory border border-brand-deepPlum/10 text-brand-deepPlum hover:bg-brand-plum/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Page SEO Title
                    </label>
                    <input
                      type="text"
                      value={seo.pages[selectedPageKey]?.title || ""}
                      onChange={(e) => {
                        const nextPages = {
                          ...seo.pages,
                          [selectedPageKey]: {
                            ...(seo.pages[selectedPageKey] || {}),
                            title: e.target.value,
                          },
                        };
                        setSeo({ ...seo, pages: nextPages });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      placeholder="e.g. Pure Silk Sarees | Miss Malli"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Page Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seo.pages[selectedPageKey]?.description || ""}
                      onChange={(e) => {
                        const nextPages = {
                          ...seo.pages,
                          [selectedPageKey]: {
                            ...(seo.pages[selectedPageKey] || {}),
                            description: e.target.value,
                          },
                        };
                        setSeo({ ...seo, pages: nextPages });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-hidden"
                      placeholder="Targeted description for this specific route..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                        Canonical URL Override (Optional)
                      </label>
                      <input
                        type="url"
                        value={seo.pages[selectedPageKey]?.canonicalUrl || ""}
                        onChange={(e) => {
                          const nextPages = {
                            ...seo.pages,
                            [selectedPageKey]: {
                              ...(seo.pages[selectedPageKey] || {}),
                              canonicalUrl: e.target.value,
                            },
                          };
                          setSeo({ ...seo, pages: nextPages });
                        }}
                        className="w-full px-4 py-2 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs text-brand-deepPlum outline-hidden"
                        placeholder="Leave empty to use default route URL"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                        Social Share Image Override (Optional)
                      </label>
                      <input
                        type="url"
                        value={seo.pages[selectedPageKey]?.ogImage || ""}
                        onChange={(e) => {
                          const nextPages = {
                            ...seo.pages,
                            [selectedPageKey]: {
                              ...(seo.pages[selectedPageKey] || {}),
                              ogImage: e.target.value,
                            },
                          };
                          setSeo({ ...seo, pages: nextPages });
                        }}
                        className="w-full px-4 py-2 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs text-brand-deepPlum outline-hidden"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CATEGORIES & COLLECTIONS TAB */}
            {activeTab === "categories" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-deepPlum">
                    Category & Collection SEO
                  </h3>
                  <p className="text-xs text-brand-deepPlum/60">
                    Fine-tune search appearance for saree fabric collections and seasonal drops.
                  </p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {[
                    { key: "silk", label: "Silk Sarees" },
                    { key: "georgette", label: "Georgette" },
                    { key: "organza", label: "Organza" },
                  ].map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setSelectedCategoryKey(c.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                        selectedCategoryKey === c.key
                          ? "bg-brand-plum text-white shadow-xs"
                          : "bg-brand-ivory border border-brand-deepPlum/10 text-brand-deepPlum hover:bg-brand-plum/10"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Collection SEO Title
                    </label>
                    <input
                      type="text"
                      value={seo.categorySeo[selectedCategoryKey]?.title || ""}
                      onChange={(e) => {
                        const nextCat = {
                          ...seo.categorySeo,
                          [selectedCategoryKey]: {
                            ...(seo.categorySeo[selectedCategoryKey] || {}),
                            title: e.target.value,
                          },
                        };
                        setSeo({ ...seo, categorySeo: nextCat });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum outline-hidden"
                      placeholder="e.g. Handcrafted Pure Silk Sarees | Miss Malli"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Collection Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seo.categorySeo[selectedCategoryKey]?.description || ""}
                      onChange={(e) => {
                        const nextCat = {
                          ...seo.categorySeo,
                          [selectedCategoryKey]: {
                            ...(seo.categorySeo[selectedCategoryKey] || {}),
                            description: e.target.value,
                          },
                        };
                        setSeo({ ...seo, categorySeo: nextCat });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs sm:text-sm text-brand-deepPlum outline-hidden"
                      placeholder="Describe the fabric weave and craft details..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. WEBMASTER & GA4 TAB */}
            {activeTab === "webmaster" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-deepPlum">
                    Search Engine Integration & Verification
                  </h3>
                  <p className="text-xs text-brand-deepPlum/60">
                    Connect webmaster tools to monitor search crawling, rankings, and traffic.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Google Search Console Verification Tag
                    </label>
                    <input
                      type="text"
                      value={seo.googleSiteVerification || ""}
                      onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs font-mono text-brand-deepPlum outline-hidden"
                      placeholder='e.g. "a1b2c3d4e5f6g7h8"'
                    />
                    <p className="text-[11px] text-brand-deepPlum/50 mt-1">
                      Enter the content code from your Google Search Console HTML tag.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Bing Webmaster Tools Code
                    </label>
                    <input
                      type="text"
                      value={seo.bingSiteVerification || ""}
                      onChange={(e) => setSeo({ ...seo, bingSiteVerification: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs font-mono text-brand-deepPlum outline-hidden"
                      placeholder="e.g. Bing validation string"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-deepPlum mb-1">
                      Google Analytics 4 (GA4) Measurement ID
                    </label>
                    <input
                      type="text"
                      value={seo.ga4MeasurementId || ""}
                      onChange={(e) => setSeo({ ...seo, ga4MeasurementId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 bg-brand-ivory/30 text-xs font-mono text-brand-deepPlum outline-hidden"
                      placeholder="G-XXXXXXXXXX"
                    />
                    <p className="text-[11px] text-brand-deepPlum/50 mt-1">
                      When provided, the lightweight gtag.js tracking snippet is automatically included.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Form */}
            <Form method="post" className="pt-4 border-t border-brand-lilac/30 flex items-center justify-between">
              <input type="hidden" name="seo_payload" value={JSON.stringify(seo)} />

              <div className="flex items-center gap-2 text-xs text-brand-deepPlum/60">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Changes will take effect instantly across all routes</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum active:scale-95 transition shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving to Cloudflare D1...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All SEO Settings</span>
                  </>
                )}
              </button>
            </Form>
          </div>
        </div>

        {/* Right Column: Live Previews & Health Score (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SEO Health & Completeness Meter */}
          <div className="p-6 rounded-[24px] bg-white border border-brand-lilac/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-brand-deepPlum text-sm sm:text-base">
                  SEO Completeness Score
                </h4>
                <p className="text-[11px] text-brand-deepPlum/60">
                  Adherence to search engine metadata guidelines
                </p>
              </div>
              <span className="font-serif text-2xl font-bold text-brand-plum">
                {completenessScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-brand-ivory overflow-hidden border border-brand-lilac/30">
              <div
                className="h-full bg-gradient-to-r from-brand-plum to-emerald-500 transition-all duration-500"
                style={{ width: `${completenessScore}%` }}
              />
            </div>

            <p className="text-[10px] text-brand-deepPlum/50 italic">
              * Note: Completeness score reflects technical metadata readiness and does not guarantee specific organic ranking.
            </p>
          </div>

          {/* Interactive Google SERP Preview Card */}
          <div className="p-6 rounded-[24px] bg-white border border-brand-lilac/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-brand-lilac/20">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-plum" />
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-brand-deepPlum">
                  Google Search Snippet Preview
                </h4>
              </div>

              <div className="flex items-center gap-1 bg-brand-ivory p-0.5 rounded-lg border border-brand-deepPlum/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-md ${
                    previewDevice === "desktop" ? "bg-white text-brand-plum shadow-2xs" : "text-brand-deepPlum/50"
                  }`}
                  title="Desktop View"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-md ${
                    previewDevice === "mobile" ? "bg-white text-brand-plum shadow-2xs" : "text-brand-deepPlum/50"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google Result Card Simulation */}
            <div
              className={`p-4 rounded-xl border border-gray-200 bg-white space-y-1 ${
                previewDevice === "mobile" ? "max-w-[340px] mx-auto text-xs" : "text-sm"
              }`}
            >
              {/* URL & Favicon Line */}
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <img src="/brand/favicon.png" alt="Favicon" className="w-4 h-4 rounded-full" />
                <div className="flex flex-col leading-none">
                  <span className="font-medium text-[12px]">Miss Malli</span>
                  <span className="text-[11px] text-[#4d5156] truncate">{activeUrl}</span>
                </div>
              </div>

              {/* Title Line (Google Blue) */}
              <div className="pt-1">
                <span className="text-[#1a0dab] hover:underline cursor-pointer font-medium text-base line-clamp-1 leading-snug">
                  {activeTitle}
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                {activeDesc}
              </p>
            </div>
          </div>

          {/* WhatsApp / Social Share Card Preview */}
          <div className="p-6 rounded-[24px] bg-white border border-brand-lilac/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-lilac/20">
              <Share2 className="w-4 h-4 text-brand-plum" />
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-brand-deepPlum">
                Social Card Preview (WhatsApp / Meta)
              </h4>
            </div>

            {/* Card Mockup */}
            <div className="rounded-xl overflow-hidden border border-brand-lilac/30 bg-brand-ivory/50">
              <div className="aspect-[1.91/1] w-full bg-brand-deepPlum/10 relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeOgImage}
                  alt={activeTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1 bg-white">
                <span className="text-[10px] tracking-wider uppercase text-brand-deepPlum/50 font-bold block">
                  MISSMALLI.IN
                </span>
                <h5 className="font-bold text-xs text-brand-deepPlum line-clamp-1">
                  {activeTitle}
                </h5>
                <p className="text-[11px] text-brand-deepPlum/70 line-clamp-2 leading-relaxed">
                  {activeDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
