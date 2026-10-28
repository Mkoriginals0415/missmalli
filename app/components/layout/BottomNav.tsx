import { Link, useLocation } from "@remix-run/react";
import { Home, Sparkles, Heart, ShoppingBag, MoreHorizontal } from "lucide-react";
import { useBag, useSavedSarees } from "~/hooks/useLocalStorage";

interface BottomNavProps {
  hidden?: boolean;
}

export function BottomNav({ hidden = false }: BottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { items: bagItems } = useBag();
  const { savedIds } = useSavedSarees();

  if (hidden) return null;

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Shop", to: "/feed", icon: Sparkles },
    { label: "Saved", to: "/saved", icon: Heart, count: savedIds.length },
    { label: "Bag", to: "/bag", icon: ShoppingBag, count: bagItems.length },
    { label: "More", to: "/more", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-warmWhite/95 backdrop-blur-md border-t border-brand-lavender/30 max-w-md mx-auto md:max-w-4xl transition-all duration-200">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to));

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? "text-brand-purple font-semibold" : "text-brand-dark/60 hover:text-brand-purple"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                {item.count && item.count > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-brand-purple text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
