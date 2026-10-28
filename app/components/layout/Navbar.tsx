import { useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Heart, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Sarees", to: "/sarees" },
    { label: "Sale", to: "/sarees?filter=sale" },
    { label: "Dresses", to: "/sarees?collection=dresses" },
    { label: "Dress Materials", to: "/sarees?collection=materials" },
    { label: "Exclusive", to: "/sarees?collection=exclusive" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-lilac/30 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-deepPlum hover:text-brand-plum rounded-lg"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Real Brand Logo Image from workspace */}
        <Link to="/" className="flex items-center group py-1">
          <img
            src="/brand/logo.png"
            alt="Miss Malli"
            className="h-10 sm:h-12 w-auto object-contain hover:opacity-95 transition"
          />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-brand-deepPlum">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`transition-colors hover:text-brand-plum relative py-1 ${
                  isActive ? "text-brand-plum font-bold" : ""
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-plum rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons (Search removed per user request) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/wishlist"
            className="p-2 text-brand-deepPlum hover:text-brand-plum transition relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[2.2]" />
            {savedIds.length > 0 && (
              <span className="absolute top-1 right-1 bg-brand-plum text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {savedIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/bag"
            className="p-2 text-brand-deepPlum hover:text-brand-plum transition relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {bagItems.length > 0 && (
              <span className="absolute top-1 right-1 bg-brand-plum text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {bagItems.length}
              </span>
            )}
          </Link>

          {/* WhatsApp Support / Order pill button */}
          <a
            href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I'd%20like%20assistance%20with%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-deepPlum text-white text-[13px] font-semibold hover:bg-brand-plum transition shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Order</span>
          </a>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-ivory border-b border-brand-lilac/40 px-6 py-5 space-y-4 animate-fade-in shadow-lg">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-brand-deepPlum">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand-plum"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-brand-lilac/30 flex flex-col gap-2.5">
            <Link
              to="/my-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-brand-plum hover:underline"
            >
              Track WhatsApp Orders
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-brand-deepPlum/70 hover:underline"
            >
              Seller Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
