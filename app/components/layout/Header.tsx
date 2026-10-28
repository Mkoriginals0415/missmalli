import { Link } from "@remix-run/react";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideNavLinks?: boolean;
}

export function Header({ title, showBack, onBack, hideNavLinks = false }: HeaderProps) {
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();

  return (
    <header className="sticky top-0 z-30 bg-brand-warmWhite/95 backdrop-blur-md border-b border-brand-lavender/20">
      {/* Announcement Bar */}
      <div className="bg-brand-plum text-brand-ivory text-[12px] py-1.5 px-3 text-center tracking-wide font-sans flex items-center justify-center gap-2">
        <span>✨ Handcrafted Pure Silks & Festive Sarees</span>
        <span className="hidden sm:inline">· Direct WhatsApp Order Assistance</span>
      </div>

      {/* Main Header Row */}
      <div className="flex items-center justify-between px-4 py-2.5 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack || (() => window.history.back())}
              className="p-1 -ml-1 text-brand-dark/80 hover:text-brand-purple"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}

          <Link to="/" className="flex items-center gap-2">
            <img
              src="/brand/logo.png"
              alt="Miss Malli"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        {!hideNavLinks && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-dark/80">
            <Link to="/feed" className="hover:text-brand-purple transition">Shop Feed</Link>
            <Link to="/shop?collection=silk" className="hover:text-brand-purple transition">Silk</Link>
            <Link to="/shop?collection=cotton" className="hover:text-brand-purple transition">Cotton</Link>
            <Link to="/shop?collection=festive" className="hover:text-brand-purple transition">Festive</Link>
            <Link to="/info?tab=about" className="hover:text-brand-purple transition">About</Link>
            <Link to="/admin" className="text-brand-purple hover:underline text-xs">Admin</Link>
          </nav>
        )}

        {/* Actions (Search, Wishlist, Bag) */}
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="p-1.5 text-brand-dark/70 hover:text-brand-purple transition"
            aria-label="Search sarees"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            to="/saved"
            className="p-1.5 text-brand-dark/70 hover:text-brand-purple transition relative"
            aria-label="Saved sarees"
          >
            <Heart className="w-5 h-5" />
            {savedIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {savedIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/bag"
            className="p-1.5 text-brand-dark/70 hover:text-brand-purple transition relative"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {bagItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {bagItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
