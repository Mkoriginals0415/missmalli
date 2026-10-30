import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Search, ArrowRight, Package, ShieldCheck } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";

export default function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().replace(/^#/, "");
    if (!clean) {
      setErrorMsg("Please enter your Request ID (e.g. 8492K)");
      return;
    }
    setErrorMsg("");
    navigate(`/r/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-8 py-14 space-y-8">
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center shadow-xs">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-deepPlum">
            Track Your Order
          </h1>
          <p className="text-sm text-brand-deepPlum/70 max-w-md mx-auto leading-relaxed">
            Enter your unique Request ID to see live WhatsApp confirmation, reserve status, and courier dispatch tracking.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lilac/30 shadow-md">
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="track-input" className="block text-xs font-bold uppercase tracking-wider text-brand-deepPlum/70">
              Enter Request ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="track-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="e.g. 8492K or 4921M"
                  className="w-full px-4 py-3.5 pl-11 rounded-full border border-brand-lilac/40 focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-none text-base font-semibold text-brand-deepPlum bg-brand-ivory/50 uppercase placeholder:normal-case placeholder:font-normal"
                  autoFocus
                />
                <Search className="w-5 h-5 text-brand-deepPlum/40 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-brand-deepPlum text-white font-semibold text-sm hover:bg-brand-plum transition shadow-md flex items-center gap-2 shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium pl-2">{errorMsg}</p>
            )}
            <div className="flex items-center gap-1.5 pt-2 text-xs text-brand-deepPlum/55">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>For privacy, orders are only revealed when searched with the exact Request ID.</span>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
