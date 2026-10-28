import { useState } from "react";
import { Link } from "@remix-run/react";
import { Clock, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { useMyRequests } from "~/hooks/useLocalStorage";

export default function MyRequestsPage() {
  const { requestsList, isLoaded } = useMyRequests();
  const [tab, setTab] = useState<"active" | "done">("active");

  const filtered = requestsList.filter((r) => {
    const isDone = r.status === "dispatched" || r.status === "closed";
    return tab === "done" ? isDone : !isDone;
  });

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
            My requests
          </h1>
          <p className="text-xs text-brand-dark/60">
            No account required · Kept on this device
          </p>
        </div>

        {/* Active vs Done Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              tab === "active"
                ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setTab("done")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              tab === "done"
                ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                : "bg-white text-brand-dark/80 border-brand-lavender/40 hover:bg-brand-ivory"
            }`}
          >
            Done
          </button>
        </div>

        {isLoaded && filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-blush/20 text-brand-purple mx-auto flex items-center justify-center">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-lg font-bold text-brand-plum">
              No {tab} requests
            </h2>
            <p className="text-xs text-brand-dark/70 max-w-xs mx-auto">
              When you order via WhatsApp, a live tracker is saved here so you can check delivery and order updates.
            </p>
            <div className="pt-2">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition"
              >
                Explore Saree Feed
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const statusBadge = () => {
                switch (req.status) {
                  case "needs_reply":
                    return <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">Sent to seller</span>;
                  case "replied":
                    return <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">Seller replied</span>;
                  case "confirmed":
                    return <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">Confirmed</span>;
                  case "dispatched":
                    return <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">Dispatched</span>;
                  default:
                    return <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-700 font-semibold border border-gray-200">Closed</span>;
                }
              };

              return (
                <Link
                  key={req.requestNumber}
                  to={`/r/${req.secretToken || req.requestNumber.replace("#", "")}`}
                  className="block p-4 rounded-2xl bg-white border border-brand-lavender/30 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-brand-plum">
                      {req.requestNumber}
                    </span>
                    {statusBadge()}
                  </div>

                  <p className="text-xs text-brand-dark/80 font-medium mt-1.5 truncate">
                    {req.summaryText}
                  </p>

                  <div className="flex items-center justify-between text-xs text-brand-dark/60 mt-2 pt-2 border-t border-brand-lavender/20">
                    <span>
                      {req.itemsCount} {req.itemsCount === 1 ? "saree" : "sarees"} · ₹ {req.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="flex items-center gap-1 text-brand-purple font-medium">
                      View tracker <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <p className="text-[11px] text-brand-dark/50 text-center pt-4">
          📱 Your status link is also in your WhatsApp chat with the seller.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
