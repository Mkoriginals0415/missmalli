import { useState } from "react";
import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, useNavigate, Link } from "@remix-run/react";
import { ArrowLeft, Save, Upload, Eye, Plus, Trash2, Loader2 } from "lucide-react";
import { getProductById, upsertProduct, deleteProduct } from "~/db/d1.server";
import { processImageFile } from "~/components/ui/ImageUpload";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const idStr = params.id;
  const isNew = idStr === "new";

  let product = null;
  if (!isNew && idStr) {
    product = await getProductById(Number(idStr), env);
  }

  return json({
    product: product || {
      id: 0,
      name: "",
      slug: "",
      fabric: "Pure silk · Handwoven",
      length: "5.5 meters saree + 0.8 meter blouse piece",
      care: "Dry clean only. Store wrapped in a muslin cloth.",
      price: 2499,
      originalPrice: null,
      description: "",
      collectionSlug: "sarees",
      status: "live",
      images: [
        "/brand/logo.png",
      ],
      variants: [
        { id: 1, colorName: "Original", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 5 },
      ],
    },
    isNew,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const productId = Number(formData.get("productId"));
    if (productId) {
      await deleteProduct(productId, env);
      return redirect("/admin/products");
    }
    return json({ error: "Missing productId" }, { status: 400 });
  }

  const rawJson = formData.get("productJson");
  if (!rawJson || typeof rawJson !== "string") {
    return json({ error: "Invalid product payload" }, { status: 400 });
  }

  try {
    const parsed = JSON.parse(rawJson);
    await upsertProduct(parsed, env);
    return redirect("/admin/products");
  } catch (err: any) {
    return json({ error: err.message || "Failed to save product" }, { status: 400 });
  }
}

export default function AdminProductEditor() {
  const { product: initialProduct, isNew } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();

  const [name, setName] = useState(initialProduct.name);
  const [slug, setSlug] = useState(initialProduct.slug);
  const [fabric, setFabric] = useState(initialProduct.fabric);
  const [description, setDescription] = useState(initialProduct.description || "");
  const [price, setPrice] = useState(initialProduct.price);
  const [originalPrice, setOriginalPrice] = useState<number | null>(initialProduct.originalPrice || null);
  const [collection, setCollection] = useState(initialProduct.collectionSlug);
  const [status, setStatus] = useState(initialProduct.status || "live");
  const [images, setImages] = useState<string[]>(initialProduct.images);
  const [variants, setVariants] = useState(initialProduct.variants);

  const isSaving = fetcher.state === "submitting" || fetcher.state === "loading";

  const handleSave = () => {
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
    const payload = {
      id: initialProduct.id,
      name,
      slug: cleanSlug,
      fabric,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      collectionSlug: collection,
      collectionName: collection === "dresses" ? "Dresses" : collection === "materials" ? "Dress Materials" : collection === "exclusive" ? "Exclusive" : "Sarees",
      status,
      images,
      variants,
    };

    const formData = new FormData();
    formData.append("productJson", JSON.stringify(payload));
    fetcher.submit(formData, { method: "post" });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("productId", String(initialProduct.id));
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, url]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-lavender/30">
        <div className="flex items-center gap-2.5">
          <Link to="/admin/products" className="p-2 -ml-2 text-brand-dark/60 hover:text-brand-deepPlum min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
              {isNew ? "Add New Saree" : "Edit Saree"}
            </h1>
            <span className="text-xs text-brand-dark/60">
              Configure product details, gallery, and variant inventory
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md min-h-[44px] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save and publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Photos Box */}
          <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-brand-plum">Photos</h3>
                <p className="text-[11px] text-brand-dark/60">
                  First photo is the cover and image WhatsApp displays in preview cards
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold cursor-pointer hover:bg-brand-plum transition shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-brand-lilac" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const dataUrl = await processImageFile(e.target.files[0]);
                        setImages([...images, dataUrl]);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-xs font-semibold text-brand-deepPlum/70 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Link
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-32 rounded-2xl overflow-hidden border border-brand-lavender/40 group shrink-0">
                  <img src={img} alt={`Product photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-brand-purple text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      Cover
                    </span>
                  )}
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Saree Details Box */}
          <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-4 text-xs">
            <div>
              <label className="font-semibold text-brand-dark block mb-1">Saree Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
                placeholder="e.g. Ruby Red Banarasi Silk Saree"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-brand-dark block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
                />
              </div>
              <div>
                <label className="font-semibold text-brand-dark block mb-1">Collection</label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
                >
                  <option value="silk">Pure Silk</option>
                  <option value="festive">Festive Specials</option>
                  <option value="cotton">Cotton Silk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">Fabric & Weave</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
                placeholder="e.g. Pure Katan Silk with Golden Zari"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">Description & Story</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
              />
            </div>

            {/* Saree Variants & Color Swatches */}
            <div className="pt-3 border-t border-brand-deepPlum/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-brand-deepPlum">Color Variants & Swatches</h4>
                  <p className="text-[10px] text-brand-deepPlum/60">Customize color swatches and hex codes for this saree</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVariants([...variants, { id: Date.now(), colorName: "New Color", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 2 }])}
                  className="text-xs font-bold text-brand-plum hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Color
                </button>
              </div>

              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={v.id || i} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-ivory border border-brand-deepPlum/10">
                    <input
                      type="color"
                      value={v.colorHex}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].colorHex = e.target.value;
                        setVariants(next);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={v.colorName}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].colorName = e.target.value;
                        setVariants(next);
                      }}
                      placeholder="Color Name"
                      className="flex-1 px-2.5 py-1 rounded-lg border border-brand-deepPlum/20 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={v.colorHex}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].colorHex = e.target.value;
                        setVariants(next);
                      }}
                      placeholder="#Hex"
                      className="w-20 px-2 py-1 rounded-lg border border-brand-deepPlum/20 text-xs font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Column (Screen A4 Preview Simulator) */}
        <div className="space-y-5">
          {/* WhatsApp Preview Card Simulator */}
          <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-brand-dark/60 block">
              WhatsApp Link Preview Card
            </span>
            <div className="rounded-2xl border border-gray-200 bg-[#E5DDD5]/30 p-3 shadow-inner">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm max-w-xs mx-auto">
                <img
                  src={images[0]}
                  alt="WhatsApp Preview"
                  className="w-full h-36 object-cover"
                />
                <div className="p-3 space-y-1">
                  <h4 className="font-serif font-bold text-xs text-brand-dark line-clamp-1">
                    {name || "Ruby Red Banarasi Silk Saree"}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    ₹ {price.toLocaleString("en-IN")} · Handloom Silk · Miss Malli
                  </p>
                  <span className="text-[9px] text-gray-400 block pt-0.5">missmalli.com</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-brand-dark/50">
              Generated dynamically via edge SSR OpenGraph tags on Cloudflare.
            </p>
          </div>

          {/* Search Appearance */}
          <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-2 text-xs">
            <span className="font-bold text-brand-dark/70 block uppercase tracking-wider text-[10px]">
              Search Appearance
            </span>
            <p className="font-mono text-[11px] text-brand-purple bg-brand-ivory p-2 rounded-xl border border-brand-lavender/30 break-all">
              /p/{slug || "ruby-red-banarasi"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
