import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  Minus, 
  Plus, 
  MessageCircle, 
  Loader2, 
  Tag,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { useBag, useSavedSarees, useMyRequests } from "~/hooks/useLocalStorage";
import { generateWhatsAppBuyUrl } from "~/utils/whatsapp";

export async function loader({ context }: LoaderFunctionArgs) {
  return json({
    sellerPhone: "919876543210",
  });
}

export default function ShoppingBagPage() {
  const { sellerPhone } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { items, removeFromBag, clearBag, subtotal, isLoaded } = useBag();
  const { toggleSave } = useSavedSarees();
  const { addRequest } = useMyRequests();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (code === "FESTIVE30" || code === "MISSMALLI") {
      setCouponApplied(true);
      setDiscountAmount(500);
    } else {
      setCouponError("Invalid coupon code. Try code FESTIVE30 for ₹500 off.");
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSendWhatsAppOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        source: "bag",
        totalAmount: finalTotal,
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

      if (!res.ok) throw new Error("Failed to create request");

      const data = (await res.json()) as {
        requestId: number;
        requestNumber: string;
        secretToken: string;
        requestUrl: string;
      };

      addRequest({
        requestId: data.requestId,
        requestNumber: data.requestNumber,
        secretToken: data.secretToken,
        itemsCount: items.length,
        totalAmount: finalTotal,
        summaryText: `${items.length} drapes (${items[0].name}${items.length > 1 ? `, +${items.length - 1} more` : ""})`,
        status: "needs_reply",
        createdAt: new Date().toISOString(),
      });

      // Clear bag after request created
      clearBag();

      const whatsappUrl = generateWhatsAppBuyUrl({
        sellerPhone,
        requestNumber: data.requestNumber,
        requestUrl: data.requestUrl,
        items: items.map((i) => ({
          name: i.name,
          variantDetails: `${i.colorName} · ${i.blouseOption === "with" ? "With blouse" : "Without"}`,
          price: i.price,
        })),
        totalAmount: finalTotal,
      });

      window.open(whatsappUrl, "_blank");
      navigate(
        `/request-created?number=${encodeURIComponent(data.requestNumber)}&token=${encodeURIComponent(
          data.secretToken
        )}&url=${encodeURIComponent(data.requestUrl)}`
      );
    } catch (err) {
      console.error(err);
      alert("Error sending order request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-deepPlum">
            Your Bag ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
          <p className="text-xs text-brand-deepPlum/60 mt-0.5">
            Send several drapes in one single WhatsApp request
          </p>
        </div>

        {isLoaded && items.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[28px] border border-brand-lilac/30 p-8">
            <div className="w-16 h-16 rounded-full bg-brand-lilac/20 text-brand-plum mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-brand-deepPlum">Your bag is empty</h2>
            <p className="text-xs text-brand-deepPlum/70 max-w-sm mx-auto">
              Explore our handwoven sarees and tap "Add to Bag" to curate your collection.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Bag Items List (Left Column) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-[28px] border border-brand-lilac/30 p-6 space-y-6 shadow-sm divide-y divide-brand-lilac/20">
                {items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className={`flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between ${
                      idx > 0 ? "pt-6" : ""
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-[18px] object-cover bg-brand-lilac/10 shrink-0"
                      />
                      <div className="space-y-1">
                        <Link to={`/p/${item.slug}`} className="hover:text-brand-plum">
                          <h3 className="font-bold text-sm text-brand-deepPlum">{item.name}</h3>
                        </Link>
                        <p className="text-xs text-brand-deepPlum/60">
                          Colour: {item.colorName} · {item.blouseOption === "with" ? "With blouse" : "Without blouse"}
                        </p>
                        <div className="flex items-center gap-4 text-xs pt-1">
                          <button
                            onClick={() => {
                              toggleSave(item.productId);
                              removeFromBag(idx);
                            }}
                            className="text-brand-deepPlum/60 hover:text-brand-plum underline"
                          >
                            Move to wishlist
                          </button>
                          <button
                            onClick={() => removeFromBag(idx)}
                            className="text-red-500/80 hover:text-red-600 underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center text-right">
                      <span className="font-bold text-base text-brand-deepPlum">
                        ₹ {item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input (Page 04) */}
              <form
                onSubmit={handleApplyCoupon}
                className="flex gap-3 bg-white rounded-[22px] p-3 border border-brand-lilac/30 shadow-sm"
              >
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Tag className="w-4 h-4 text-brand-deepPlum/40" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code (e.g. FESTIVE30)"
                    className="w-full text-xs text-brand-deepPlum bg-transparent focus:outline-none uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-brand-ivory border border-brand-deepPlum text-brand-deepPlum text-xs font-semibold hover:bg-brand-deepPlum hover:text-white transition"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <p className="text-[11px] text-red-600 font-semibold px-2">
                  {couponError}
                </p>
              )}
              {couponApplied && (
                <p className="text-[11px] text-emerald-700 font-bold px-2">
                  ✓ FESTIVE30 applied! ₹500 discount added to your order.
                </p>
              )}
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-[28px] border border-brand-lilac/30 p-6 space-y-5 shadow-sm">
                <h3 className="font-bold text-base text-brand-deepPlum">Order Summary</h3>

                <div className="space-y-3 text-xs border-b border-brand-lilac/20 pb-4">
                  <div className="flex justify-between text-brand-deepPlum/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-deepPlum">
                      ₹ {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount (FESTIVE30)</span>
                      <span>− ₹ {discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-deepPlum/70">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-brand-deepPlum">
                  <span>Total</span>
                  <span className="text-xl text-brand-plum">
                    ₹ {finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* WhatsApp Order Button */}
                <button
                  onClick={handleSendWhatsAppOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-brand-plum text-white font-semibold text-xs hover:bg-brand-deepPlum transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Order on WhatsApp ({items.length} {items.length === 1 ? "item" : "items"})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-brand-deepPlum/60 leading-relaxed">
                  🔒 No address form on the site. Delivery address and final payment details are agreed in your direct WhatsApp chat with the seller.
                </p>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-brand-deepPlum/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure WhatsApp order concierge</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
