import { useState } from "react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { MessageCircle, Truck, Check, ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { getRequestByTokenOrNumber, getStoreSettings } from "~/db/d1.server";

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const idOrToken = params.id;
  if (!idOrToken) throw new Response("Not Found", { status: 404 });

  const req = await getRequestByTokenOrNumber(idOrToken, env);
  if (!req) throw new Response("Request Not Found", { status: 404 });

  const settings = await getStoreSettings(env);
  const url = new URL(request.url);
  const isAdminView = url.searchParams.get("view") === "admin" || request.headers.get("cookie")?.includes("mm_admin=authenticated");

  return json({
    request: req,
    isAdminView: !!isAdminView,
    sellerPhone: settings.seller_whatsapp_number || "919876543210",
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.request) {
    return [{ title: "Order Tracker | Miss Malli" }, { name: "robots", content: "noindex, nofollow" }];
  }

  const { request } = data;
  const firstItem = request.items?.[0];
  const title = `Order ${request.requestNumber}: ${firstItem ? firstItem.productName : "Saree Order"}`;
  const description = `₹ ${request.totalAmount.toLocaleString("en-IN")} · ${firstItem?.variantDetails || "Direct WhatsApp Order"}`;
  const image = firstItem?.imageUrl || "/brand/logo.png";

  return [
    { title: `${title} | Miss Malli` },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
  ];
};

export default function RequestTrackerPage() {
  const { request, isAdminView, sellerPhone } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [status, setStatus] = useState(request.status);
  const [internalNote, setInternalNote] = useState(request.internalNote || "");
  const [trackingNote, setTrackingNote] = useState(request.trackingNote || "");
  const [isPaymentReceived, setIsPaymentReceived] = useState(request.isPaymentReceived === 1);
  const [quickReplyCopied, setQuickReplyCopied] = useState<string | null>(null);

  const steps = [
    { key: "sent", label: "Sent" },
    { key: "replied", label: "Replied" },
    { key: "confirmed", label: "Confirmed" },
    { key: "dispatched", label: "Dispatched" },
  ];

  const getActiveStepIndex = () => {
    switch (status) {
      case "needs_reply": return 0;
      case "replied": return 1;
      case "confirmed": return 2;
      case "dispatched": return 3;
      default: return 0;
    }
  };

  const activeIndex = getActiveStepIndex();

  const handleAdminUpdate = (newStatus: string) => {
    setStatus(newStatus);
    fetcher.submit(
      JSON.stringify({
        requestId: request.id,
        status: newStatus,
        internalNote,
        trackingNote,
        isPaymentReceived: isPaymentReceived ? 1 : 0,
      }),
      { method: "PATCH", action: "/api/requests", encType: "application/json" }
    );
  };

  const copyQuickReply = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setQuickReplyCopied(label);
    setTimeout(() => setQuickReplyCopied(null), 2000);
  };

  const customerWhatsappUrl = `https://wa.me/${sellerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hi Miss Malli, checking status on Request ${request.requestNumber}`
  )}`;

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/my-requests" className="p-1.5 -ml-1 text-brand-deepPlum/60 hover:text-brand-plum">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-brand-deepPlum">
                Order {request.requestNumber}
              </h1>
              <p className="text-xs text-brand-deepPlum/60">
                Created: {new Date(request.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <Link
            to={isAdminView ? `/r/${request.secretToken}` : `/r/${request.secretToken}?view=admin`}
            className="text-xs font-semibold px-4 py-1.5 rounded-full bg-brand-lilac/30 text-brand-deepPlum hover:bg-brand-lilac/50 transition"
          >
            {isAdminView ? "👁️ Customer View" : "🛠️ Admin View"}
          </Link>
        </div>

        {/* ADMIN VIEW CONTROLS */}
        {isAdminView && (
          <div className="bg-brand-plum/10 rounded-[28px] p-6 border border-brand-plum/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-plum/20">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-plum">
                Admin Order Control
              </span>
              <a
                href={customerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Chat with Customer
              </a>
            </div>

            {/* Quick Replies */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-deepPlum/70 block uppercase tracking-wider">
                Quick Reply Macros
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyQuickReply("Hi! Yes, it's available. Please share your delivery address and I'll send payment details.", "Available")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-lilac/40 text-xs font-medium text-brand-deepPlum hover:bg-brand-plum hover:text-white transition"
                >
                  {quickReplyCopied === "Available" ? "✓ Copied" : "Available"}
                </button>
                <button
                  onClick={() => copyQuickReply(`Payment details for Request ${request.requestNumber}:\nTotal: ₹ ${request.totalAmount.toLocaleString("en-IN")}\nUPI: orders@missmalli (GPay/PhonePe)`, "Payment details")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-lilac/40 text-xs font-medium text-brand-deepPlum hover:bg-brand-plum hover:text-white transition"
                >
                  {quickReplyCopied === "Payment details" ? "✓ Copied" : "Payment details"}
                </button>
              </div>
            </div>

            {/* Status Selectors */}
            <div>
              <label className="text-xs font-bold text-brand-deepPlum/70 block mb-2 uppercase tracking-wider">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["replied", "confirmed", "dispatched"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAdminUpdate(s)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize border transition ${
                      status === s
                        ? "bg-brand-deepPlum text-white border-brand-deepPlum shadow-sm"
                        : "bg-white text-brand-deepPlum border-brand-lilac/40 hover:bg-brand-ivory"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking Note */}
            <div>
              <label className="text-xs font-bold text-brand-deepPlum/70 block mb-1">
                Tracking Note
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  placeholder="e.g. BlueDart #BL9281928"
                  className="flex-1 px-3 py-2 bg-white rounded-xl border border-brand-lilac/40 text-xs text-brand-deepPlum"
                />
                <button
                  onClick={() => handleAdminUpdate(status)}
                  className="px-4 py-2 bg-brand-deepPlum text-white rounded-xl text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER VIEW TRACKER */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-brand-lilac/30 shadow-sm space-y-6">
          {/* Status Stepper */}
          <div className="py-2">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-brand-lilac/30 -translate-y-1/2 -z-0" />
              <div
                className="absolute top-1/2 left-4 h-0.5 bg-brand-plum -translate-y-1/2 -z-0 transition-all duration-300"
                style={{ width: `${(activeIndex / 3) * 85}%` }}
              />

              {steps.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCompleted
                          ? "bg-brand-plum text-white shadow-md"
                          : "bg-brand-ivory text-brand-deepPlum/40 border border-brand-lilac/40"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? "text-brand-plum font-bold" : "text-brand-deepPlum/60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saree Items */}
          <div className="border-t border-brand-lilac/20 pt-6 space-y-3">
            <span className="text-xs uppercase tracking-wider text-brand-deepPlum/60 font-bold block">
              Drapes in this order (Price locked at request time)
            </span>

            {request.items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 items-center p-4 rounded-[20px] bg-brand-ivory/60 border border-brand-lilac/20"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-20 rounded-[14px] object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-brand-deepPlum truncate">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-brand-deepPlum/60 mt-0.5">
                    {item.variantDetails}
                  </p>
                  <p className="text-xs font-bold text-brand-plum mt-1">
                    ₹ {item.priceAtRequest.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notice Box */}
          <div className="p-4 rounded-[20px] bg-brand-lilac/20 border border-brand-lilac/30 text-xs text-brand-deepPlum leading-relaxed">
            💬 <strong>Final price, delivery address, and payment</strong> are confirmed directly in your WhatsApp chat with the seller.
          </div>

          {trackingNote && (
            <div className="p-4 rounded-[20px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Tracking ID:</strong> {trackingNote}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={customerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Seller on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to cancel this request?")) {
                  handleAdminUpdate("closed");
                }
              }}
              className="w-full py-2 text-xs text-brand-deepPlum/50 hover:text-red-500 transition"
            >
              Cancel request
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
