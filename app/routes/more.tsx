import { Link } from "@remix-run/react";
import { 
  Package, 
  Truck, 
  HelpCircle, 
  Info, 
  Shield, 
  Trash2, 
  ChevronRight, 
  MessageCircle
} from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { clearAllLocalData } from "~/hooks/useLocalStorage";
import { useSellerPhone } from "~/hooks/useSellerPhone";

export default function MorePage() {
  const { getChatUrl } = useSellerPhone();

  const handleClearData = () => {
    if (confirm("Clear all saved sarees, bag, and request history from this device?")) {
      clearAllLocalData();
      alert("Local data cleared.");
      window.location.reload();
    }
  };

  const menuItems = [
    { label: "Track My Orders & Requests", to: "/track", icon: Package },
    { label: "Shipping and Returns", to: "/info?tab=shipping", icon: Truck },
    { label: "Contact and Support", to: "/info?tab=contact", icon: HelpCircle },
    { label: "About Miss Malli", to: "/info?tab=about", icon: Info },
    { label: "Privacy Policy", to: "/info?tab=privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-deepPlum">
            More Options
          </h1>
          <p className="text-xs text-brand-deepPlum/60 mt-1">
            Store policies, order tracking, and concierge assistance
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-brand-lilac/30 shadow-sm overflow-hidden divide-y divide-brand-lilac/20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between p-4 hover:bg-brand-ivory/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-lilac/20 text-brand-plum flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-brand-deepPlum group-hover:text-brand-plum">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-deepPlum/40 group-hover:text-brand-plum" />
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
                Clear saved items on this device
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Need Help Box */}
        <div className="p-5 rounded-3xl bg-white border border-brand-lilac/30 space-y-2 text-center shadow-xs">
          <span className="text-xs font-bold text-brand-plum uppercase tracking-wider block">
            Need styling advice or order help?
          </span>
          <p className="text-xs text-brand-deepPlum/70">
            Chat directly with our concierge team on WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href={getChatUrl("Hi Miss Malli, I would like assistance with a saree")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
          <span className="text-[10px] text-brand-deepPlum/50 block pt-1">Available Mon – Sat, 10 AM – 8 PM IST</span>
        </div>

        {/* Admin Link */}
        <div className="text-center pt-2">
          <Link to="/admin" className="text-xs text-brand-plum/70 hover:text-brand-plum underline">
            Seller Admin Portal
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
