import { useState, useMemo } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { Search, ExternalLink, Clock } from "lucide-react";
import { getAllRequests } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const requests = await getAllRequests(env);
  return json({ requests });
}

export default function AdminRequestsPage() {
  const { requests } = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState<string>("needs_reply");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTabs = [
    { key: "needs_reply", label: "Needs reply", count: requests.filter((r) => r.status === "needs_reply").length },
    { key: "replied", label: "Replied", count: requests.filter((r) => r.status === "replied").length },
    { key: "confirmed", label: "Confirmed", count: requests.filter((r) => r.status === "confirmed").length },
    { key: "dispatched", label: "Dispatched", count: requests.filter((r) => r.status === "dispatched").length },
    { key: "closed", label: "Closed", count: requests.filter((r) => r.status === "closed").length },
    { key: "all", label: "All", count: requests.length },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesFilter = activeFilter === "all" ? true : r.status === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.items.some((i: any) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [requests, activeFilter, searchQuery]);

  // Helper for human-readable age
  const getAge = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hrs`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-plum">Requests Inbox</h1>
          <p className="text-xs text-brand-dark/60">
            Incoming WhatsApp orders and customer checkout requests
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search #1042 or saree..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-purple"
          />
        </div>
      </div>

      {/* Filter Chips (Screen A1) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
              activeFilter === tab.key
                ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                : "bg-white text-brand-dark/70 border-brand-lavender/40 hover:bg-brand-ivory"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeFilter === tab.key ? "bg-white/20 text-white" : "bg-brand-lavender/30 text-brand-plum"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests Display: Responsive Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-brand-lavender/30 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-brand-dark/60 font-medium">
            No requests in "{filterTabs.find((t) => t.key === activeFilter)?.label}".
          </div>
        ) : (
          <>
            {/* --------------------------------------------------------
                MOBILE CARDS VIEW (Visible only on < md screens)
               -------------------------------------------------------- */}
            <div className="md:hidden divide-y divide-brand-lavender/20">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-plum">
                        {req.requestNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        req.source === "bag" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {req.source === "bag" ? "Bag Order" : "Buy Now"}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-dark/60 font-medium">
                      {getAge(req.createdAt)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-brand-dark leading-snug">
                      {req.items.map((i: any) => i.productName).join(", ")}
                    </p>
                    <span className="text-xs text-brand-dark/60 block mt-0.5">
                      {req.items.length} {req.items.length === 1 ? "saree" : "sarees"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-brand-dark/60 uppercase tracking-wider block font-semibold">Total Amount</span>
                      <span className="text-sm font-bold text-brand-plum">
                        ₹ {req.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      to={`/r/${req.secretToken}?view=admin`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-xs min-h-[40px]"
                    >
                      <span>Open Tracker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* --------------------------------------------------------
                DESKTOP TABLE VIEW (Visible on >= md screens)
               -------------------------------------------------------- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-brand-dark/60 border-b border-brand-lavender/20 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-lavender/20">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-brand-ivory/50 transition">
                      <td className="py-3 px-4 font-bold text-brand-plum">
                        {req.requestNumber}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        <span className="font-medium text-brand-dark">
                          {req.items.map((i: any) => i.productName).join(", ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-dark">
                        ₹ {req.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                          req.source === "bag" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {req.source === "bag" ? "Bag" : "Buy now"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-brand-dark/60">
                        {getAge(req.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/r/${req.secretToken}?view=admin`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-deepPlum text-white text-[11px] font-semibold hover:bg-brand-plum transition"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-brand-dark/50">
        💡 Price is locked at request time. Requests older than the configured hold time expire automatically.
      </p>
    </div>
  );
}
