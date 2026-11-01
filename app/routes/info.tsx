import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams, Link } from "@remix-run/react";
import { ChevronDown, ChevronUp, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "~/components/layout/Footer";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { getStoreSettings } from "~/db/d1.server";
import { DEFAULT_STORE_POLICIES, StorePolicies } from "~/db/mock-data";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);
  let policies: StorePolicies = DEFAULT_STORE_POLICIES;
  try {
    if (settings.store_policies) {
      policies = { ...DEFAULT_STORE_POLICIES, ...JSON.parse(settings.store_policies) };
    }
  } catch (e) {}
  return json({ policies });
}

export default function StoreInfoPage() {
  const { policies } = useLoaderData<typeof loader>();
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
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "returns", label: "Returns & Exchanges" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" },
    { id: "about", label: "Our Story" },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
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
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-brand-deepPlum">Returns & Exchanges Policy</h3>
              <div className="text-xs text-brand-deepPlum/80 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {policies.returnsExchange}
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-deepPlum font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3>Privacy Policy & Customer Confidentiality</h3>
              </div>
              <div className="text-xs text-brand-deepPlum/80 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {policies.privacyPolicy}
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-brand-deepPlum">Terms of Service</h3>
              <div className="text-xs text-brand-deepPlum/80 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {policies.termsOfService}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-plum font-bold text-sm">
                <Sparkles className="w-4 h-4 text-brand-plum" />
                <h3>{policies.ourStoryHeadline || "Threads of Tradition, Woven for You"}</h3>
              </div>
              <div className="text-xs text-brand-deepPlum/80 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {policies.ourStoryBody}
              </div>
              {policies.ourStoryMission && (
                <div className="p-4 rounded-xl bg-brand-ivory/60 border border-brand-lilac/30 text-xs italic text-brand-deepPlum/70">
                  "{policies.ourStoryMission}"
                </div>
              )}
              <div className="pt-2">
                <Link
                  to="/artisans"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-xs"
                >
                  <span>Explore Full Story & Master Weavers</span>
                  <span>→</span>
                </Link>
              </div>
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
