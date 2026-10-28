import { useState } from "react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Heart, Share2, MessageCircle, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { BuyNowSheet } from "~/components/product/BuyNowSheet";
import { getProductBySlug, getStoreSettings } from "~/db/d1.server";
import { useSavedSarees, useBag } from "~/hooks/useLocalStorage";
import { generateWhatsAppQuestionUrl } from "~/utils/whatsapp";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const slug = params.slug;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const product = await getProductBySlug(slug, env);
  if (!product) throw new Response("Product Not Found", { status: 404 });

  const settings = await getStoreSettings(env);

  return json({
    product,
    sellerPhone: settings.seller_whatsapp_number || "919876543210",
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [{ title: "Product Not Found | Miss Malli" }];
  }

  const { product } = data;
  const coverImage = product.images[0] || "/brand/logo.png";
  const title = `${product.name} · ₹ ${product.price.toLocaleString("en-IN")} | Miss Malli`;
  const description = `${product.fabric}. Handcrafted authentic Indian saree. Order directly with seller on WhatsApp.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: coverImage },
    { property: "og:type", content: "product" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: coverImage },
  ];
};

export default function ProductDetailPage() {
  const { product, sellerPhone } = useLoaderData<typeof loader>();
  const [activePhoto, setActivePhoto] = useState(0);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  const { isSaved, toggleSave } = useSavedSarees();
  const { addToBag } = useBag();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Miss Malli - ${product.name}`,
          text: `Check out ${product.name} on Miss Malli!`,
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  const handleAddToBag = () => {
    addToBag({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      colorName: product.variants[0]?.colorName || "Original",
      colorHex: product.variants[0]?.colorHex || "#713D8C",
      blouseOption: "with",
      price: product.price,
      imageUrl: product.images[0],
    });
    alert(`Added ${product.name} to your bag!`);
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappAskUrl = generateWhatsAppQuestionUrl(sellerPhone, product.name, currentUrl);

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-24">
      <Header showBack={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4">
        {/* Breadcrumb (Screen W4) */}
        <div className="text-xs text-brand-dark/60 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-brand-purple">Home</Link>
          <span>›</span>
          <Link to={`/shop?collection=${product.collectionSlug}`} className="hover:text-brand-purple capitalize">
            {product.collectionName}
          </Link>
          <span>›</span>
          <span className="text-brand-plum font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Photos Section */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-brand-ivory border border-brand-lavender/30 shadow-sm">
              <img
                src={product.images[activePhoto] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={() => toggleSave(product.id)}
                  className="p-2.5 rounded-full bg-white/80 backdrop-blur-md text-brand-dark hover:text-brand-rose transition shadow-sm"
                  aria-label="Save saree"
                >
                  <Heart className={`w-5 h-5 ${isSaved(product.id) ? "fill-brand-rose text-brand-rose" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/80 backdrop-blur-md text-brand-dark hover:text-brand-purple transition shadow-sm"
                  aria-label="Share saree"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition ${
                      activePhoto === idx ? "border-brand-purple scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Buy Section */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                {product.collectionName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-plum mt-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-2xl font-bold text-brand-dark">
                  ₹ {product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  In stock
                </span>
              </div>
            </div>

            {/* Colors Preview */}
            {product.variants.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold block mb-2">
                  Available Shades
                </label>
                <div className="flex items-center gap-2">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-brand-lavender/40"
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions (Buy now & Add to bag) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setBuyNowOpen(true)}
                className="w-full py-4 px-6 rounded-full bg-brand-purple text-white font-semibold text-base hover:bg-brand-plum transition shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Buy now on WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToBag}
                  className="py-3 px-4 rounded-full border border-brand-purple text-brand-purple font-medium text-xs hover:bg-brand-purple hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to bag
                </button>

                <a
                  href={whatsappAskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full border border-brand-lavender/50 text-brand-dark/80 font-medium text-xs hover:bg-brand-ivory transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Ask question
                </a>
              </div>
            </div>

            {/* Details and Care Accordion */}
            <div className="border-t border-brand-lavender/30 pt-4 space-y-3 text-sm">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum"
              >
                <span>Details and care</span>
                {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {detailsOpen && (
                <div className="space-y-2 text-xs sm:text-sm text-brand-dark/80 pt-1 leading-relaxed">
                  <p><strong className="text-brand-dark">Fabric:</strong> {product.fabric}</p>
                  <p><strong className="text-brand-dark">Length:</strong> {product.length || "5.5 meters saree + 0.8 meter blouse piece"}</p>
                  <p><strong className="text-brand-dark">Care:</strong> {product.care}</p>
                  <p className="pt-1 text-brand-dark/70">{product.description}</p>
                </div>
              )}
            </div>

            {/* Shipping Accordion */}
            <div className="border-t border-brand-lavender/30 pt-3 text-sm">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum"
              >
                <span>Shipping and returns</span>
                {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {shippingOpen && (
                <div className="space-y-1.5 text-xs text-brand-dark/70 pt-2">
                  <p>• Complimentary express shipping across India.</p>
                  <p>• Dispatched within 24-48 business hours with tracking ID.</p>
                  <p>• 7-day hassle-free exchange policy for unstitched pieces.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BuyNowSheet
        isOpen={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          coverImage: product.images[0],
          variants: product.variants,
        }}
        sellerPhone={sellerPhone}
      />

      <BottomNav />
    </div>
  );
}
