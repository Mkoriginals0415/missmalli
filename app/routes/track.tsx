import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Search, ArrowRight, Package, Clock, ExternalLink } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { useMyRequests } from "~/hooks/useLocalStorage";

export default function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { requestsList, isLoaded } = useMyRequests();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().replace(/^#/, "");
    if (!clean) {
      setErrorMsg("Please enter your Request ID or Order number (e.g. #1042)");
      return;
    }
    setErrorMsg("");
    navigate(`/r/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center shadow-xs">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-deepPlum">
            Track Order & Request
          </h1>
          <p className="text-sm text-brand-deepPlum/70 max-w-md mx-auto">
            Check live order status, WhatsApp confirmation, and dispatch details using your Request ID.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lilac/30 shadow-md">
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="track-input" className="block text-xs font-bold uppercase tracking-wider text-brand-deepPlum/70">
              Enter Request ID or Order #
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
                  placeholder="e.g. #1042 or 1042"
                  className="w-full px-4 py-3.5 pl-11 rounded-full border border-brand-lilac/40 focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 outline-none text-base font-medium text-brand-deepPlum bg-brand-warmWhite/30"
                  autoFocus
                />
                <Search className="w-5 h-5 text-brand-deepPlum/40 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-brand-deepPlum text-white font-semibold text-sm hover:bg-brand-plum transition shadow-md flex items-center gap-2 shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium pl-2">{errorMsg}</p>
            )}
            <p className="text-xs text-brand-deepPlum/55 pt-1">
              Tip: You can find your Request ID in the WhatsApp message link sent during checkout.
            </p>
          </form>
        </div>

        {/* Saved orders on this device */}
        {isLoaded && requestsList.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepPlum/70 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Recent Orders On This Device</span>
              </h2>
              <span className="text-xs text-brand-deepPlum/50">{requestsList.length} total</span>
            </div>

            <div className="space-y-3">
              {requestsList.slice(0, 5).map((req) => (
                <Link
                  key={req.requestNumber}
                  to={`/r/${req.secretToken || req.requestNumber.replace("#", "")}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-brand-lilac/30 shadow-xs hover:shadow-md transition hover:border-brand-plum/40 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-brand-deepPlum">
                        {req.requestNumber}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-brand-plum/10 text-brand-plum capitalize">
                        {req.status === "needs_reply" ? "Sent to seller" : req.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-deepPlum/70 truncate max-w-xs sm:max-w-md">
                      {req.summaryText}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-plum font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
