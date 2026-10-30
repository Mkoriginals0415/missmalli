import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { 
  LayoutGrid, 
  ShoppingBag, 
  Heart, 
  Share2, 
  MessageCircle, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react";
import { useBag, useSavedSarees, useFeedHint } from "~/hooks/useLocalStorage";
import { DetailsSheet } from "~/components/product/DetailsSheet";
import { BuyNowSheet } from "~/components/product/BuyNowSheet";
import { generateWhatsAppQuestionUrl } from "~/utils/whatsapp";
import { useSellerPhone } from "~/hooks/useSellerPhone";

export interface SareeItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  fabric: string;
  length?: string | null;
  care?: string | null;
  collectionSlug: string;
  collectionName?: string;
  images: string[];
  variants: Array<{
    id: number;
    colorName: string;
    colorHex: string;
    blouseOption: string;
    stockCount: number | null;
  }>;
}

interface SwipeFeedProps {
  sarees: SareeItem[];
  sellerPhone?: string;
  initialIndex?: number;
}

export function SwipeFeed({ sarees, sellerPhone, initialIndex = 0 }: SwipeFeedProps) {
  const { phone: contextSellerPhone } = useSellerPhone();
  const activeSellerPhone = sellerPhone || contextSellerPhone;
  const navigate = useNavigate();
  const [sareeIndex, setSareeIndex] = useState(initialIndex);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  const { items: bagItems, addToBag } = useBag();
  const { savedIds, toggleSave, isSaved } = useSavedSarees();
  const { hasSeenHint, dismissHint } = useFeedHint();

  const currentSaree = sarees[sareeIndex] || sarees[0];
  const currentPhotos = currentSaree?.images && currentSaree.images.length > 0 
    ? currentSaree.images 
    : ["/images/products/saree-placeholder.jpg"];

  // Touch gesture handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const threshold = 45;

    // Detect primary direction
    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY < -threshold) {
        // Swiped UP -> Next Saree
        handleNextSaree();
      } else if (diffY > threshold) {
        // Swiped DOWN -> Previous Saree
        handlePrevSaree();
      }
    } else {
      if (diffX < -threshold) {
        // Swiped LEFT -> Next Photo
        handleNextPhoto();
      } else if (diffX > threshold) {
        // Swiped RIGHT -> Previous Photo
        handlePrevPhoto();
      }
    }
  };

  const handleNextSaree = () => {
    if (sareeIndex < sarees.length - 1) {
      setSareeIndex((prev) => prev + 1);
      setPhotoIndex(0);
    }
  };

  const handlePrevSaree = () => {
    if (sareeIndex > 0) {
      setSareeIndex((prev) => prev - 1);
      setPhotoIndex(0);
    }
  };

  const handleNextPhoto = () => {
    if (photoIndex < currentPhotos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailsOpen || buyNowOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNextSaree();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevSaree();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPhoto();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sareeIndex, photoIndex, sarees.length, currentPhotos.length, detailsOpen, buyNowOpen]);

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${currentSaree.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Miss Malli - ${currentSaree.name}`,
          text: `Check out this gorgeous saree: ${currentSaree.name} on Miss Malli!`,
          url,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  const handleAddCurrentToBag = () => {
    addToBag({
      productId: currentSaree.id,
      name: currentSaree.name,
      slug: currentSaree.slug,
      colorName: currentSaree.variants[0]?.colorName || "Original",
      colorHex: currentSaree.variants[0]?.colorHex || "#713D8C",
      blouseOption: "with",
      price: currentSaree.price,
      imageUrl: currentPhotos[0],
    });
    alert(`Added ${currentSaree.name} to your bag!`);
  };

  if (!currentSaree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <p className="text-brand-plum font-serif text-lg">No sarees found in this feed.</p>
        <Link to="/shop" className="mt-4 px-5 py-2 rounded-full bg-brand-purple text-white text-xs">
          Browse All Sarees
        </Link>
      </div>
    );
  }

  const whatsappAskUrl = generateWhatsAppQuestionUrl(
    activeSellerPhone,
    currentSaree.name,
    typeof window !== "undefined" ? `${window.location.origin}/p/${currentSaree.slug}` : ""
  );

  return (
    <div 
      className="relative w-full h-[100dvh] bg-black select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background/Current Photo */}
      <div className="absolute inset-0 flex items-center justify-center bg-brand-dark">
        <img
          src={currentPhotos[photoIndex] || currentPhotos[0]}
          alt={currentSaree.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Subtle gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/60 pointer-events-none" />
      </div>

      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-safe text-white">
        {/* Grid View toggle button */}
        <Link
          to={`/shop?collection=${currentSaree.collectionSlug}`}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition"
          aria-label="Switch to grid view"
          title="Grid view"
        >
          <LayoutGrid className="w-5 h-5" />
        </Link>

        {/* Collection Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setCollectionPickerOpen(!collectionPickerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs font-medium tracking-wide border border-white/20 hover:bg-black/60 transition"
          >
            <span>{currentSaree.collectionName || "Sarees"} · {sareeIndex + 1} of {sarees.length}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Collection Picker Dropdown */}
          {collectionPickerOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 bg-brand-warmWhite/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-brand-lavender/30 text-brand-dark z-30">
              <div className="text-[10px] uppercase font-bold text-brand-dark/50 px-2 py-1">Collections</div>
              <Link to="/feed?collection=all" className="block px-2.5 py-1.5 text-xs rounded-lg hover:bg-brand-lavender/20">All Sarees</Link>
              <Link to="/feed?collection=silk" className="block px-2.5 py-1.5 text-xs rounded-lg hover:bg-brand-lavender/20">Pure Silk</Link>
              <Link to="/feed?collection=festive" className="block px-2.5 py-1.5 text-xs rounded-lg hover:bg-brand-lavender/20">Festive Specials</Link>
              <Link to="/feed?collection=cotton" className="block px-2.5 py-1.5 text-xs rounded-lg hover:bg-brand-lavender/20">Cotton Silk</Link>
            </div>
          )}
        </div>

        {/* Bag with Count */}
        <Link
          to="/bag"
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition relative"
          aria-label="Shopping bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {bagItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {bagItems.length}
            </span>
          )}
        </Link>
      </div>

      {/* Photo Dots Indicator (Top under header) */}
      {currentPhotos.length > 1 && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
          {currentPhotos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-200 ${
                i === photoIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Right Floating Actions Column */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-4 text-white">
        {/* Heart / Wishlist */}
        <button
          onClick={() => toggleSave(currentSaree.id)}
          className="flex flex-col items-center gap-0.5 group"
          aria-label="Save saree"
        >
          <div className={`p-2.5 rounded-full backdrop-blur-md transition ${
            isSaved(currentSaree.id)
              ? "bg-brand-rose text-white" 
              : "bg-black/40 text-white hover:bg-black/60"
          }`}>
            <Heart className={`w-5 h-5 ${isSaved(currentSaree.id) ? "fill-white" : ""}`} />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow">
            {isSaved(currentSaree.id) ? "Saved" : "Save"}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5"
          aria-label="Share saree"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow">Share</span>
        </button>

        {/* WhatsApp Chat Question */}
        <a
          href={whatsappAskUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5"
          aria-label="Ask about this saree"
        >
          <div className="p-2.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white hover:bg-emerald-600 transition">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow">Ask</span>
        </a>
      </div>

      {/* Desktop Vertical & Horizontal Navigation Arrows */}
      <div className="hidden md:flex absolute inset-y-0 right-16 z-20 flex-col items-center justify-center gap-4">
        <button
          onClick={handlePrevSaree}
          disabled={sareeIndex === 0}
          className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition"
          aria-label="Previous saree"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextSaree}
          disabled={sareeIndex === sarees.length - 1}
          className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition"
          aria-label="Next saree"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {currentPhotos.length > 1 && (
        <div className="hidden md:flex absolute inset-x-0 bottom-36 z-20 justify-between px-6 pointer-events-none">
          <button
            onClick={handlePrevPhoto}
            disabled={photoIndex === 0}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 pointer-events-auto transition"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextPhoto}
            disabled={photoIndex === currentPhotos.length - 1}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 pointer-events-auto transition"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Bottom Info & Action Bar (Screen 2) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white max-w-md mx-auto md:max-w-4xl">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-brand-ivory drop-shadow-md">
              {currentSaree.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xl font-bold text-white drop-shadow">
                ₹ {currentSaree.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/80 text-white font-medium">
                In stock
              </span>
            </div>

            {/* Color preview dots */}
            {currentSaree.variants.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {currentSaree.variants.map((v) => (
                  <span
                    key={v.id}
                    className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: v.colorHex }}
                    title={v.colorName}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons Row (Details, Add to Bag, Buy Now) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setDetailsOpen(true)}
            className="py-3 px-4 rounded-2xl bg-white/15 backdrop-blur-md text-white font-medium text-xs border border-white/20 hover:bg-white/25 transition"
          >
            Details
          </button>

          <button
            onClick={handleAddCurrentToBag}
            className="p-3 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/25 transition"
            aria-label="Add to bag"
            title="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            onClick={() => setBuyNowOpen(true)}
            className="flex-1 py-3 px-5 rounded-2xl bg-brand-purple hover:bg-brand-plum text-white font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            Buy now
          </button>
        </div>
      </div>

      {/* Screen 3: First-Time User Swipe Hint Modal */}
      {!hasSeenHint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
          <div className="bg-brand-warmWhite rounded-3xl p-6 text-center max-w-xs shadow-2xl text-brand-dark animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-brand-blush/30 text-brand-purple mx-auto flex items-center justify-center mb-3">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-plum mb-3">How to Browse</h3>
            <div className="space-y-2 text-xs text-brand-dark/80 mb-5">
              <p className="flex items-center justify-center gap-2">
                <span className="font-bold text-brand-purple">↑ / ↓</span> Up or down: change saree
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="font-bold text-brand-purple">← / →</span> Left or right: more photos
              </p>
            </div>
            <button
              onClick={dismissHint}
              className="w-full py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Details Sheet Modal */}
      <DetailsSheet
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        product={currentSaree}
        sellerPhone={activeSellerPhone}
      />

      {/* Buy Now Sheet Modal */}
      <BuyNowSheet
        isOpen={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        product={{
          id: currentSaree.id,
          name: currentSaree.name,
          slug: currentSaree.slug,
          price: currentSaree.price,
          coverImage: currentPhotos[0],
          variants: currentSaree.variants,
        }}
        sellerPhone={activeSellerPhone}
      />
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
    </svg>
  );
}
