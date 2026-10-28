import { useState } from "react";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "@remix-run/react";
import { generateWhatsAppBuyUrl } from "~/utils/whatsapp";
import { useMyRequests } from "~/hooks/useLocalStorage";

interface Variant {
  id: number;
  colorName: string;
  colorHex: string;
  blouseOption: string;
  stockCount: number | null;
}

interface BuyNowSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    coverImage: string;
    variants?: Variant[];
  };
  sellerPhone?: string;
}

export function BuyNowSheet({
  isOpen,
  onClose,
  product,
  sellerPhone = "919876543210",
}: BuyNowSheetProps) {
  const navigate = useNavigate();
  const { addRequest } = useMyRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default color is first variant or Ruby Red
  const initialVariants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        { id: 1, colorName: "Ruby Red", colorHex: "#A51D24", blouseOption: "with", stockCount: 2 },
        { id: 2, colorName: "Champagne Gold", colorHex: "#C99A48", blouseOption: "with", stockCount: 3 },
        { id: 3, colorName: "Plum Purple", colorHex: "#51265F", blouseOption: "with", stockCount: 1 },
      ];

  const uniqueColors = Array.from(new Set(initialVariants.map((v) => v.colorName))).map((name) => {
    return initialVariants.find((v) => v.colorName === name)!;
  });

  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0]?.colorName || "Ruby Red");
  const [blouseOption, setBlouseOption] = useState<"with" | "without">("with");

  if (!isOpen) return null;

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      const variantDetails = `${selectedColor} · ${blouseOption === "with" ? "With blouse" : "Without blouse"}`;
      
      const payload = {
        source: "buy_now",
        totalAmount: product.price,
        items: [
          {
            productId: product.id,
            productName: product.name,
            variantDetails,
            price: product.price,
            imageUrl: product.coverImage,
          },
        ],
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create request");

      const data = await res.json() as {
        requestId: number;
        requestNumber: string;
        secretToken: string;
        requestUrl: string;
      };

      // Save to localStorage My Requests
      addRequest({
        requestId: data.requestId,
        requestNumber: data.requestNumber,
        secretToken: data.secretToken,
        itemsCount: 1,
        totalAmount: product.price,
        summaryText: `${product.name} (${variantDetails})`,
        status: "needs_reply",
        createdAt: new Date().toISOString(),
      });

      // Formulate WhatsApp buy URL
      const whatsappUrl = generateWhatsAppBuyUrl({
        sellerPhone,
        requestNumber: data.requestNumber,
        requestUrl: data.requestUrl,
        items: [
          {
            name: product.name,
            variantDetails,
            price: product.price,
          },
        ],
        totalAmount: product.price,
      });

      // Try opening WhatsApp in new tab, and navigate current window to Request Created confirmation screen (Screen 10)
      window.open(whatsappUrl, "_blank");
      navigate(`/request-created?number=${encodeURIComponent(data.requestNumber)}&token=${encodeURIComponent(data.secretToken)}&url=${encodeURIComponent(data.requestUrl)}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong creating your order request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-brand-warmWhite rounded-t-3xl p-6 shadow-2xl border-t border-brand-lavender/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-brand-lavender/20">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-plum">{product.name}</h3>
            <p className="text-sm font-semibold text-brand-dark/90 mt-0.5">
              ₹ {product.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-1.5">In stock</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-brand-dark/50 hover:text-brand-purple"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Options */}
        <div className="py-4">
          <label className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold block mb-2">
            Colour: <span className="text-brand-dark capitalize">{selectedColor}</span>
          </label>
          <div className="flex items-center gap-3">
            {uniqueColors.map((color) => {
              const isSelected = selectedColor === color.colorName;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.colorName)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "ring-2 ring-offset-2 ring-brand-purple scale-105" : "hover:opacity-80"
                  }`}
                  style={{ backgroundColor: color.colorHex }}
                  title={color.colorName}
                  aria-label={color.colorName}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blouse Piece Options */}
        <div className="pb-4">
          <label className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold block mb-2">
            Blouse Piece
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setBlouseOption("with")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition ${
                blouseOption === "with"
                  ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                  : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
              }`}
            >
              With blouse
            </button>
            <button
              onClick={() => setBlouseOption("without")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition ${
                blouseOption === "without"
                  ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                  : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
              }`}
            >
              Without blouse
            </button>
          </div>
        </div>

        {/* Helper text as in wireframe */}
        <p className="text-[12px] text-brand-dark/60 text-center pb-4 leading-relaxed">
          Opens WhatsApp with this saree's photo and details. Nothing is charged here.
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-full bg-brand-purple text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-brand-plum transition disabled:opacity-50 shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Request...
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              Continue to WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  );
}
