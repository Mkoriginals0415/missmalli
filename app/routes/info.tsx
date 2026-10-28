import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";

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
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-deepPlum">
            Store Information
          </h1>
          <p className="text-xs text-brand-deepPlum/60 mt-0.5">
            Shipping policies, handloom certifications, and artisan heritage
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition ${
                activeTab === tab.id
                  ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                  : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-[28px] border border-brand-lilac/30 p-6 sm:p-8 shadow-sm space-y-4">
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <div className="border-b border-brand-lilac/20 pb-3">
                <button
                  onClick={() => toggleSection("delivery")}
                  className="flex items-center justify-between w-full text-left font-bold text-sm text-brand-deepPlum"
                >
                  <span>Delivery timeline</span>
                  {openSections.delivery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.delivery && (
                  <p className="text-xs text-brand-deepPlum/70 mt-2 leading-relaxed">
                    All in-stock sarees are dispatched within 24-48 business hours after order confirmation. Metros receive packages in 2-4 business days; rest of India within 4-6 business days. Tracking details are shared on WhatsApp as soon as your courier is booked.
                  </p>
                )}
              </div>

              <div className="border-b border-brand-lilac/20 pb-3">
                <button
                  onClick={() => toggleSection("charges")}
                  className="flex items-center justify-between w-full text-left font-bold text-sm text-brand-deepPlum"
                >
                  <span>Shipping charges</span>
                  {openSections.charges ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.charges && (
                  <p className="text-xs text-brand-deepPlum/70 mt-2 leading-relaxed">
                    We offer <strong>Complimentary Express Shipping</strong> on all prepaid saree orders across India.
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection("ordering")}
                  className="flex items-center justify-between w-full text-left font-bold text-sm text-brand-deepPlum"
                >
                  <span>How WhatsApp ordering works</span>
                  {openSections.ordering ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.ordering && (
                  <div className="text-xs text-brand-deepPlum/70 mt-2 space-y-1.5 leading-relaxed">
                    <p>1. Browse sarees and tap <strong>Buy now</strong> or send your entire bag.</p>
                    <p>2. A dedicated request link is saved and opens WhatsApp to our seller with the product code.</p>
                    <p>3. Share your address, verify final finishing options (like fall/pico), and make payment via UPI or Net Banking.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "returns" && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-deepPlum">Exchange & Quality Guarantee</h3>
              <p className="text-xs text-brand-deepPlum/70 leading-relaxed">
                We accept exchanges within 7 days of package delivery provided the saree is unstitched, unused, in original fold, and with all tags intact. Handloom irregularities in weaving or zari are signatures of genuine hand-woven textiles and not considered defects.
              </p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <h3 className="font-bold text-sm text-brand-deepPlum">Studio & WhatsApp Concierge</h3>
              <p>📍 Miss Malli Studio, Bengaluru, Karnataka, 560038</p>
              <p>📞 WhatsApp: +91 98765 43210</p>
              <p>✉️ Email: care@missmalli.com</p>
              <p>⏰ Hours: Monday to Saturday, 10:00 AM – 8:00 PM IST</p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <h3 className="font-bold text-sm text-brand-deepPlum">Handwoven with Love</h3>
              <p>
                Miss Malli was founded with a singular purpose: connecting conscious saree connoisseurs directly with the master weavers of Varanasi, Kanchipuram, Yeola, and Chanderi.
              </p>
              <p>
                Every piece in our catalog is personally curated, certified for handloom authenticity, and stored with heirloom-level care. We bypass bloated corporate storefronts so you enjoy personal, direct WhatsApp interaction and wholesale artisan pricing.
              </p>
            </div>
          )}
        </div>

        <a
          href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I%20have%20an%20inquiry"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Message Seller on WhatsApp</span>
        </a>
      </main>

      <Footer />
    </div>
  );
}
