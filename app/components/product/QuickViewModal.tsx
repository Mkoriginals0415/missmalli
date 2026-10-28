import { useState } from "react";
import { X, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@remix-run/react";
import { SeedProduct } from "~/db/mock-data";
import { useBag, useMyRequests } from "~/hooks/useLocalStorage";
import { generateWhatsAppBuyUrl } from "~/utils/whatsapp";

interface QuickViewModalProps {
  product: SeedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  sellerPhone?: string;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  sellerPhone = "919876543210",
}: QuickViewModalProps) {
  const navigate = useNavigate();
  const { addToBag } = useBag();
  const { addRequest } = useMyRequests();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [blouseOption, setBlouseOption] = useState<"with" | "without">("with");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const activeColor = selectedColor || product.variants[0]?.colorName || "Original";

  const handleBuyNow = async () => {
    setIsSubmitting(true);
    try {
      const variantDetails = `${activeColor} · ${blouseOption === "with" ? "With blouse" : "Without blouse"}`;

      const payload = {
        source: "buy_now",
        totalAmount: product.price,
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

      if (!res.ok) throw new Error("Failed to create order request");

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
        itemsCount: 1,
        totalAmount: product.price,
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
            price: product.price,
          },
        ],
        totalAmount: product.price,
      });

      window.open(whatsappUrl, "_blank");
      navigate(
        `/request-created?number=${encodeURIComponent(data.requestNumber)}&token=${encodeURIComponent(
          data.secretToken
        )}&url=${encodeURIComponent(data.requestUrl)}`
      );
    } catch (err) {
      console.error(err);
      alert("Error initiating order. Please try again.");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleAddToBag = () => {
    addToBag({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      colorName: activeColor,
      colorHex: product.variants[0]?.colorHex || "#5B2A6E",
      blouseOption,
      price: product.price,
      imageUrl: product.images[0],
    });
    alert(`Added ${product.name} (#${product.code}) to your bag!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="w-full max-w-2xl bg-brand-ivory rounded-[28px] overflow-hidden shadow-2xl border border-brand-lilac/30 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 text-brand-deepPlum hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 aspect-[3/4] bg-brand-lilac/20 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-deepPlum text-white text-[11px] font-bold">
            #{product.code}
          </span>
        </div>

        {/* Product Info & Actions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-brand-plum">
              {product.collectionName} · {product.fabric}
            </span>
            <h3 className="font-sans text-xl font-bold text-brand-deepPlum mt-1 leading-snug">
              {product.name}
            </h3>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl font-bold text-brand-deepPlum">
                ₹ {product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-brand-deepPlum/40 line-through">
                  ₹ {product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.discount && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-blush/40 text-brand-deepPlum font-bold">
                  {product.discount}
                </span>
              )}
            </div>

            <p className="text-xs text-brand-deepPlum/70 mt-2.5 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.variants.length > 0 && (
              <div className="mt-4">
                <label className="text-[11px] font-semibold text-brand-deepPlum/70 uppercase tracking-wider block mb-1.5">
                  Shade: <span className="text-brand-deepPlum font-bold">{activeColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColor(v.colorName)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        activeColor === v.colorName
                          ? "border-brand-plum scale-110 shadow-sm"
                          : "border-white hover:opacity-80"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-brand-lilac/30">
            <button
              onClick={handleBuyNow}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full bg-brand-plum text-white text-xs font-semibold hover:bg-brand-deepPlum transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Buy now on WhatsApp</span>
            </button>

            <button
              onClick={handleAddToBag}
              className="w-full py-2.5 px-4 rounded-full border border-brand-plum text-brand-plum text-xs font-semibold hover:bg-brand-plum hover:text-white transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <Link
              to={`/p/${product.slug}`}
              className="block text-center text-[11px] text-brand-deepPlum/60 hover:text-brand-plum underline pt-1"
            >
              View full saree details & specs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
