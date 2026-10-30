import { Link } from "@remix-run/react";
import { 
  ShoppingBag, 
  Truck, 
  HelpCircle, 
  Info, 
  Shield, 
  Trash2, 
  ChevronRight, 
  MessageCircle,
  Sparkles
} from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { clearAllLocalData } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";

export default function MorePage() {
  const { getChatUrl, formatted } = useSellerPhone();
  const handleClearData = () => {
    if (confirm("Clear all saved sarees, bag, and request history from this device?")) {
      clearAllLocalData();
      alert("Local data cleared.");
      window.location.reload();
    }
  };

  const menuItems = [
    { label: "My requests", to: "/my-requests", icon: ShoppingBag },
    { label: "Shipping and returns", to: "/info?tab=shipping", icon: Truck },
    { label: "Contact and support", to: "/info?tab=contact", icon: HelpCircle },
    { label: "About Miss Malli", to: "/info?tab=about", icon: Info },
    { label: "Privacy Policy", to: "/info?tab=privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-5">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
          More
        </h1>

        <div className="bg-white rounded-3xl border border-brand-lavender/30 shadow-sm overflow-hidden divide-y divide-brand-lavender/20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between p-4 hover:bg-brand-ivory transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-lavender/20 text-brand-purple flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-brand-dark group-hover:text-brand-purple">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-dark/40 group-hover:text-brand-purple" />
              </Link>
            );
          })}

          {/* Clear saved items */}
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-red-600">
                Clear saved items on this phone
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Need Help Box */}
        <div className="p-4 rounded-3xl bg-brand-ivory border border-brand-purple/20 space-y-2 text-center">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider block">
            Need styling advice or order help?
          </span>
          <p className="text-xs text-brand-dark/70">
            Chat directly with our concierge team on WhatsApp.
          </p>
          <div className="pt-1">
            <a
              href={getChatUrl("Hi Miss Malli, I'd like assistance with a saree")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {formatted}</span>
            </a>
          </div>
          <span className="text-[10px] text-brand-dark/50 block">Available Mon – Sat, 10 AM – 8 PM IST</span>
        </div>

        {/* Admin Link */}
        <div className="text-center pt-2">
          <Link to="/admin" className="text-xs text-brand-purple/70 hover:text-brand-purple underline">
            Seller Admin Portal
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
