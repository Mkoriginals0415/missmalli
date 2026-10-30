import { useState } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { generateWhatsAppQuestionUrl } from "~/utils/whatsapp";
import { useSellerPhone } from "~/hooks/useSellerPhone";

interface DetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    fabric: string;
    length?: string | null;
    care?: string | null;
    slug: string;
    price: number;
  };
  sellerPhone?: string;
}

export function DetailsSheet({ isOpen, onClose, product, sellerPhone }: DetailsSheetProps) {
  const { phone: contextSellerPhone } = useSellerPhone();
  const activeSellerPhone = sellerPhone || contextSellerPhone;
  const [shippingOpen, setShippingOpen] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://missmalli.com/p/${product.slug}`;
  const whatsappUrl = generateWhatsAppQuestionUrl(activeSellerPhone, product.name, currentUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-brand-warmWhite rounded-t-3xl p-6 shadow-2xl border-t border-brand-lavender/30 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-brand-lavender/20">
          <h3 className="font-serif text-xl text-brand-plum font-semibold">Saree Details</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-brand-dark/50 hover:text-brand-purple hover:bg-brand-lavender/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-sm">
          <div>
            <span className="text-brand-dark/60 block text-xs uppercase tracking-wider">Fabric</span>
            <span className="font-medium text-brand-dark">{product.fabric}</span>
          </div>

          <div>
            <span className="text-brand-dark/60 block text-xs uppercase tracking-wider">Length</span>
            <span className="font-medium text-brand-dark">{product.length || "5.5 meters saree + 0.8 meter blouse piece"}</span>
          </div>

          <div>
            <span className="text-brand-dark/60 block text-xs uppercase tracking-wider">Blouse Piece</span>
            <span className="font-medium text-brand-dark">Included (Unstitched running blouse piece)</span>
          </div>

          <div>
            <span className="text-brand-dark/60 block text-xs uppercase tracking-wider">Care Instructions</span>
            <span className="font-medium text-brand-dark">{product.care || "Dry clean only. Store in a cool dry place wrapped in cotton."}</span>
          </div>

          {/* Shipping Accordion */}
          <div className="pt-2 border-t border-brand-lavender/20">
            <button
              onClick={() => setShippingOpen(!shippingOpen)}
              className="flex items-center justify-between w-full py-2 text-left font-medium text-brand-purple"
            >
              <span>Shipping and returns</span>
              {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {shippingOpen && (
              <div className="text-xs text-brand-dark/70 space-y-1.5 pt-1 pb-2">
                <p>• Dispatched within 24-48 hours via premium express courier.</p>
                <p>• Pan-India delivery within 3-5 business days.</p>
                <p>• Easy 7-day exchange policy for unused items in original packaging.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-full border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Ask about this saree on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
