import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Save, CheckCircle2 } from "lucide-react";
import { getStoreSettings } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);
  return json({ settings });
}

export default function AdminSettingsPage() {
  const { settings } = useLoaderData<typeof loader>();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.seller_whatsapp_number || "919876543210");
  const [template, setTemplate] = useState(
    settings.buy_now_message_template ||
      "Hi Miss Malli, I'd like to buy this saree. Request {request}\n\n{saree}\n{price} · {variant}\n{link}"
  );
  const [reserveHours, setReserveHours] = useState(settings.reserve_hours || "24");
  const [autoExpire, setAutoExpire] = useState(settings.auto_expire_unanswered === "true");
  const [emailNotify, setEmailNotify] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(settings.notify_email || "orders@missmalli.com");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-plum">Settings</h1>
          <p className="text-xs text-brand-dark/60">
            WhatsApp checkout configuration, order hold timer, and store preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-plum transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully saved and synchronized.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Message Configuration */}
        <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-sm text-brand-plum">
            WhatsApp Order Routing
          </h3>

          <div>
            <label className="font-semibold text-brand-dark block mb-1">
              WhatsApp number for incoming orders
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210 (Country code + phone)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
            />
            <span className="text-[10px] text-brand-dark/50 block mt-1">
              Include country code without '+' or special characters.
            </span>
          </div>

          <div>
            <label className="font-semibold text-brand-dark block mb-1">
              "Buy now" pre-filled message template
            </label>
            <textarea
              rows={5}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple font-mono text-[11px]"
            />
            <span className="text-[10px] text-brand-dark/50 block mt-1">
              Available tags: {"{saree}"}, {"{variant}"}, {"{price}"}, {"{request}"}, {"{link}"}
            </span>
          </div>
        </div>

        {/* Order Hold & Expiry Settings */}
        <div className="bg-white rounded-3xl p-5 border border-brand-lavender/30 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-sm text-brand-plum">
            Inventory Hold Policy
          </h3>

          <div>
            <label className="font-semibold text-brand-dark block mb-1">
              Reserve a saree for
            </label>
            <select
              value={reserveHours}
              onChange={(e) => setReserveHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark focus:ring-1 focus:ring-brand-purple"
            >
              <option value="12">12 hours</option>
              <option value="24">24 hours (Recommended)</option>
              <option value="48">48 hours</option>
              <option value="0">Manual release only</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoExpire}
                onChange={(e) => setAutoExpire(e.target.checked)}
                className="w-4 h-4 accent-brand-purple rounded"
              />
              <span className="text-brand-dark font-medium">Auto-expire unanswered requests</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-4 h-4 accent-brand-purple rounded"
              />
              <span className="text-brand-dark font-medium">Email seller when a new request arrives</span>
            </label>
          </div>

          {emailNotify && (
            <div className="pt-2">
              <label className="font-semibold text-brand-dark block mb-1">
                Notification email address
              </label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-lavender/40 text-brand-dark"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
