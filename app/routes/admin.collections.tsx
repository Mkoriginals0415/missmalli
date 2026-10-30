import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  Edit2,
  X,
  Sparkles,
  Layers
} from "lucide-react";
import { getHomepageContent, updateHomepageContent } from "~/db/d1.server";
import { HomepageContent, CollectionItem, HomepageSection } from "~/db/mock-data";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { requireAdmin } from "~/utils/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const env = (context as any)?.cloudflare?.env;
  const content = await getHomepageContent(env);
  return json({ content });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAdmin(request);
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
    return json({ success: false, error: err.message || "Failed to update" }, { status: 400 });
  }
}

export default function AdminCollectionsPage() {
  const data = useLoaderData<typeof loader>();
  const content = (data?.content || {}) as HomepageContent;
  const fetcher = useFetcher<typeof action>();

  const defaultCategories = {
    title: "Find Your Drape",
    subtitle: "Explore our signature weaves categorized for every milestone",
    layout: "grid" as const,
    items: [],
  };
  const [categories, setCategories] = useState(
    content.categories?.items ? content.categories : defaultCategories
  );
  const [sections, setSections] = useState<HomepageSection[]>(content.sections || []);
  const [promotion, setPromotion] = useState(content.promotion || ({} as any));

  // Edit Collection Modal/Drawer State
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionCount, setNewCollectionCount] = useState("50+ styles");
  const [newCollectionSlug, setNewCollectionSlug] = useState("");
  const [newCollectionImage, setNewCollectionImage] = useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
  );

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  // Toggle collection onHome status
  const toggleCollectionOnHome = (id: string) => {
    const updatedItems = categories.items.map((item) => {
      if (item.id === id) {
        const nextState = item.onHome === false ? true : false;
        return { ...item, onHome: nextState };
      }
      return item;
    });
    setCategories({ ...categories, items: updatedItems });
  };

  // Move Collection Up / Down
  const moveCollection = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.items.length) return;

    const items = [...categories.items];
    const [moved] = items.splice(idx, 1);
    items.splice(targetIdx, 0, moved);
    setCategories({ ...categories, items });
  };

  // Delete Collection
  const deleteCollection = (id: string) => {
    setCategories({
      ...categories,
      items: categories.items.filter((c) => c.id !== id),
    });
  };

  // Add New Collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const slug = newCollectionSlug.trim() || newCollectionName.toLowerCase().replace(/\s+/g, "-");
    const newItem: CollectionItem = {
      id: `cat_${Date.now()}`,
      name: newCollectionName.trim(),
      count: newCollectionCount.trim() || "40+ styles",
      slug,
      image: newCollectionImage.trim(),
      onHome: true,
    };

    setCategories({
      ...categories,
      items: [...categories.items, newItem],
    });

    setNewCollectionName("");
    setNewCollectionSlug("");
    setIsAddingNew(false);
  };

  // Save Editing Collection
  const handleUpdateEditingCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setCategories({
      ...categories,
      items: categories.items.map((c) => (c.id === editingItem.id ? editingItem : c)),
    });
    setEditingItem(null);
  };

  // Move Homepage Section Up / Down
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

  // Global Save
  const handleSaveAll = () => {
    const fullPayload: HomepageContent = {
      ...content,
      sections,
      categories,
      promotion,
      categoriesTitle: categories.title,
      festiveTitle: promotion.title,
      festiveSubtitle: promotion.subtitle,
      festiveDiscount: promotion.discountTag,
    };

    const formData = new FormData();
    formData.append("homepageJson", JSON.stringify(fullPayload));
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Header & Save Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brand-deepPlum/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-[11px] tracking-wide uppercase">
              Admin Manager
            </span>
            <span className="text-brand-deepPlum/40">•</span>
            <span className="text-xs font-semibold text-brand-deepPlum/70">Storefront Curator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-deepPlum mt-1">
            Collections, Promotions & Layout Order
          </h1>
          <p className="text-xs text-brand-deepPlum/70 font-medium">
            Curate homepage category visibility, promotional offers, and section display order live
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
            onClick={handleSaveAll}
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
          <span>All collections, promotions, and section ordering were saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Collections Manager (Left) + Promotions & Offers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ========================================================
            COLLECTIONS MANAGER
           ======================================================== */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-deepPlum/10">
            <div>
              <h3 className="font-bold text-base text-brand-deepPlum">Collections</h3>
              <p className="text-[11px] text-brand-deepPlum/70">
                Toggle visibility on homepage or reorder display sequence
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Collection</span>
            </button>
          </div>

          {/* Add New Collection Form Modal/Inline */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateCollection}
              className="p-4 rounded-2xl bg-brand-ivory border border-brand-deepPlum/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-deepPlum">Add New Collection</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="p-1 rounded-lg text-brand-deepPlum/60 hover:text-brand-deepPlum"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Georgette Sarees"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                    Count Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 60+ styles"
                    value={newCollectionCount}
                    onChange={(e) => setNewCollectionCount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                  Slug / URL Path
                </label>
                <input
                  type="text"
                  placeholder="e.g. georgette"
                  value={newCollectionSlug}
                  onChange={(e) => setNewCollectionSlug(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                />
              </div>

              <div>
                <ImageUpload
                  value={newCollectionImage}
                  onChange={setNewCollectionImage}
                  label="Collection Cover Image"
                  aspectRatio="portrait"
                  helpText="Select or drag a photo for this collection card"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum shadow-xs"
                >
                  Create Collection
                </button>
              </div>
            </form>
          )}

          {/* Edit Existing Collection Modal */}
          {editingItem && (
            <form
              onSubmit={handleUpdateEditingCollection}
              className="p-4 rounded-2xl bg-brand-ivory border border-brand-deepPlum/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-deepPlum">
                  Edit Collection: {editingItem.name}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg text-brand-deepPlum/60 hover:text-brand-deepPlum"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                    Count Label
                  </label>
                  <input
                    type="text"
                    value={editingItem.count}
                    onChange={(e) => setEditingItem({ ...editingItem, count: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-brand-deepPlum/70 block mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs"
                />
              </div>

              <div>
                <ImageUpload
                  value={editingItem.image}
                  onChange={(img) => setEditingItem({ ...editingItem, image: img })}
                  label="Collection Cover Image"
                  aspectRatio="portrait"
                  helpText="Select or drag a photo for this collection card"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-lg border border-brand-deepPlum/20 text-xs font-semibold text-brand-deepPlum"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum shadow-xs"
                >
                  Update Collection
                </button>
              </div>
            </form>
          )}

          {/* Collections List */}
          <div className="space-y-2.5">
            {categories.items.map((col, idx) => {
              const isOnHome = col.onHome !== false;

              return (
                <div
                  key={col.id || idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 transition hover:shadow-xs space-y-3"
                >
                  {/* Top: Thumbnail, Name, and Visibility Status Toggle */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-brand-deepPlum/10 shrink-0">
                        <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-brand-deepPlum truncate">{col.name}</span>
                          <span className="text-[11px] font-semibold text-brand-plum shrink-0">({col.count})</span>
                        </div>
                        <span className="text-[10px] text-brand-deepPlum/60 font-mono block truncate">
                          /sarees?collection={col.slug}
                        </span>
                      </div>
                    </div>

                    {/* High-Contrast "On home" / "Hidden" Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleCollectionOnHome(col.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 shadow-2xs shrink-0 min-h-[36px] ${
                        isOnHome
                          ? "bg-brand-deepPlum text-white border-brand-deepPlum hover:bg-brand-plum"
                          : "bg-gray-100 text-brand-deepPlum border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {isOnHome ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
                          <span>On home</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom: Responsive Action Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-deepPlum/10">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCollection(idx, "up")}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-20 text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span className="text-[10.5px]">Up</span>
                      </button>

                      <button
                        type="button"
                        disabled={idx === categories.items.length - 1}
                        onClick={() => moveCollection(idx, "down")}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-20 text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span className="text-[10.5px]">Down</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem(col)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-deepPlum hover:text-white transition text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCollection(col.id)}
                        className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            PROMOTIONS & OFFERS MANAGER
           ======================================================== */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="pb-3 border-b border-brand-deepPlum/10">
            <h3 className="font-bold text-base text-brand-deepPlum">Promotions & Festive Offers</h3>
            <p className="text-[11px] text-brand-deepPlum/70">
              Customize headline, promo banner discount, and coupon code
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Promotion Headline
              </label>
              <input
                type="text"
                value={promotion.title}
                onChange={(e) => setPromotion({ ...promotion, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                  Discount Tag Badge
                </label>
                <input
                  type="text"
                  value={promotion.discountTag}
                  onChange={(e) => setPromotion({ ...promotion, discountTag: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                Offer Subtitle & Description
              </label>
              <textarea
                rows={2}
                value={promotion.subtitle}
                onChange={(e) => setPromotion({ ...promotion, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={promotion.buttonText}
                  onChange={(e) => setPromotion({ ...promotion, buttonText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-deepPlum block mb-1">
                  Button Link URL
                </label>
                <input
                  type="text"
                  value={promotion.buttonLink}
                  onChange={(e) => setPromotion({ ...promotion, buttonLink: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-deepPlum/20 text-xs"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                value={promotion.image}
                onChange={(img) => setPromotion({ ...promotion, image: img })}
                label="Banner Graphic / Photo"
                aspectRatio="landscape"
                helpText="Upload a high-resolution promotional banner photo"
              />
            </div>

            {/* Banner Live Preview */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deepPlum/60 block mb-1.5">
                Banner Live Preview
              </span>
              <div className="p-4 rounded-2xl bg-brand-plum text-white flex items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold bg-black/20 px-2 py-0.5 rounded-full">
                    {promotion.discountTag}
                  </span>
                  <h4 className="text-xs font-bold">{promotion.title}</h4>
                  <p className="text-[10px] text-brand-lilac line-clamp-1">{promotion.subtitle}</p>
                </div>
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/20 shrink-0">
                  <img src={promotion.image} alt="Promo preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          HOMEPAGE SECTION ORDER MANAGER
         ======================================================== */}
      <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-deepPlum/10">
          <div>
            <h3 className="font-bold text-base text-brand-deepPlum">
              Homepage Section Display Order
            </h3>
            <p className="text-xs text-brand-deepPlum/70 font-medium">
              Order of sections displayed to customers visiting your store. Use Up / Down buttons to rearrange.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Order</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition space-y-2.5 ${
                sec.enabled
                  ? "bg-brand-ivory/60 border-brand-deepPlum/15"
                  : "bg-gray-100/60 border-gray-300 opacity-60"
              }`}
            >
              {/* Top: Name & Visibility */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-brand-deepPlum text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-brand-deepPlum truncate">{sec.name}</h4>
                    <span className="text-[10px] text-brand-deepPlum/60 font-semibold uppercase block truncate">
                      ID: {sec.id}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSectionEnabled(idx)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition flex items-center gap-1 shrink-0 ${
                    sec.enabled
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : "bg-gray-200 text-gray-700 border-gray-300"
                  }`}
                >
                  {sec.enabled ? <Eye className="w-3 h-3 text-emerald-700" /> : <EyeOff className="w-3 h-3" />}
                  <span>{sec.enabled ? "Visible" : "Hidden"}</span>
                </button>
              </div>

              {/* Bottom: Reorder Toolbar */}
              <div className="flex items-center justify-start gap-2 pt-1 border-t border-brand-deepPlum/10">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, "up")}
                  className="px-3 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-20 text-xs font-semibold flex items-center gap-1 min-h-[34px]"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span className="text-[10.5px]">Move Up</span>
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, "down")}
                  className="px-3 py-1.5 rounded-lg bg-white border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-plum hover:text-white transition disabled:opacity-20 text-xs font-semibold flex items-center gap-1 min-h-[34px]"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span className="text-[10.5px]">Move Down</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
