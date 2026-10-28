import { useState } from "react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { MessageCircle, CheckCircle2, Clock, Truck, Check, Copy, ArrowLeft, ExternalLink } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { getRequestByTokenOrNumber, getStoreSettings } from "~/db/d1.server";

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const idOrToken = params.id;
  if (!idOrToken) throw new Response("Not Found", { status: 404 });

  const req = await getRequestByTokenOrNumber(idOrToken, env);
  if (!req) throw new Response("Request Not Found", { status: 404 });

  const settings = await getStoreSettings(env);

  // Check admin cookie or query param
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
    return [{ title: "Request Details | Miss Malli" }, { name: "robots", content: "noindex, nofollow" }];
  }

  const { request } = data;
  const firstItem = request.items?.[0];
  const title = `${request.requestNumber}: ${firstItem ? firstItem.productName : "Saree Order"}`;
  const description = `₹ ${request.totalAmount.toLocaleString("en-IN")} · ${firstItem?.variantDetails || "Direct WhatsApp Request"}`;
  const image = firstItem?.imageUrl || "/brand/logo.png";

  return [
    { title: `${title} | Miss Malli` },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" }, // Private URL, kept out of search
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
  ];
};

export default function RequestStatusPage() {
  const { request, isAdminView, sellerPhone } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [status, setStatus] = useState(request.status);
  const [internalNote, setInternalNote] = useState(request.internalNote || "");
  const [trackingNote, setTrackingNote] = useState(request.trackingNote || "");
  const [isPaymentReceived, setIsPaymentReceived] = useState(request.isPaymentReceived === 1);
  const [quickReplyCopied, setQuickReplyCopied] = useState<string | null>(null);

  // Status mapping
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
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/my-requests" className="p-1 -ml-1 text-brand-dark/60 hover:text-brand-purple">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand-plum">
              Request {request.requestNumber}
            </h1>
          </div>

          {/* Toggle between Customer and Admin views */}
          <Link
            to={isAdminView ? `/r/${request.secretToken}` : `/r/${request.secretToken}?view=admin`}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-lavender/30 text-brand-plum hover:bg-brand-lavender/50 transition"
          >
            {isAdminView ? "👁️ Customer View" : "🛠️ Admin View"}
          </Link>
        </div>

        {/* =========================================
            ADMIN VIEW (Screen A2 from wireframes)
           ========================================= */}
        {isAdminView ? (
          <div className="bg-brand-ivory/80 rounded-3xl p-5 border border-brand-purple/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-lavender/40">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-purple">
                Admin Control Panel
              </span>
              <a
                href={customerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Open WhatsApp chat
              </a>
            </div>

            {/* Quick Replies Buttons */}
            <div>
              <label className="text-xs font-semibold text-brand-dark/70 block mb-2 uppercase tracking-wider">
                Quick Reply Macros
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyQuickReply("Hi! Yes, it's available. Please share your delivery address and I'll send payment details.", "Available")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-lavender/40 text-xs font-medium text-brand-dark hover:bg-brand-purple hover:text-white transition"
                >
                  {quickReplyCopied === "Available" ? "✓ Copied" : "Available"}
                </button>
                <button
                  onClick={() => copyQuickReply("Sorry, this piece was just reserved. Would you like to see similar sarees in this fabric?", "Not available")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-lavender/40 text-xs font-medium text-brand-dark hover:bg-brand-purple hover:text-white transition"
                >
                  {quickReplyCopied === "Not available" ? "✓ Copied" : "Not available"}
                </button>
                <button
                  onClick={() => copyQuickReply(`Payment details for Request ${request.requestNumber}:\nTotal: ₹ ${request.totalAmount.toLocaleString("en-IN")}\nUPI: orders@missmalli (GPay/PhonePe)`, "Payment details")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-lavender/40 text-xs font-medium text-brand-dark hover:bg-brand-purple hover:text-white transition"
                >
                  {quickReplyCopied === "Payment details" ? "✓ Copied" : "Payment details"}
                </button>
              </div>
            </div>

            {/* Status Selector Buttons */}
            <div>
              <label className="text-xs font-semibold text-brand-dark/70 block mb-2 uppercase tracking-wider">
                Update Order Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["replied", "confirmed", "dispatched"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAdminUpdate(s)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize border transition ${
                      status === s
                        ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                        : "bg-white text-brand-dark border-brand-lavender/40 hover:bg-brand-warmWhite"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox: Payment Received */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="paymentReceived"
                checked={isPaymentReceived}
                onChange={(e) => {
                  setIsPaymentReceived(e.target.checked);
                  handleAdminUpdate(status);
                }}
                className="w-4 h-4 accent-brand-purple rounded"
              />
              <label htmlFor="paymentReceived" className="text-xs font-semibold text-brand-dark cursor-pointer">
                Payment received (Internal record)
              </label>
            </div>

            {/* Tracking Note */}
            <div>
              <label className="text-xs font-semibold text-brand-dark/70 block mb-1">
                Courier / Tracking Note
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  placeholder="e.g. BlueDart #BL9281928"
                  className="flex-1 px-3 py-2 bg-white rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  onClick={() => handleAdminUpdate(status)}
                  className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Cancel Order */}
            <div className="pt-3 border-t border-brand-lavender/30 flex justify-between items-center">
              <button
                onClick={() => handleAdminUpdate("closed")}
                className="text-xs text-red-600 font-medium hover:underline"
              >
                Cancel and release stock
              </button>
              <span className="text-[11px] text-brand-dark/50">
                Created: {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ) : null}

        {/* =============================================
            CUSTOMER VIEW (Screen 12 from wireframes)
           ============================================= */}
        <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-5">
          {/* Status Stepper Progress Bar */}
          <div className="py-2">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-brand-lavender/40 -translate-y-1/2 -z-0" />
              <div
                className="absolute top-1/2 left-4 h-0.5 bg-brand-purple -translate-y-1/2 -z-0 transition-all duration-300"
                style={{ width: `${(activeIndex / 3) * 85}%` }}
              />

              {steps.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCompleted
                          ? "bg-brand-purple text-white shadow-sm"
                          : "bg-brand-ivory text-brand-dark/40 border border-brand-lavender/50"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium ${
                        isCurrent ? "text-brand-purple font-bold" : "text-brand-dark/60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saree Items List */}
          <div className="border-t border-brand-lavender/20 pt-4 space-y-3">
            <span className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold block">
              Items (Price locked at request time)
            </span>

            {request.items.map((item: any) => (
              <div key={item.id} className="flex gap-3.5 items-center p-3 rounded-2xl bg-brand-ivory/60 border border-brand-lavender/20">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-20 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-bold text-brand-dark truncate">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-brand-dark/70 mt-0.5">
                    {item.variantDetails}
                  </p>
                  <p className="text-xs font-bold text-brand-plum mt-1">
                    ₹ {item.priceAtRequest.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="p-3.5 rounded-2xl bg-brand-ivory border border-brand-gold/30 text-xs text-brand-dark/80 leading-relaxed">
            💬 <strong>Final price, delivery and payment</strong> are confirmed directly in your WhatsApp chat with the seller.
          </div>

          {/* Tracking Note (if dispatched) */}
          {trackingNote && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span><strong>Tracking:</strong> {trackingNote}</span>
            </div>
          )}

          {/* Customer Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={customerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Message seller on WhatsApp
            </a>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to cancel this request?")) {
                  handleAdminUpdate("closed");
                }
              }}
              className="w-full py-2.5 text-xs text-brand-dark/60 hover:text-red-600 transition"
            >
              Cancel request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
