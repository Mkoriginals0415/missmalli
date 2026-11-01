import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";
import { Heart, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "~/components/ui/WhatsAppIcon";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { DEFAULT_NAV_LINKS, NavLinkItem } from "~/db/mock-data";

export function isRouteActive(linkTo: string, pathname: string, search: string): boolean {
  const currentPath = (pathname || "").toLowerCase().replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(search || "");
  const collection = (params.get("collection") || "").toLowerCase();
  const filter = (params.get("filter") || "").toLowerCase();

  // Normalize link target
  const target = (linkTo || "").toLowerCase();

  // 1. Home
  if (target === "/") {
    return currentPath === "/";
  }

  // 2. Sale
  if (target === "/sale" || target.includes("filter=sale")) {
    return currentPath === "/sale" || filter === "sale";
  }

  // 3. Dresses
  if (target === "/dresses" || target.includes("collection=dresses")) {
    return currentPath === "/dresses" || collection === "dresses";
  }

  // 4. Dress Materials
  if (target === "/materials" || target.includes("collection=materials")) {
    return currentPath === "/materials" || collection === "materials";
  }

  // 5. Exclusive
  if (target === "/exclusive" || target.includes("collection=exclusive")) {
    return currentPath === "/exclusive" || collection === "exclusive";
  }

  // 6. Artisans / Our Story
  if (target === "/artisans") {
    return currentPath === "/artisans";
  }

  // 7. Info / About / Contact
  if (target === "/info") {
    return currentPath === "/info";
  }

  // 8. Sarees (Pure Sarees page: MUST NOT be active if viewing other distinct collections/filters!)
  if (target === "/sarees" || target.startsWith("/sarees")) {
    if (currentPath !== "/sarees" && !currentPath.startsWith("/p/")) {
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

  return currentPath === target.replace(/\/+$/, "");
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Hide on admin routes or feed (100dvh swipe reel)
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/feed")) {
    return null;
  }

  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();
  const { getChatUrl } = useSellerPhone();
  const bagCount = bagItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const rootData = useRouteLoaderData<{ navLinks?: NavLinkItem[] }>("root");
  const navLinks = (rootData?.navLinks || DEFAULT_NAV_LINKS).filter((l) => l.enabled !== false);

  // Dynamic sliding pill ref & positioning
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const hasPositionedRef = useRef(false);

  const updatePill = (smooth = true) => {
    if (!navRef.current || !pillRef.current) return;
    const links = Array.from(navRef.current.querySelectorAll("a"));
    const activeIdx = navLinks.findIndex((link) =>
      isRouteActive(link.to, location.pathname, location.search)
    );

    const pillEl = pillRef.current;
    if (activeIdx >= 0 && links[activeIdx]) {
      const targetEl = links[activeIdx];
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const left = targetRect.left - navRect.left;
      const width = targetRect.width;
      const top = targetRect.top - navRect.top;
      const height = targetRect.height;

      if (!hasPositionedRef.current || !smooth) {
        // Initial mount or resize: ZERO ANIMATION / ZERO JUMP
        pillEl.style.transition = "none";
        pillEl.style.left = `${left}px`;
        pillEl.style.width = `${width}px`;
        pillEl.style.top = `${top}px`;
        pillEl.style.height = `${height}px`;
        pillEl.style.opacity = "1";
        void pillEl.offsetHeight; // Force reflow
        pillEl.style.transition = "";
        hasPositionedRef.current = true;
      } else {
        // User navigation / tab change: smooth fluid glide
        pillEl.style.left = `${left}px`;
        pillEl.style.width = `${width}px`;
        pillEl.style.top = `${top}px`;
        pillEl.style.height = `${height}px`;
        pillEl.style.opacity = "1";
      }

      try {
        sessionStorage.setItem("mm_nav_pill_pos", JSON.stringify({ left, width, top, height }));
      } catch {}
    } else {
      pillEl.style.opacity = "0";
    }
  };

  useEffect(() => {
    updatePill(hasPositionedRef.current);
    const handleResize = () => updatePill(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname, location.search, navLinks.length]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-lilac/30 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between relative">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-brand-deepPlum hover:text-brand-plum rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Mobile Centered Logo Lockup (Flex-centered, strictly bounded, cannot overlap) */}
          <div className="lg:hidden flex-1 flex items-center justify-center min-w-0 px-2">
            <Link to="/" prefetch="intent" className="flex items-center gap-2 group py-1 max-w-full">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover mix-blend-multiply hover:opacity-95 transition shrink-0"
              />
              <img
                src="/brand/logo-rect-transparent.png"
                alt="Miss Malli - Made for Her Moments"
                className="h-9 sm:h-10 w-auto max-w-[160px] sm:max-w-[210px] object-contain shrink-0 group-hover:opacity-90 transition"
              />
            </Link>
          </div>

          {/* Desktop Brand Logo Lockup */}
          <Link to="/" prefetch="intent" className="hidden lg:flex items-center gap-3.5 group py-1 focus-visible:ring-2 focus-visible:ring-brand-plum rounded-lg shrink-0">
            <img
              src="/brand/logo.png"
              alt="Miss Malli"
              className="h-11 w-11 rounded-full object-cover mix-blend-multiply hover:opacity-95 transition shrink-0"
            />
            <img
              src="/brand/logo-rect-transparent.png"
              alt="Miss Malli - Made for Her Moments"
              className="h-12 lg:h-13 w-auto object-contain shrink-0 group-hover:opacity-90 transition"
            />
          </Link>

          {/* Center Desktop Navigation with Animated Sliding Pill */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1 p-1 rounded-full bg-brand-deepPlum/[0.04] border border-brand-deepPlum/10 backdrop-blur-xs select-none"
            aria-label="Main Navigation"
          >
            {/* The animated sliding pill */}
            <span
              ref={pillRef}
              className="absolute rounded-full bg-brand-primary shadow-xs pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: 0, width: 0, top: 0, height: 0, opacity: 0 }}
            />

            {navLinks.map((link) => {
              const isActive = isRouteActive(link.to, location.pathname, location.search);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  prefetch="intent"
                  onClick={(e) => {
                    const navEl = navRef.current;
                    const pillEl = pillRef.current;
                    if (navEl && pillEl) {
                      const targetEl = e.currentTarget;
                      const navRect = navEl.getBoundingClientRect();
                      const targetRect = targetEl.getBoundingClientRect();
                      const left = targetRect.left - navRect.left;
                      const width = targetRect.width;
                      const top = targetRect.top - navRect.top;
                      const height = targetRect.height;

                      pillEl.style.left = `${left}px`;
                      pillEl.style.width = `${width}px`;
                      pillEl.style.top = `${top}px`;
                      pillEl.style.height = `${height}px`;
                      pillEl.style.opacity = "1";
                      hasPositionedRef.current = true;
                      try {
                        sessionStorage.setItem("mm_nav_pill_pos", JSON.stringify({ left, width, top, height }));
                      } catch {}
                    }
                  }}
                  className={`relative z-10 px-4 py-2 rounded-full text-[13px] transition-colors duration-200 select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-plum ${
                    isActive
                      ? "text-brand-dark font-black"
                      : "text-brand-deepPlum/80 hover:text-brand-deepPlum hover:bg-brand-deepPlum/[0.05] font-semibold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <Link
              to="/wishlist"
              prefetch="intent"
              className="p-2 text-brand-deepPlum hover:text-brand-plum active:scale-90 transition relative min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-plum rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2.2]" />
              {savedIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-primary text-brand-dark text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs animate-heart-burst">
                  {savedIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/bag"
              prefetch="intent"
              className="p-2 text-brand-deepPlum hover:text-brand-plum active:scale-90 transition relative min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-plum rounded-full"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {bagCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-primary text-brand-dark text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs animate-heart-burst">
                  {bagCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Support / Order pill button */}
            <a
              href={getChatUrl("Hi Miss Malli, I'd like assistance with an order")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-[13px] font-bold border border-brand-primary/30 hover:bg-[#a085cc] active:scale-95 transition shadow-sm focus-visible:ring-2 focus-visible:ring-brand-plum group"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" fill="#25D366" />
              <span className="text-[#25D366] font-bold">WhatsApp Order</span>
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
                    className="h-9 w-9 rounded-full object-cover mix-blend-multiply ring-1 ring-brand-deepPlum/15 shadow-2xs shrink-0"
                  />
                  <img
                    src="/brand/logo-rect-transparent.png"
                    alt="Miss Malli - Made for Her Moments"
                    className="h-9 w-auto max-w-[170px] object-contain shrink-0"
                  />
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
                      prefetch="intent"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base transition ${
                        isActive
                          ? "bg-brand-primary text-brand-dark font-black shadow-xs border border-brand-secondary/20"
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
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full bg-brand-ivory border border-emerald-500/30 font-bold text-sm shadow-sm hover:bg-emerald-50 transition"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" fill="#25D366" />
                <span className="text-[#25D366]">Chat with WhatsApp Stylist</span>
              </a>

              <div className="flex items-center justify-between pt-2 text-xs font-medium text-brand-deepPlum/70">
                <Link
                  to="/track"
                  prefetch="intent"
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
