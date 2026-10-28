import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { ShoppingBag, Trash2, MessageCircle, Loader2, ArrowRight } from "lucide-react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";
import { useBag, useMyRequests } from "~/hooks/useLocalStorage";
import { getStoreSettings } from "~/db/d1.server";
import { generateWhatsAppBuyUrl } from "~/utils/whatsapp";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);
  return json({
    sellerPhone: settings.seller_whatsapp_number || "919876543210",
  });
}

export default function BagPage() {
  const { sellerPhone } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { items, removeFromBag, clearBag, subtotal, isLoaded } = useBag();
  const { addRequest } = useMyRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendBag = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        source: "bag",
        totalAmount: subtotal,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          variantDetails: `${i.colorName} · ${i.blouseOption === "with" ? "With blouse" : "Without blouse"}`,
          price: i.price,
          imageUrl: i.imageUrl,
        })),
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create bag order request");

      const data = await res.json() as {
        requestId: number;
        requestNumber: string;
        secretToken: string;
        requestUrl: string;
      };

      // Record in My Requests
      addRequest({
        requestId: data.requestId,
        requestNumber: data.requestNumber,
        secretToken: data.secretToken,
        itemsCount: items.length,
        totalAmount: subtotal,
        summaryText: `${items.length} sarees (${items[0].name}${items.length > 1 ? `, +${items.length - 1} more` : ""})`,
        status: "needs_reply",
        createdAt: new Date().toISOString(),
      });

      // Clear bag after successful submission
      clearBag();

      // Launch WhatsApp
      const whatsappUrl = generateWhatsAppBuyUrl({
        sellerPhone,
        requestNumber: data.requestNumber,
        requestUrl: data.requestUrl,
        items: items.map((i) => ({
          name: i.name,
          variantDetails: `${i.colorName} · ${i.blouseOption === "with" ? "With blouse" : "Without"}`,
          price: i.price,
        })),
        totalAmount: subtotal,
      });

      window.open(whatsappUrl, "_blank");
      navigate(`/request-created?number=${encodeURIComponent(data.requestNumber)}&token=${encodeURIComponent(data.secretToken)}&url=${encodeURIComponent(data.requestUrl)}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send bag request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-plum">
            Your bag ({items.length})
          </h1>
          <p className="text-xs text-brand-dark/60">
            Send several sarees in one message
          </p>
        </div>

        {isLoaded && items.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-blush/20 text-brand-purple mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-lg font-bold text-brand-plum">Your bag is empty</h2>
            <p className="text-xs text-brand-dark/70 max-w-xs mx-auto">
              Browse sarees in the swipe feed or store catalog and tap "Add to bag" to assemble your festive selection.
            </p>
            <div className="pt-2">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-md"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bag Items List */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-brand-lavender/30 shadow-sm items-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover bg-brand-ivory shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-bold text-brand-dark truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-dark/70 mt-0.5">
                      {item.colorName} · {item.blouseOption === "with" ? "With blouse" : "Without blouse"}
                    </p>
                    <p className="text-xs font-bold text-brand-plum mt-1">
                      ₹ {item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromBag(idx)}
                    className="p-2 text-brand-dark/40 hover:text-red-500 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal & Notice */}
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-lavender/40 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-brand-dark">Subtotal</span>
                <span className="font-bold text-base text-brand-plum">
                  ₹ {subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-brand-dark/60 leading-relaxed">
                Delivery and final price are confirmed directly in chat with the seller.
              </p>
            </div>

            {/* Checkout via WhatsApp Button */}
            <button
              onClick={handleSendBag}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-full bg-brand-purple hover:bg-brand-plum text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Send on WhatsApp ({items.length} {items.length === 1 ? "saree" : "sarees"})
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
