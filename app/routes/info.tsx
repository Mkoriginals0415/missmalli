import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";

export default function StoreInfoPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "shipping";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    delivery: true,
    charges: false,
    ordering: false,
    exchange: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "shipping", label: "Shipping" },
    { id: "returns", label: "Returns" },
    { id: "contact", label: "Contact" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-5">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
          Store Info
        </h1>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeTab === tab.id
                  ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                  : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl border border-brand-lavender/30 p-5 shadow-sm space-y-4">
          {activeTab === "shipping" && (
            <div className="space-y-3">
              <div className="border-b border-brand-lavender/20 pb-3">
                <button
                  onClick={() => toggleSection("delivery")}
                  className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum text-sm"
                >
                  <span>Delivery time</span>
                  {openSections.delivery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.delivery && (
                  <p className="text-xs text-brand-dark/75 mt-2 leading-relaxed">
                    All in-stock sarees are dispatched within 24-48 business hours after order confirmation. Metros receive packages in 2-4 business days; rest of India within 4-6 business days. Tracking details are shared on WhatsApp as soon as your courier is booked.
                  </p>
                )}
              </div>

              <div className="border-b border-brand-lavender/20 pb-3">
                <button
                  onClick={() => toggleSection("charges")}
                  className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum text-sm"
                >
                  <span>Shipping charges</span>
                  {openSections.charges ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.charges && (
                  <p className="text-xs text-brand-dark/75 mt-2 leading-relaxed">
                    We offer <strong>Complimentary Express Shipping</strong> on all prepaid saree orders across India. For special express international courier requests, international shipping rates will be quoted in WhatsApp chat based on destination.
                  </p>
                )}
              </div>

              <div className="pb-1">
                <button
                  onClick={() => toggleSection("ordering")}
                  className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum text-sm"
                >
                  <span>How ordering works</span>
                  {openSections.ordering ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.ordering && (
                  <div className="text-xs text-brand-dark/75 mt-2 space-y-1.5 leading-relaxed">
                    <p>1. Browse sarees and tap <strong>Buy now</strong> or send your entire bag.</p>
                    <p>2. A dedicated request link is saved and opens WhatsApp to our seller.</p>
                    <p>3. Share your address, verify final finishing options (like fall/pico), and make payment via UPI or Net Banking.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "returns" && (
            <div className="space-y-3">
              <div className="border-b border-brand-lavender/20 pb-3">
                <button
                  onClick={() => toggleSection("exchange")}
                  className="flex items-center justify-between w-full text-left font-serif font-bold text-brand-plum text-sm"
                >
                  <span>Exchange policy</span>
                  {openSections.exchange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.exchange && (
                  <p className="text-xs text-brand-dark/75 mt-2 leading-relaxed">
                    We accept exchanges within 7 days of package delivery provided the saree is unstitched, unused, in original fold, and with all tags intact. Handloom irregularities in weaving or zari are signatures of genuine hand-woven textiles and not considered defects.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-3 text-xs text-brand-dark/80 leading-relaxed">
              <h3 className="font-serif font-bold text-brand-plum text-sm">Concierge & Studio</h3>
              <p>📍 Miss Malli Handloom Studio, Indiranagar, Bengaluru, Karnataka, 560038</p>
              <p>📞 WhatsApp / Phone: +91 98765 43210</p>
              <p>✉️ Email: care@missmalli.com</p>
              <p>⏰ Working Hours: Monday to Saturday, 10:00 AM – 8:00 PM IST</p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3 text-xs text-brand-dark/80 leading-relaxed">
              <h3 className="font-serif font-bold text-brand-plum text-sm">Made for Her Moments</h3>
              <p>
                Miss Malli was founded with a singular purpose: connecting conscious saree connoisseurs directly with the master weavers of Varanasi, Kanchipuram, Yeola, and Chanderi.
              </p>
              <p>
                Every piece in our catalog is personally curated, certified for handloom authenticity, and stored with heirloom-level care. We bypass bloated corporate storefronts so you enjoy personal, direct WhatsApp interaction and wholesale artisan pricing.
              </p>
            </div>
          )}
        </div>

        {/* Message the seller CTA button */}
        <a
          href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I%20have%20an%20inquiry"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Message the seller on WhatsApp
        </a>
      </main>

      <BottomNav />
    </div>
  );
}
