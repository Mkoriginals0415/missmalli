import { useState } from "react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  RotateCcw, 
  Award, 
  Minus, 
  Plus, 
  Star,
  Check
} from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { INITIAL_PRODUCTS, ACCESSORIES, SeedProduct } from "~/db/mock-data";
import { useSavedSarees, useBag, useMyRequests } from "~/hooks/useLocalStorage";
import { generateWhatsAppBuyUrl, generateWhatsAppQuestionUrl } from "~/utils/whatsapp";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }

  return json({
    product,
    accessories: ACCESSORIES,
    sellerPhone: "919876543210",
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [{ title: "Product Not Found | Miss Malli" }];
  }

  const { product } = data;
  const title = `${product.name} (#${product.code}) · ₹ ${product.price.toLocaleString("en-IN")} | Miss Malli`;
  const description = `${product.fabric}. ${product.description}`;
  const image = product.images[0] || "/brand/logo.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: "product" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: image },
  ];
};

export default function ProductDetailPage() {
  const { product, accessories, sellerPhone } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [activePhoto, setActivePhoto] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.colorName || "Original");
  const [blouseOption, setBlouseOption] = useState<"with" | "without">("with");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);

  // Accordion open states
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [fabricOpen, setFabricOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  const { isSaved, toggleSave } = useSavedSarees();
  const { addToBag } = useBag();
  const { addRequest } = useMyRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastLink, setToastLink] = useState<{ text: string; url: string } | null>(null);

  const showToast = (message: string, link?: { text: string; url: string }) => {
    setToastMessage(message);
    setToastLink(link || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastLink(null);
    }, 3500);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryMessage("✓ Express delivery available in 2–4 business days with complimentary shipping.");
    } else {
      setDeliveryMessage("Please enter a valid 6-digit Indian postal code.");
    }
  };

  const handleBuyNow = async () => {
    setIsSubmitting(true);
    try {
      const variantDetails = `${selectedColor} · ${blouseOption === "with" ? "With blouse" : "Without blouse"}${quantity > 1 ? ` · Qty: ${quantity}` : ""}`;
      const totalAmount = product.price * quantity;

      const payload = {
        source: "buy_now",
        totalAmount,
        items: [
          {
            code: product.code,
            productId: product.id,
            productName: product.name,
            variantDetails,
            price: product.price,
            imageUrl: product.images[0],
          },
        ],
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create request");

      const data = (await res.json()) as {
        requestId: number;
        requestNumber: string;
        secretToken: string;
        requestUrl: string;
      };

      addRequest({
        requestId: data.requestId,
        requestNumber: data.requestNumber,
        secretToken: data.secretToken,
        itemsCount: quantity,
        totalAmount,
        summaryText: `${product.name} (#${product.code})`,
        status: "needs_reply",
        createdAt: new Date().toISOString(),
      });

      const whatsappUrl = generateWhatsAppBuyUrl({
        sellerPhone,
        requestNumber: data.requestNumber,
        requestUrl: data.requestUrl,
        items: [
          {
            code: product.code,
            name: product.name,
            variantDetails,
            price: totalAmount,
          },
        ],
        totalAmount,
      });

      window.open(whatsappUrl, "_blank");
      navigate(
        `/request-created?number=${encodeURIComponent(data.requestNumber)}&token=${encodeURIComponent(
          data.secretToken
        )}&url=${encodeURIComponent(data.requestUrl)}`
      );
    } catch (err) {
      console.error(err);
      showToast("Error processing WhatsApp request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToBag = () => {
    addToBag({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      colorName: selectedColor,
      colorHex: product.variants[0]?.colorHex || "#5B2A6E",
      blouseOption,
      price: product.price,
      quantity,
      imageUrl: product.images[0],
    });
    showToast(`Added ${quantity}x ${product.name} to bag`, { text: "View Bag", url: "/bag" });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Miss Malli!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast("Product link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-deepPlum/60 flex items-center gap-1.5">
          <Link to="/" className="hover:text-brand-plum">Home</Link>
          <span>/</span>
          <Link to="/sarees" className="hover:text-brand-plum">Sarees</Link>
          <span>/</span>
          <span className="text-brand-deepPlum font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section (Page 03) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-start">
          {/* Left: Thumbnail Column + Main Image with Mobile Swipe indicator */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse gap-3 sm:gap-4 items-start">
            {/* Main Image with Zoom on Hover - aspect-[2/3] fits 9:16/tall portrait without cutting off */}
            <div className="relative flex-1 aspect-[2/3] max-h-[78vh] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-brand-ivory border border-brand-lilac/30 shadow-md group flex items-center justify-center">
              <img
                src={product.images[activePhoto] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain sm:object-cover sm:object-top group-hover:scale-102 transition duration-500 ease-out"
              />
              
              {/* Photo Counter Badge (Mobile & Desktop) */}
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                {activePhoto + 1} / {product.images.length}
              </span>

              {/* Prev / Next Chevrons on Mobile */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="sm:hidden absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-brand-deepPlum flex items-center justify-center shadow-xs active:scale-95"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActivePhoto((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="sm:hidden absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-brand-deepPlum flex items-center justify-center shadow-xs active:scale-95"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              <button
                onClick={handleShare}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/85 backdrop-blur-xs text-brand-deepPlum hover:bg-white transition shadow-xs min-w-[40px] min-h-[40px] flex items-center justify-center"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails (Horizontal swipeable on mobile, vertical column on desktop) */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`w-14 sm:w-20 aspect-[2/3] rounded-[14px] sm:rounded-[16px] overflow-hidden border-2 transition shrink-0 bg-brand-ivory/60 ${
                    activePhoto === idx
                      ? "border-brand-plum shadow-md scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Buy Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                {product.badge && (
                  <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum">
                    {product.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold text-brand-deepPlum/60">
                  Product ID: #{product.code}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-brand-deepPlum mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-brand-deepPlum/70 font-medium">4.8 (126 reviews)</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-brand-deepPlum">
                  ₹ {product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-brand-deepPlum/40 line-through">
                    ₹ {product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {product.discount && (
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-blush/50 text-brand-deepPlum font-bold text-xs">
                    {product.discount}
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-deepPlum/80 leading-relaxed mt-3">
                {product.description}
              </p>
            </div>

            {/* Colour Selector */}
            {product.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum/70 block mb-2">
                  Colour: <span className="text-brand-deepPlum">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColor(v.colorName)}
                      className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 transition min-w-[36px] min-h-[36px] ${
                        selectedColor === v.colorName
                          ? "border-brand-plum scale-110 shadow-md ring-2 ring-brand-plum/30"
                          : "border-white hover:opacity-80"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Blouse Option */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deepPlum/70 block mb-2">
                Blouse Piece
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setBlouseOption("with")}
                  className={`flex-1 py-3 px-3 text-xs font-semibold rounded-xl border transition min-h-[44px] flex items-center justify-center ${
                    blouseOption === "with"
                      ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-xs"
                      : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
                  }`}
                >
                  With Blouse Piece
                </button>
                <button
                  onClick={() => setBlouseOption("without")}
                  className={`flex-1 py-3 px-3 text-xs font-semibold rounded-xl border transition min-h-[44px] flex items-center justify-center ${
                    blouseOption === "without"
                      ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-xs"
                      : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
                  }`}
                >
                  Without Blouse
                </button>
              </div>
            </div>

            {/* Quantity & Add to Bag & Wishlist Row (Page 03) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center justify-between border border-brand-lilac/50 rounded-full bg-white px-3 py-2 w-28 min-h-[44px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-brand-deepPlum hover:text-brand-plum p-1"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-brand-deepPlum hover:text-brand-plum p-1"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                className="flex-1 py-3 px-6 rounded-full bg-brand-plum text-white font-semibold text-xs hover:bg-brand-deepPlum transition shadow-md flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => toggleSave(product.id)}
                className={`p-3 rounded-full border border-brand-lilac/50 transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isSaved(product.id) ? "bg-brand-blush text-brand-plum border-brand-plum" : "bg-white text-brand-deepPlum"
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved(product.id) ? "fill-brand-plum" : ""}`} />
              </button>
            </div>

            {/* Buy Now on WhatsApp Button (Black pill from design) */}
            <div>
              <button
                onClick={handleBuyNow}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-brand-deepPlum text-white font-semibold text-xs hover:bg-brand-plum transition shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50 min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Buy Now on WhatsApp (#{product.code})</span>
              </button>
              <p className="text-[11px] text-center text-brand-deepPlum/60 mt-1.5 font-medium">
                Generates a private request link and opens seller WhatsApp.
              </p>
            </div>

            {/* Pincode Check */}
            <form onSubmit={handlePincodeCheck} className="space-y-1.5 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode · Check delivery"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-brand-lilac/40 text-xs text-brand-deepPlum placeholder:text-brand-deepPlum/40 focus:outline-none focus:border-brand-plum"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-white border border-brand-deepPlum text-brand-deepPlum text-xs font-semibold hover:bg-brand-deepPlum hover:text-white transition"
                >
                  Check
                </button>
              </div>
              {deliveryMessage && (
                <p className="text-[11px] text-brand-deepPlum/80 px-2 font-medium">
                  {deliveryMessage}
                </p>
              )}
            </form>

            {/* Value Props Row (Page 03) */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-brand-lilac/30 text-[11px] text-brand-deepPlum/80">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-plum" />
                Free shipping over ₹2,999
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-brand-plum" />
                7-day returns
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-gold" />
                Silk Mark certified
              </span>
            </div>

            {/* Accordions (Details, Fabric & Care, Shipping) */}
            <div className="space-y-2 pt-1">
              <div className="border-b border-brand-lilac/20 pb-2">
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="flex items-center justify-between w-full text-left font-bold text-xs text-brand-deepPlum py-1"
                >
                  <span>Details</span>
                  {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {detailsOpen && (
                  <p className="text-xs text-brand-deepPlum/70 pt-1 leading-relaxed">
                    Length: {product.length}. Includes matching unstitched running blouse piece. Each drape undergoes thorough handloom quality check prior to dispatch.
                  </p>
                )}
              </div>

              <div className="border-b border-brand-lilac/20 pb-2">
                <button
                  onClick={() => setFabricOpen(!fabricOpen)}
                  className="flex items-center justify-between w-full text-left font-bold text-xs text-brand-deepPlum py-1"
                >
                  <span>Fabric & Care</span>
                  {fabricOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {fabricOpen && (
                  <p className="text-xs text-brand-deepPlum/70 pt-1 leading-relaxed">
                    Fabric: {product.fabric}. Care: {product.care}
                  </p>
                )}
              </div>

              <div className="pb-2">
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="flex items-center justify-between w-full text-left font-bold text-xs text-brand-deepPlum py-1"
                >
                  <span>Shipping</span>
                  {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {shippingOpen && (
                  <p className="text-xs text-brand-deepPlum/70 pt-1 leading-relaxed">
                    All prepaid orders are dispatched within 24-48 business hours with express BlueDart or Delhivery tracking.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            COMPLETE THE LOOK (Page 03)
           ========================================================= */}
        <section className="space-y-4 pt-6 border-t border-brand-lilac/40">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-deepPlum">
              Complete the Look
            </h2>
            <span className="text-xs text-brand-deepPlum/60 font-semibold sm:hidden">Swipe →</span>
          </div>

          <div className="flex sm:grid sm:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            {accessories.map((acc) => (
              <div
                key={acc.id}
                className="w-[200px] sm:w-auto shrink-0 bg-white rounded-[20px] overflow-hidden border border-brand-lilac/30 shadow-xs p-3 space-y-2 flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-[14px] overflow-hidden bg-brand-lilac/10">
                  <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-deepPlum text-white text-[9px] font-bold">
                    #{acc.code}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-brand-deepPlum truncate">{acc.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-bold text-brand-deepPlum">
                      ₹ {acc.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => {
                        addToBag({
                          productId: acc.id,
                          name: acc.name,
                          slug: "accessory",
                          colorName: "Standard",
                          colorHex: "#5B2A6E",
                          blouseOption: "without",
                          price: acc.price,
                          imageUrl: acc.image,
                        });
                        showToast(`Added ${acc.name} to bag`, { text: "View Bag", url: "/bag" });
                      }}
                      className="px-2.5 py-1 rounded-full bg-brand-plum/10 text-brand-plum text-[10.5px] font-bold hover:bg-brand-plum hover:text-white transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            CUSTOMER REVIEWS (Page 03)
           ========================================================= */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-deepPlum">
            Customer Reviews
          </h2>

          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-[260px] sm:w-auto shrink-0 p-4 sm:p-5 rounded-[20px] bg-white border border-brand-lilac/30 shadow-xs space-y-2"
              >
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-brand-deepPlum/80 leading-relaxed font-medium">
                  "Gorgeous colour, exactly as pictured. The golden zari sheen is subtle and heirloom quality."
                </p>
                <span className="text-[10.5px] text-brand-deepPlum/60 block font-semibold">
                  — Verified Collector (Chennai)
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Sticky Order Bar with Safe Area Support */}
      <div className="lg:hidden sticky bottom-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-deepPlum/15 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-brand-deepPlum block leading-tight truncate">
            {product.name}
          </span>
          <span className="text-sm font-bold text-brand-plum">
            ₹ {(product.price * quantity).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToBag}
            className="p-2.5 rounded-full border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-brand-ivory transition shadow-2xs min-w-[42px] min-h-[42px] flex items-center justify-center"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isSubmitting}
            className="py-2.5 px-4 rounded-full bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md flex items-center gap-1.5 whitespace-nowrap min-h-[42px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-brand-deepPlum text-white text-xs font-bold shadow-xl flex items-center gap-3 border border-brand-lilac/30">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{toastMessage}</span>
            {toastLink && (
              <Link
                to={toastLink.url}
                className="px-2.5 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-[11px] underline"
              >
                {toastLink.text} →
              </Link>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
