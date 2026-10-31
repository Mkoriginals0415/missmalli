import { Link, useLocation } from "@remix-run/react";
import { Home, Sparkles, Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { isRouteActive } from "./Navbar";

interface BottomNavProps {
  hidden?: boolean;
}

export function BottomNav({ hidden = false }: BottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();
  const { getChatUrl } = useSellerPhone();

  // Hide on admin routes, feed (100dvh swipe reel), or product details (dedicated sticky buy bar)
  if (hidden || currentPath.startsWith("/admin") || currentPath.startsWith("/p/") || currentPath.startsWith("/feed")) {
    return null;
  }

  const bagCount = bagItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Sarees", to: "/sarees", icon: Sparkles },
    { label: "Wishlist", to: "/wishlist", icon: Heart, count: savedIds.length },
    { label: "Bag", to: "/bag", icon: ShoppingBag, count: bagCount },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-brand-deepPlum/10 shadow-[0_-4px_25px_rgba(42,18,53,0.08)] transition-all"
      style={{ backgroundColor: "rgb(var(--color-brand-ivory-rgb, 251 248 242))" }}
    >
      <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] px-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(item.to, location.pathname, location.search);

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 relative touch-manipulation focus-visible:outline-hidden ${
                isActive ? "text-brand-plum font-semibold" : "text-brand-deepPlum/65 hover:text-brand-plum"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.3]" : "stroke-[1.8]"}`} />
                {item.count !== undefined && item.count > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand-plum text-white text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-brand-ivory shadow-xs">
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-plum mt-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Quick WhatsApp Concierge Item - Balanced & Consistent */}
        <a
          href={getChatUrl("Hi Miss Malli, I'd like assistance with an order")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 text-brand-deepPlum/65 hover:text-emerald-700 transition-colors touch-manipulation group"
          aria-label="Chat on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 stroke-[1.8] group-hover:stroke-emerald-600 transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-brand-ivory animate-pulse" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight group-hover:text-emerald-700 transition-colors">Chat</span>
          <span className="w-1.5 h-1.5 mt-0.5" />
        </a>
      </div>
    </nav>
  );
}
