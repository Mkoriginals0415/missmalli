import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";
import { Heart, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { DEFAULT_NAV_LINKS, NavLinkItem } from "~/db/mock-data";

export function isRouteActive(linkTo: string, pathname: string, search: string): boolean {
  const params = new URLSearchParams(search);
  const collection = params.get("collection") || "";
  const filter = params.get("filter") || "";

  // 1. Home
  if (linkTo === "/") {
    return pathname === "/";
  }

  // 2. Sale
  if (linkTo === "/sale" || linkTo.includes("filter=sale")) {
    return pathname === "/sale" || filter === "sale";
  }

  // 3. Dresses
  if (linkTo === "/dresses" || linkTo.includes("collection=dresses")) {
    return pathname === "/dresses" || collection === "dresses";
  }

  // 4. Dress Materials
  if (linkTo === "/materials" || linkTo.includes("collection=materials")) {
    return pathname === "/materials" || collection === "materials";
  }

  // 5. Exclusive
  if (linkTo === "/exclusive" || linkTo.includes("collection=exclusive")) {
    return pathname === "/exclusive" || collection === "exclusive";
  }

  // 6. Artisans / Our Story
  if (linkTo === "/artisans") {
    return pathname === "/artisans";
  }

  // 7. Info / About / Contact
  if (linkTo === "/info") {
    return pathname === "/info";
  }

  // 8. Sarees (Pure Sarees page: MUST NOT be active if viewing other distinct collections/filters!)
  if (linkTo === "/sarees") {
    if (pathname !== "/sarees" && !pathname.startsWith("/p/")) {
      return false;
    }
    if (
      filter === "sale" ||
      collection === "dresses" ||
      collection === "materials" ||
      collection === "exclusive"
    ) {
      return false;
    }
    return true;
  }

  return pathname === linkTo;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();
  const { getChatUrl } = useSellerPhone();
  const bagCount = bagItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const rootData = useRouteLoaderData<{ navLinks?: NavLinkItem[] }>("root");
  const navLinks = (rootData?.navLinks || DEFAULT_NAV_LINKS).filter((l) => l.enabled !== false);

  // Dynamic sliding pill state
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    top: number;
    height: number;
    opacity: number;
  }>({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const updatePill = () => {
      const activeIdx = navLinks.findIndex((link) =>
        isRouteActive(link.to, location.pathname, location.search)
      );

      if (activeIdx >= 0 && linkRefs.current[activeIdx] && navRef.current) {
        const targetEl = linkRefs.current[activeIdx]!;
        const navEl = navRef.current;
        const targetRect = targetEl.getBoundingClientRect();
        const navRect = navEl.getBoundingClientRect();

        setPillStyle({
          left: targetRect.left - navRect.left,
          width: targetRect.width,
          top: targetRect.top - navRect.top,
          height: targetRect.height,
          opacity: 1,
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [location.pathname, location.search, navLinks]);

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
                className="h-8 w-8 rounded-full object-cover mix-blend-multiply hover:opacity-95 transition"
              />
              <span className="font-serif italic text-[8.5px] tracking-wider text-brand-plum/90 uppercase mt-0.5 whitespace-nowrap">
                Made for Her Moments
              </span>
            </Link>
          </div>

          {/* Desktop Brand Logo Lockup */}
          <Link to="/" className="hidden lg:flex items-center gap-3 group py-1 focus-visible:ring-2 focus-visible:ring-brand-plum rounded-lg">
            <img
              src="/brand/logo.png"
              alt="Miss Malli"
              className="h-11 w-11 rounded-full object-cover mix-blend-multiply hover:opacity-95 transition"
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

          {/* Center Desktop Navigation with Animated Sliding Pill */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1 p-1 rounded-full bg-brand-deepPlum/[0.04] border border-brand-deepPlum/10 backdrop-blur-xs select-none"
            aria-label="Main Navigation"
          >
            {/* The animated sliding pill */}
            <span
              className="absolute rounded-full bg-brand-deepPlum shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                top: `${pillStyle.top}px`,
                height: `${pillStyle.height}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {navLinks.map((link, idx) => {
              const isActive = isRouteActive(link.to, location.pathname, location.search);
              return (
                <Link
                  key={link.label}
                  ref={(el) => { linkRefs.current[idx] = el; }}
                  to={link.to}
                  className={`relative z-10 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors duration-200 select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-plum ${
                    isActive
                      ? "!text-white font-bold"
                      : "text-brand-deepPlum/80 hover:text-brand-deepPlum hover:bg-brand-deepPlum/[0.05]"
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
                    className="h-9 w-9 rounded-full object-cover mix-blend-multiply ring-1 ring-brand-deepPlum/15 shadow-2xs"
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
                  const isActive = isRouteActive(link.to, location.pathname, location.search);
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base transition ${
                        isActive
                          ? "bg-brand-deepPlum text-white font-bold shadow-xs"
                          : "text-brand-deepPlum hover:bg-brand-lilac/20 font-medium"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-gold shadow-2xs" />
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
