import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { ArrowLeft, Save, Upload, Eye, Plus, Trash2 } from "lucide-react";
import { getProductById } from "~/db/d1.server";

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
      fabric: "",
      length: "5.5 meters saree + 0.8 meter blouse piece",
      care: "Dry clean only. Store wrapped in a muslin cloth.",
      price: 9800,
      salePrice: null,
      description: "",
      collectionSlug: "silk",
      status: "live",
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        { id: 1, colorName: "Ruby Red", colorHex: "#A51D24", blouseOption: "with", stockCount: 2 },
      ],
    },
    isNew,
  });
}

export default function AdminProductEditor() {
  const { product: initialProduct, isNew } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [name, setName] = useState(initialProduct.name);
  const [slug, setSlug] = useState(initialProduct.slug);
  const [fabric, setFabric] = useState(initialProduct.fabric);
  const [description, setDescription] = useState(initialProduct.description || "");
  const [price, setPrice] = useState(initialProduct.price);
  const [collection, setCollection] = useState(initialProduct.collectionSlug);
  const [images, setImages] = useState<string[]>(initialProduct.images);
  const [variants, setVariants] = useState(initialProduct.variants);

  const handleSave = () => {
    alert("Product saved successfully!");
    navigate("/admin/products");
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
      <div className="flex items-center justify-between pb-4 border-b border-brand-lavender/30">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-1.5 text-brand-dark/60 hover:text-brand-purple">
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

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save and publish</span>
        </button>
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
              <button
                onClick={handleAddImage}
                className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add photo URL
              </button>
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
                  onChange={(e) => setCollection(e.target.value)}
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
