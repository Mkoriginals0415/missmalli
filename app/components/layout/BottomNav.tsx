import { Link, useLocation } from "@remix-run/react";
import { Home, Sparkles, Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";

interface BottomNavProps {
  hidden?: boolean;
}

export function BottomNav({ hidden = false }: BottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();

  // Hide on admin routes or product details (PDP has its own dedicated sticky buy bar)
  if (hidden || currentPath.startsWith("/admin") || currentPath.startsWith("/p/")) {
    return null;
  }

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Sarees", to: "/sarees", icon: Sparkles },
    { label: "Wishlist", to: "/wishlist", icon: Heart, count: savedIds.length },
    { label: "Bag", to: "/bag", icon: ShoppingBag, count: bagItems.length },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-ivory/95 backdrop-blur-lg border-t border-brand-deepPlum/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-around h-16 px-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative touch-manipulation ${
                isActive ? "text-brand-plum font-bold" : "text-brand-deepPlum/60 hover:text-brand-plum"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
                {item.count !== undefined && item.count > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand-plum text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-plum mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Quick WhatsApp Concierge Item */}
        <a
          href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I'd%20like%20assistance%20with%20an%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 text-emerald-700 hover:text-emerald-800 transition-colors touch-manipulation"
          aria-label="Chat on WhatsApp"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-bold text-emerald-800">Chat</span>
        </a>
      </div>
    </nav>
  );
}
