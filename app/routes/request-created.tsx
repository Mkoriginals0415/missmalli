import { useSearchParams, Link } from "@remix-run/react";
import { Check, MessageCircle, Copy, ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";

export default function RequestCreatedPage() {
  const [searchParams] = useSearchParams();
  const requestNumber = searchParams.get("number") || "#1042";
  const secretToken = searchParams.get("token") || "";
  const requestUrl = searchParams.get("url") || (secretToken ? `/r/${secretToken}` : "/my-requests");

  const [copied, setCopied] = useState(false);

  const messageText = `Hi Miss Malli, I would like to order. Request ${requestNumber}\nDetails & live status: ${requestUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto py-16">
        <div className="w-16 h-16 rounded-full bg-brand-plum text-white flex items-center justify-center mb-6 shadow-md">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <h1 className="text-3xl font-bold text-brand-deepPlum">
          Thank you!
        </h1>

        <p className="text-sm font-semibold text-brand-plum mt-1">
          Request {requestNumber} is ready for WhatsApp confirmation.
        </p>

        <p className="text-xs text-brand-deepPlum/70 mt-3 max-w-sm leading-relaxed">
          Tap below to send your order details directly to the seller on WhatsApp. Delivery address and final payment are agreed in your chat.
        </p>

        <div className="w-full mt-8 space-y-3">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(messageText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp to Confirm</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-full border border-brand-lilac/50 text-brand-deepPlum font-medium text-xs hover:bg-white transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Message Copied!" : "WhatsApp didn't open? Copy message"}</span>
          </button>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to={secretToken ? `/r/${secretToken}` : "/my-requests"}
              className="text-xs font-semibold text-brand-plum hover:underline flex items-center gap-1"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-brand-deepPlum/30">|</span>

            <Link
              to="/sarees"
              className="text-xs font-semibold text-brand-deepPlum/70 hover:text-brand-plum"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-brand-deepPlum/50 mt-10">
          🔒 Nothing is charged on this site.
        </p>
      </main>

      <Footer />
    </div>
  );
}
