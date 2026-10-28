import { useState } from "react";
import { Link } from "@remix-run/react";
import { MessageSquare, ChevronRight, ArrowRight } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { useMyRequests } from "~/hooks/useLocalStorage";

export default function MyRequestsPage() {
  const { requestsList, isLoaded } = useMyRequests();
  const [tab, setTab] = useState<"active" | "done">("active");

  const filtered = requestsList.filter((r) => {
    const isDone = r.status === "dispatched" || r.status === "closed";
    return tab === "done" ? isDone : !isDone;
  });

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-deepPlum">
            My Orders
          </h1>
          <p className="text-xs text-brand-deepPlum/60 mt-0.5">
            No account required · Live trackers saved privately on this device
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("active")}
            className={`px-5 py-2 rounded-full text-xs font-semibold border transition ${
              tab === "active"
                ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setTab("done")}
            className={`px-5 py-2 rounded-full text-xs font-semibold border transition ${
              tab === "done"
                ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
            }`}
          >
            Completed
          </button>
        </div>

        {isLoaded && filtered.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[28px] border border-brand-lilac/30 p-8">
            <div className="w-16 h-16 rounded-full bg-brand-lilac/20 text-brand-plum mx-auto flex items-center justify-center">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-brand-deepPlum">No {tab} orders found</h2>
            <p className="text-xs text-brand-deepPlum/70 max-w-sm mx-auto">
              When you send an order on WhatsApp, your live delivery tracker is recorded here.
            </p>
            <div className="pt-2">
              <Link
                to="/sarees"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
              >
                <span>Browse Sarees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <Link
                key={req.requestNumber}
                to={`/r/${req.secretToken || req.requestNumber.replace("#", "")}`}
                className="block p-5 rounded-[22px] bg-white border border-brand-lilac/30 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-brand-deepPlum">
                    {req.requestNumber}
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-brand-plum/10 text-brand-plum">
                    {req.status === "needs_reply" ? "Sent to seller" : req.status}
                  </span>
                </div>

                <p className="text-xs text-brand-deepPlum/80 font-medium mt-2 truncate">
                  {req.summaryText}
                </p>

                <div className="flex items-center justify-between text-xs text-brand-deepPlum/60 mt-3 pt-3 border-t border-brand-lilac/20">
                  <span>
                    {req.itemsCount} {req.itemsCount === 1 ? "drape" : "drapes"} · ₹ {req.totalAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1 text-brand-plum font-semibold">
                    <span>Track Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
