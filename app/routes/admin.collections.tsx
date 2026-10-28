import { useState } from "react";
import { Plus, GripVertical, Check, Eye, EyeOff } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState([
    { id: 1, name: "Silk", count: 24, onHome: true },
    { id: 2, name: "Festive", count: 18, onHome: true },
    { id: 3, name: "Cotton", count: 12, onHome: false },
    { id: 4, name: "Bridal Heirloom", count: 16, onHome: true },
  ]);

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Festive offer",
      text: "Complimentary Fall & Pico on all Pure Silks",
      collection: "Festive collection",
      dates: "Active · Ends Diwali 2026",
      isActive: true,
    },
  ]);

  const homeLayout = [
    "1. Hero Banner ('Find your festive saree')",
    "2. Categories Grid",
    "3. New Arrivals",
    "4. Festive Offer Strip",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-plum">
          Collections & Layout
        </h1>
        <p className="text-xs text-brand-dark/60">
          Curate homepage sections, promotional offers, and collection visibility
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collections Manager */}
        <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-lavender/20">
            <h3 className="font-serif font-bold text-sm text-brand-plum">Collections</h3>
            <button
              onClick={() => {
                const name = prompt("Enter new collection name:");
                if (name) setCollections([...collections, { id: Date.now(), name, count: 0, onHome: true }]);
              }}
              className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New collection
            </button>
          </div>

          <div className="space-y-2">
            {collections.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-brand-ivory/60 border border-brand-lavender/20"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-brand-dark/40 cursor-grab" />
                  <span className="font-serif font-bold text-xs text-brand-dark">{col.name}</span>
                  <span className="text-[11px] text-brand-dark/50">({col.count})</span>
                </div>

                <button
                  onClick={() => {
                    setCollections(
                      collections.map((c) => (c.id === col.id ? { ...c, onHome: !c.onHome } : c))
                    );
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${
                    col.onHome
                      ? "bg-brand-purple text-white border-brand-purple"
                      : "bg-white text-brand-dark/60 border-brand-lavender/40"
                  }`}
                >
                  {col.onHome ? "On home" : "Hidden"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promotions Manager */}
        <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-lavender/20">
            <h3 className="font-serif font-bold text-sm text-brand-plum">Promotions</h3>
            <button
              onClick={() => {
                const title = prompt("Enter promotion title:");
                if (title) setPromotions([...promotions, { id: Date.now(), title, text: "Special festive discount", collection: "All collections", dates: "Active now", isActive: true }]);
              }}
              className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New offer
            </button>
          </div>

          <div className="space-y-3">
            {promotions.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-brand-ivory/60 border border-brand-gold/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-brand-plum">{p.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-brand-dark/80">{p.text}</p>
                <div className="text-[11px] text-brand-dark/60 flex justify-between pt-1">
                  <span>Applies to: {p.collection}</span>
                  <span>{p.dates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Home Page Layout Order */}
      <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-sm text-brand-plum">Home Page Section Order</h3>
        <p className="text-xs text-brand-dark/60">
          Order of elements displayed to customers visiting the store homepage
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
          {homeLayout.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#FAF8F5] border border-brand-lavender/30 text-xs font-medium text-brand-dark flex items-center gap-2"
            >
              <GripVertical className="w-3.5 h-3.5 text-brand-purple" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
