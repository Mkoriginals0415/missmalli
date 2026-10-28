import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { Save, CheckCircle2, LayoutTemplate } from "lucide-react";
import { getHomepageContent, updateHomepageContent } from "~/db/d1.server";
import { HomepageContent } from "~/db/mock-data";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const content = await getHomepageContent(env);
  return json({ content });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const formData = await request.formData();

  const updates: Partial<HomepageContent> = {
    heroTitle: String(formData.get("heroTitle") || ""),
    heroButtonText: String(formData.get("heroButtonText") || ""),
    categoriesTitle: String(formData.get("categoriesTitle") || ""),
    newArrivalsTitle: String(formData.get("newArrivalsTitle") || ""),
    festiveTitle: String(formData.get("festiveTitle") || ""),
    festiveSubtitle: String(formData.get("festiveSubtitle") || ""),
    festiveDiscount: String(formData.get("festiveDiscount") || ""),
    artisanTitle: String(formData.get("artisanTitle") || ""),
    artisanDescription: String(formData.get("artisanDescription") || ""),
    reviewQuote: String(formData.get("reviewQuote") || ""),
    reviewAuthor: String(formData.get("reviewAuthor") || ""),
    reviewLocation: String(formData.get("reviewLocation") || ""),
  };

  const updated = await updateHomepageContent(updates, env);
  return json({ success: true, content: updated });
}

export default function AdminHomepageEditor() {
  const { content } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroButtonText, setHeroButtonText] = useState(content.heroButtonText);
  const [categoriesTitle, setCategoriesTitle] = useState(content.categoriesTitle);
  const [newArrivalsTitle, setNewArrivalsTitle] = useState(content.newArrivalsTitle);
  const [festiveTitle, setFestiveTitle] = useState(content.festiveTitle);
  const [festiveSubtitle, setFestiveSubtitle] = useState(content.festiveSubtitle);
  const [festiveDiscount, setFestiveDiscount] = useState(content.festiveDiscount);
  const [artisanTitle, setArtisanTitle] = useState(content.artisanTitle);
  const [artisanDescription, setArtisanDescription] = useState(content.artisanDescription);
  const [reviewQuote, setReviewQuote] = useState(content.reviewQuote);
  const [reviewAuthor, setReviewAuthor] = useState(content.reviewAuthor);
  const [reviewLocation, setReviewLocation] = useState(content.reviewLocation);

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  return (
    <fetcher.Form method="post" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-deepPlum">
            Homepage Content Editor
          </h1>
          <p className="text-xs text-brand-deepPlum/70 font-medium">
            Customize all headlines, promotion banners, and stories live on the store
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Homepage Content"}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Homepage content updated successfully and published live!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Hero Section Box */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-brand-deepPlum border-b border-brand-deepPlum/10 pb-2">
            1. Hero Section
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Main Headline
            </label>
            <input
              type="text"
              name="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              name="heroButtonText"
              value={heroButtonText}
              onChange={(e) => setHeroButtonText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
            />
          </div>
        </div>

        {/* 2. Review Quote Strip */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-brand-deepPlum border-b border-brand-deepPlum/10 pb-2">
            2. Customer Review Strip (Hero)
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Quote Text
            </label>
            <textarea
              rows={2}
              name="reviewQuote"
              value={reviewQuote}
              onChange={(e) => setReviewQuote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-medium focus:ring-1 focus:ring-brand-plum"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">Author Name</label>
              <input
                type="text"
                name="reviewAuthor"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">Location</label>
              <input
                type="text"
                name="reviewLocation"
                value={reviewLocation}
                onChange={(e) => setReviewLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum"
              />
            </div>
          </div>
        </div>

        {/* 3. Section Titles */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-brand-deepPlum border-b border-brand-deepPlum/10 pb-2">
            3. Collection Section Titles
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Categories Section Title
            </label>
            <input
              type="text"
              name="categoriesTitle"
              value={categoriesTitle}
              onChange={(e) => setCategoriesTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              New Arrivals Section Title
            </label>
            <input
              type="text"
              name="newArrivalsTitle"
              value={newArrivalsTitle}
              onChange={(e) => setNewArrivalsTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
            />
          </div>
        </div>

        {/* 4. Festive Edit Promotion Banner */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-brand-deepPlum border-b border-brand-deepPlum/10 pb-2">
            4. Festive Promotion Banner
          </h3>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Offer Badge Tag
            </label>
            <input
              type="text"
              name="festiveDiscount"
              value={festiveDiscount}
              onChange={(e) => setFestiveDiscount(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Banner Headline
            </label>
            <input
              type="text"
              name="festiveTitle"
              value={festiveTitle}
              onChange={(e) => setFestiveTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Banner Subtitle / Description
            </label>
            <textarea
              rows={2}
              name="festiveSubtitle"
              value={festiveSubtitle}
              onChange={(e) => setFestiveSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum"
            />
          </div>
        </div>

        {/* 5. Our Artisans Feature */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm text-brand-deepPlum border-b border-brand-deepPlum/10 pb-2">
            5. Our Artisans Feature Section
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Artisan Section Title
              </label>
              <input
                type="text"
                name="artisanTitle"
                value={artisanTitle}
                onChange={(e) => setArtisanTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Artisan Description
              </label>
              <textarea
                rows={2}
                name="artisanDescription"
                value={artisanDescription}
                onChange={(e) => setArtisanDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum"
              />
            </div>
          </div>
        </div>
      </div>
    </fetcher.Form>
  );
}
