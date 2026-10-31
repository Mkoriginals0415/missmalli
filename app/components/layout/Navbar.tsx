import { useState } from "react";
import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";
import { Heart, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { DEFAULT_NAV_LINKS, NavLinkItem } from "~/db/mock-data";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();
  const { getChatUrl } = useSellerPhone();
  const bagCount = bagItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const rootData = useRouteLoaderData<{ navLinks?: NavLinkItem[] }>("root");
  const navLinks = (rootData?.navLinks || DEFAULT_NAV_LINKS).filter((l) => l.enabled !== false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-lilac/30 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between relative">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden w-12 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-brand-deepPlum hover:text-brand-plum rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Mobile Dead-Centered Logo Lockup */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link to="/" className="flex flex-col items-center py-1 group focus-visible:ring-2 focus-visible:ring-brand-plum rounded-lg">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-8 w-auto object-contain hover:opacity-95 transition"
              />
              <span className="font-serif italic text-[8.5px] tracking-wider text-brand-plum/90 uppercase -mt-0.5 whitespace-nowrap">
                Made for Her Moments
              </span>
            </Link>
          </div>

          {/* Desktop Brand Logo Lockup */}
          <Link to="/" className="hidden lg:flex items-center gap-3 group py-1 focus-visible:ring-2 focus-visible:ring-brand-plum rounded-lg">
            <img
              src="/brand/logo.png"
              alt="Miss Malli"
              className="h-11 w-auto object-contain hover:opacity-95 transition"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-brand-deepPlum group-hover:text-brand-plum transition leading-none">
                Miss Malli
              </span>
              <span className="font-serif italic text-[10px] tracking-widest text-brand-plum/80 uppercase mt-0.5">
                Made for Her Moments
              </span>
            </div>
          </Link>

          {/* Center Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-brand-deepPlum">
            {navLinks.map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`nav-link-animated py-1.5 transition-colors hover:text-brand-plum focus-visible:ring-2 focus-visible:ring-brand-plum rounded-md ${
                    isActive ? "active text-brand-plum font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/wishlist"
              className="p-2 text-brand-deepPlum hover:text-brand-plum active:scale-90 transition relative min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-plum rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2.2]" />
              {savedIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-plum text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs animate-heart-burst">
                  {savedIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/bag"
              className="p-2 text-brand-deepPlum hover:text-brand-plum active:scale-90 transition relative min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-plum rounded-full"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {bagCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-plum text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs animate-heart-burst">
                  {bagCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Support / Order pill button */}
            <a
              href={getChatUrl("Hi Miss Malli, I'd like assistance with an order")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-deepPlum text-white text-[13px] font-semibold hover:bg-brand-plum active:scale-95 transition shadow-md focus-visible:ring-2 focus-visible:ring-brand-plum"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>
      </header>

      {/* Luxury Mobile Slide-over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-brand-deepPlum/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-[82%] max-w-sm bg-brand-ivory shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-brand-lilac/30 animate-in slide-in-from-left duration-300">
            <div>
              {/* Header inside Drawer */}
              <div className="p-5 flex items-center justify-between border-b border-brand-lilac/30">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/brand/logo.png"
                    alt="Miss Malli"
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-brand-deepPlum/15 shadow-2xs"
                  />
                  <div>
                    <span className="font-serif font-bold text-base tracking-wide text-brand-deepPlum block leading-tight">
                      MISS MALLI
                    </span>
                    <span className="font-serif italic text-[10px] tracking-wider text-brand-plum block mt-0.5">
                      Made for Her Moments
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-brand-deepPlum hover:text-brand-plum rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 stroke-[2.2]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-5 space-y-1">
                {navLinks.map((link) => {
                  const isActive = currentPath === link.to;
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition ${
                        isActive
                          ? "bg-brand-plum/10 text-brand-plum font-bold"
                          : "text-brand-deepPlum hover:bg-brand-lilac/20"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-plum" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions & Support inside Drawer */}
            <div className="p-5 border-t border-brand-lilac/30 space-y-3 bg-brand-warmWhite/60">
              <a
                href={getChatUrl("Hi Miss Malli, I have an enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with WhatsApp Stylist</span>
              </a>

              <div className="flex items-center justify-between pt-2 text-xs font-medium text-brand-deepPlum/70">
                <Link
                  to="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-brand-plum underline font-bold"
                >
                  Track Request
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-brand-plum underline"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
