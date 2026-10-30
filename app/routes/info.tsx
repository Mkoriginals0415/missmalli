import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { ChevronDown, ChevronUp, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { useSellerPhone } from "~/hooks/useSellerPhone";

export default function StoreInfoPage() {
  const { getChatUrl } = useSellerPhone();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "shipping";
  const [activeTab, setActiveTab] = useState<string>(currentTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

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
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" },
    { id: "contact", label: "Contact & Studio" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-deepPlum">
            Store Information & Policies
          </h1>
          <p className="text-xs text-brand-deepPlum/60 mt-1">
            Handloom certifications, shipping commitments, and transparency policies
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
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
                    All in-stock sarees are dispatched within 24–48 business hours after order confirmation. Metros receive packages in 2–4 business days; rest of India within 4–6 business days. Tracking details are shared on WhatsApp as soon as your courier is booked.
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
                    <p>1. Browse sarees and tap <strong>Explore Drape</strong> or send your entire bag.</p>
                    <p>2. A dedicated request link is saved and opens WhatsApp to our concierge with the product code.</p>
                    <p>3. Confirm your delivery address, verify finishing options (fall & pico), and make payment via UPI or Net Banking.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "returns" && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-deepPlum">Exchange & Quality Guarantee</h3>
              <p className="text-xs text-brand-deepPlum/70 leading-relaxed">
                We accept exchanges within 7 days of package delivery provided the saree is unstitched, unused, in its original fold, and with all tags intact. Handloom irregularities in weaving or zari are signatures of genuine hand-woven textiles and not considered defects.
              </p>
              <p className="text-xs text-brand-deepPlum/70 leading-relaxed">
                Customized items (such as sarees with blouse stitched or fall/pico done upon bespoke request) are eligible for exchange only in case of transit damage.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <div className="flex items-center gap-2 text-brand-deepPlum font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3>Privacy Policy & Customer Confidentiality</h3>
              </div>
              <p>
                At Miss Malli, your privacy is deeply respected. We operate on a direct artisan-to-connoisseur model that does not sell, trade, or monetize customer information.
              </p>
              <div className="space-y-2 pt-1 text-brand-deepPlum/75">
                <p><strong>1. Information Collection:</strong> We only collect information necessary to process your bespoke order—namely your name, WhatsApp number, and delivery shipping address.</p>
                <p><strong>2. Order Privacy:</strong> In accordance with our discreet service, orders are never displayed publicly and can only be accessed using your unique confidential Request ID.</p>
                <p><strong>3. Payment Security:</strong> We do not store credit card or banking credentials. Payments are made through verified direct UPI apps or standard encrypted banking channels.</p>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <h3 className="font-bold text-sm text-brand-deepPlum">Terms of Service</h3>
              <p>
                By placing an order request with Miss Malli, you acknowledge and agree to our handloom craftsmanship terms:
              </p>
              <div className="space-y-2 pt-1 text-brand-deepPlum/75">
                <p><strong>1. Artisan Authenticity:</strong> All sarees are woven by traditional master craftsmen. Slight slubs, color variations, and selvedge contours reflect genuine handloom weaving.</p>
                <p><strong>2. Order Reservation:</strong> Due to limited edition handloom quantities, saree reservations are confirmed upon receipt of advance payment.</p>
                <p><strong>3. Courier Transit:</strong> All packages are insured and dispatched through premium courier partners with tracking provided directly to your WhatsApp.</p>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <h3 className="font-bold text-sm text-brand-deepPlum">Studio & WhatsApp Concierge</h3>
              <p>📍 Miss Malli Studio, Bengaluru, Karnataka, 560038</p>
              <p>✉️ Email: care@missmalli.in</p>
              <p>⏰ Hours: Monday to Saturday, 10:00 AM – 8:00 PM IST</p>
              <p className="text-brand-deepPlum/60 pt-1">
                For prompt order queries, customizations, or fabric guidance, our master stylists are available via WhatsApp chat.
              </p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3 text-xs text-brand-deepPlum/80 leading-relaxed">
              <h3 className="font-bold text-sm text-brand-deepPlum">Handwoven with Heritage</h3>
              <p>
                Miss Malli was founded with a singular purpose: connecting conscious saree connoisseurs directly with the master weavers of Varanasi, Kanchipuram, Yeola, and Chanderi.
              </p>
              <p>
                Every piece in our catalog is personally curated, certified for handloom authenticity, and stored with heirloom-level care. We bypass bloated corporate storefronts so you enjoy personal, direct WhatsApp interaction and authentic artisan pricing.
              </p>
            </div>
          )}
        </div>

        <a
          href={getChatUrl("Hi Miss Malli, I have an inquiry")}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat with WhatsApp Stylist</span>
        </a>
      </main>

      <Footer />
    </div>
  );
}
