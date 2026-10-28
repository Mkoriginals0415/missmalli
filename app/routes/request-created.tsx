import { useSearchParams, Link } from "@remix-run/react";
import { CheckCircle2, MessageCircle, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Header } from "~/components/layout/Header";
import { BottomNav } from "~/components/layout/BottomNav";

export default function RequestCreatedPage() {
  const [searchParams] = useSearchParams();
  const requestNumber = searchParams.get("number") || "#1042";
  const secretToken = searchParams.get("token") || "";
  const requestUrl = searchParams.get("url") || (secretToken ? `/r/${secretToken}` : "/my-requests");

  const [copied, setCopied] = useState(false);

  const messageText = `Hi Miss Malli, I'd like to buy this saree. Request ${requestNumber}\nDetails: ${requestUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-brand-warmWhite flex flex-col pb-20">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-brand-plum">
          Request {requestNumber} created
        </h1>

        <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 max-w-xs leading-relaxed">
          Tap below to chat with the seller. Your saree's photo and order details go with the message.
        </p>

        <div className="w-full mt-6 space-y-3">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(messageText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <MessageCircle className="w-5 h-5" />
            Open WhatsApp
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-full border border-brand-lavender/60 text-brand-dark/80 font-medium text-xs hover:bg-brand-ivory transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Message Copied!" : "WhatsApp didn't open? Copy message"}
          </button>

          <Link
            to={secretToken ? `/r/${secretToken}` : "/my-requests"}
            className="block text-xs font-semibold text-brand-purple hover:underline pt-2 flex items-center justify-center gap-1"
          >
            <span>View request status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-[11px] text-brand-dark/50 mt-8">
          🔒 Nothing is charged on this site. You agree on final payment in chat.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
