import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { 
  Save, 
  CheckCircle2, 
  Palette, 
  RotateCcw, 
  Sparkles, 
  ExternalLink,
  Phone,
  Clock,
  Mail,
  MessageCircle,
  Menu,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { getStoreSettings, updateStoreSettings } from "~/db/d1.server";
import { DEFAULT_THEME_COLORS, StoreThemeColors, DEFAULT_NAV_LINKS, NavLinkItem } from "~/db/mock-data";
import { normalizeWhatsAppPhone, formatPhoneDisplay } from "~/utils/whatsapp";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);

  let themeColors: StoreThemeColors = DEFAULT_THEME_COLORS;
  try {
    if (settings.theme_colors) {
      themeColors = { ...DEFAULT_THEME_COLORS, ...JSON.parse(settings.theme_colors) };
    }
  } catch (e) {}

  let navLinks: NavLinkItem[] = DEFAULT_NAV_LINKS;
  try {
    if (settings.nav_links) {
      navLinks = JSON.parse(settings.nav_links);
    }
  } catch (e) {}

  return json({ settings, themeColors, navLinks });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const formData = await request.formData();

  const rawPhone = String(formData.get("seller_whatsapp_number") || "").trim();
  const normalizedPhone = normalizeWhatsAppPhone(rawPhone);

  const updates: Record<string, string> = {
    seller_whatsapp_number: normalizedPhone,
    buy_now_message_template: String(formData.get("buy_now_message_template") || ""),
    reserve_hours: String(formData.get("reserve_hours") || "24"),
    auto_expire_unanswered: String(formData.get("auto_expire_unanswered") || "false"),
    notify_email: String(formData.get("notify_email") || "orders@missmalli.com"),
    theme_colors: String(formData.get("theme_colors") || JSON.stringify(DEFAULT_THEME_COLORS)),
  };

  if (formData.has("nav_links")) {
    updates.nav_links = String(formData.get("nav_links") || JSON.stringify(DEFAULT_NAV_LINKS));
  }

  const updated = await updateStoreSettings(updates, env);
  return json({ success: true, settings: updated });
}

export default function AdminSettingsPage() {
  const data = useLoaderData<typeof loader>();
  const settings = data?.settings || ({} as any);
  const initialThemeColors = data?.themeColors || DEFAULT_THEME_COLORS;
  const initialNavLinks = data?.navLinks || DEFAULT_NAV_LINKS;
  const fetcher = useFetcher<typeof action>();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.seller_whatsapp_number || "919876543210");
  const [template, setTemplate] = useState(
    settings.buy_now_message_template ||
      "Hi Miss Malli, I'd like to order: {saree} (Product ID: {code})\nPrice: ₹{price}\nRequest #{request}\nLink: {link}"
  );
  const [reserveHours, setReserveHours] = useState(settings.reserve_hours || "24");
  const [autoExpire, setAutoExpire] = useState(settings.auto_expire_unanswered === "true");
  const [notifyEmail, setNotifyEmail] = useState(settings.notify_email || "orders@missmalli.com");

  // Brand Theme Colors State
  const [colors, setColors] = useState<StoreThemeColors>(initialThemeColors);

  // Navigation Links State
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(initialNavLinks);

  useEffect(() => {
    if (fetcher.data?.settings?.seller_whatsapp_number) {
      setWhatsappNumber(fetcher.data.settings.seller_whatsapp_number);
    }
  }, [fetcher.data]);

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  const handleApplyPreset = (preset: StoreThemeColors) => {
    setColors(preset);
  };

  const handleResetToDefault = () => {
    setColors(DEFAULT_THEME_COLORS);
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navLinks.length) return;
    const updated = [...navLinks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setNavLinks(updated);
  };

  const toggleLink = (index: number) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], enabled: updated[index].enabled === false ? true : false };
    setNavLinks(updated);
  };

  const updateLink = (index: number, field: "label" | "to", val: string) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: val };
    setNavLinks(updated);
  };

  const removeLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const addLink = () => {
    const newId = `link_${Date.now()}`;
    setNavLinks([...navLinks, { id: newId, label: "New Link", to: "/sarees", enabled: true }]);
  };

  const handleResetNavLinks = () => {
    setNavLinks(DEFAULT_NAV_LINKS);
  };

  const handleSaveAll = () => {
    const formData = new FormData();
    formData.append("seller_whatsapp_number", whatsappNumber);
    formData.append("buy_now_message_template", template);
    formData.append("reserve_hours", reserveHours);
    formData.append("auto_expire_unanswered", String(autoExpire));
    formData.append("notify_email", notifyEmail);
    formData.append("theme_colors", JSON.stringify(colors));
    formData.append("nav_links", JSON.stringify(navLinks));

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Header & Save Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brand-deepPlum/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-[11px] tracking-wide uppercase">
              Admin Configuration
            </span>
            <span className="text-brand-deepPlum/40">•</span>
            <span className="text-xs font-semibold text-brand-deepPlum/70">Store Styling & Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-deepPlum mt-1">
            Store Theme Colors & Settings
          </h1>
          <p className="text-xs text-brand-deepPlum/70 font-medium">
            Customize live brand colors, WhatsApp order numbers, and hold policies
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/"
            target="_blank"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-deepPlum/20 text-brand-deepPlum text-xs font-bold hover:bg-brand-ivory transition min-h-[44px]"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-deepPlum text-white text-xs font-bold hover:bg-brand-plum transition shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Publish Live Settings"}</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Store settings and theme colors saved successfully! Storefront updated live.</span>
        </div>
      )}

      {/* ========================================================
          1. STORE THEME & BRAND COLOR PALETTE EDITOR
         ======================================================== */}
      <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-deepPlum/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-plum/10 text-brand-plum flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-deepPlum">
                Store Theme & Brand Colors
              </h2>
              <p className="text-xs text-brand-deepPlum/70 font-medium">
                Choose custom hex codes or color pickers. Changes apply across the entire customer storefront.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-deepPlum/20 text-brand-deepPlum text-xs font-semibold hover:bg-brand-ivory transition self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Brand Kit</span>
          </button>
        </div>

        {/* Preset Palettes */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deepPlum/70 block">
            Curated Color Schemes:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {[
              {
                name: "Miss Malli Signature (Royal Plum)",
                colors: DEFAULT_THEME_COLORS,
              },
              {
                name: "Emerald Heritage",
                colors: {
                  primaryPlum: "#1B4D3E",
                  deepPlum: "#0D2B22",
                  ivoryCanvas: "#F8FBF9",
                  accentGold: "#C5A059",
                  accentLilac: "#A3C9A8",
                  accentBlush: "#D8E2DC",
                },
              },
              {
                name: "Royal Maroon & Kadwa Zari",
                colors: {
                  primaryPlum: "#7A1C29",
                  deepPlum: "#3D0B12",
                  ivoryCanvas: "#FDFBF7",
                  accentGold: "#D4AF37",
                  accentLilac: "#E5B8B7",
                  accentBlush: "#F2D6D6",
                },
              },
              {
                name: "Sapphire Luxe",
                colors: {
                  primaryPlum: "#1A365D",
                  deepPlum: "#0F1E36",
                  ivoryCanvas: "#F7FAFC",
                  accentGold: "#C9A84C",
                  accentLilac: "#90CDF4",
                  accentBlush: "#CBD5E0",
                },
              },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.colors)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-ivory border border-brand-deepPlum/15 hover:border-brand-deepPlum hover:bg-white transition text-xs font-semibold text-brand-deepPlum shadow-2xs"
              >
                <div className="flex -space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: preset.colors.primaryPlum }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: preset.colors.deepPlum }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: preset.colors.accentGold }} />
                </div>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Individual Color Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* 1. Primary Plum */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Primary Brand Color
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.primaryPlum }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Navigation active tabs, brand headers, highlights
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.primaryPlum}
                onChange={(e) => setColors({ ...colors, primaryPlum: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.primaryPlum}
                onChange={(e) => setColors({ ...colors, primaryPlum: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 2. Deep Plum / Dark Accent */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Deep Plum (Buttons & Footer)
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.deepPlum }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Primary CTA buttons, footer background, bold typography
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.deepPlum}
                onChange={(e) => setColors({ ...colors, deepPlum: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.deepPlum}
                onChange={(e) => setColors({ ...colors, deepPlum: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 3. Canvas Ivory Background */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Background Canvas (Ivory)
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.ivoryCanvas }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Main page body background, card insets
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.ivoryCanvas}
                onChange={(e) => setColors({ ...colors, ivoryCanvas: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.ivoryCanvas}
                onChange={(e) => setColors({ ...colors, ivoryCanvas: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 4. Accent Zari Gold */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Zari Gold Accent
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.accentGold }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Heirloom badges, discount tags, metallic accents
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.accentGold}
                onChange={(e) => setColors({ ...colors, accentGold: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.accentGold}
                onChange={(e) => setColors({ ...colors, accentGold: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 5. Accent Lilac */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Lilac Accent
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.accentLilac }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Card borders, soft dividers, subtle badge backgrounds
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.accentLilac}
                onChange={(e) => setColors({ ...colors, accentLilac: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.accentLilac}
                onChange={(e) => setColors({ ...colors, accentLilac: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 6. Accent Blush */}
          <div className="p-4 rounded-2xl bg-brand-ivory/60 border border-brand-deepPlum/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-deepPlum">
                Blush Accent
              </label>
              <span className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colors.accentBlush }} />
            </div>
            <p className="text-[10px] text-brand-deepPlum/60">
              Wishlist active states, soft badge highlights
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={colors.accentBlush}
                onChange={(e) => setColors({ ...colors, accentBlush: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-brand-deepPlum/20 bg-white p-0.5"
              />
              <input
                type="text"
                value={colors.accentBlush}
                onChange={(e) => setColors({ ...colors, accentBlush: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-brand-deepPlum/20 text-xs font-mono font-bold uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. WHATSAPP & STORE OPERATIONAL SETTINGS
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Message Configuration */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-deepPlum/10 pb-3">
            <Phone className="w-4 h-4 text-brand-plum" />
            <h3 className="font-bold text-sm text-brand-deepPlum">
              WhatsApp Order Routing
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              WhatsApp number for incoming orders
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210 or 10-digit mobile"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum focus:ring-1 focus:ring-brand-plum"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-[10.5px]">
              <span className="text-brand-deepPlum/60">
                Display: <strong className="text-brand-deepPlum">{formatPhoneDisplay(whatsappNumber)}</strong>
              </span>
              <a
                href={`https://wa.me/${normalizeWhatsAppPhone(whatsappNumber)}?text=${encodeURIComponent("Test message from Miss Malli Admin")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Test WhatsApp Link (wa.me/{normalizeWhatsAppPhone(whatsappNumber)})</span>
              </a>
            </div>
            <span className="text-[10px] text-brand-deepPlum/50 block mt-1">
              Supports 10-digit mobile numbers or international numbers with country code.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              "Buy now" pre-filled message template
            </label>
            <textarea
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum font-mono text-[11px]"
            />
            <span className="text-[10px] text-brand-deepPlum/60 block mt-1">
              Available tags: {"{saree}"}, {"{code}"}, {"{variant}"}, {"{price}"}, {"{request}"}, {"{link}"}
            </span>
          </div>
        </div>

        {/* Order Hold & Expiry Settings */}
        <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-deepPlum/10 pb-3">
            <Clock className="w-4 h-4 text-brand-plum" />
            <h3 className="font-bold text-sm text-brand-deepPlum">
              Inventory Hold & Notifications
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Reserve hold window (hours)
            </label>
            <input
              type="number"
              value={reserveHours}
              onChange={(e) => setReserveHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum"
            />
            <span className="text-[10px] text-brand-deepPlum/60 block mt-1">
              Time an item is reserved while waiting for buyer's WhatsApp reply.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-deepPlum block mb-1">
              Notification Email for Orders
            </label>
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs text-brand-deepPlum"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoExpire}
                onChange={(e) => setAutoExpire(e.target.checked)}
                className="w-4 h-4 accent-brand-deepPlum rounded"
              />
              <span className="text-xs font-semibold text-brand-deepPlum">
                Auto-expire unanswered requests after hold window
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. NAVIGATION BAR LINKS & ORDER
         ======================================================== */}
      <div className="bg-white rounded-[22px] p-6 border border-brand-deepPlum/15 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-deepPlum/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-plum/10 text-brand-plum flex items-center justify-center">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-deepPlum">
                Navigation Bar Links & Order
              </h2>
              <p className="text-xs text-brand-deepPlum/70 font-medium">
                Reorder, customize labels, change paths, or toggle visibility. Changes reflect immediately on the storefront navbar and mobile drawer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetNavLinks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-deepPlum/20 text-brand-deepPlum text-xs font-semibold hover:bg-brand-ivory transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Links</span>
            </button>
            <button
              type="button"
              onClick={addLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-deepPlum text-white text-xs font-semibold hover:bg-brand-plum transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {navLinks.map((link, idx) => (
            <div
              key={link.id || idx}
              className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                link.enabled === false
                  ? "bg-brand-ivory/40 border-dashed border-brand-deepPlum/20 opacity-60"
                  : "bg-brand-ivory/60 border-brand-deepPlum/15 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-deepPlum/10 text-brand-deepPlum text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="flex flex-1 sm:flex-initial items-center gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(idx, "label", e.target.value)}
                    placeholder="Link Label"
                    className="px-3 py-1.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum bg-white w-36"
                  />
                  <input
                    type="text"
                    value={link.to}
                    onChange={(e) => updateLink(idx, "to", e.target.value)}
                    placeholder="Path (e.g. /sarees)"
                    className="px-3 py-1.5 rounded-xl border border-brand-deepPlum/20 text-xs font-mono text-brand-deepPlum/80 bg-white flex-1 sm:w-48"
                  />
                </div>
              </div>

              {/* Actions: Reorder, Toggle Visibility, Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => moveLink(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Move Up"
                  aria-label="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveLink(idx, "down")}
                  disabled={idx === navLinks.length - 1}
                  className="p-1.5 rounded-lg border border-brand-deepPlum/20 text-brand-deepPlum hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Move Down"
                  aria-label="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleLink(idx)}
                  className={`p-1.5 rounded-lg border transition ${
                    link.enabled === false
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-brand-deepPlum/20 text-brand-deepPlum hover:bg-white"
                  }`}
                  title={link.enabled === false ? "Hidden (Click to show)" : "Visible (Click to hide)"}
                  aria-label={link.enabled === false ? "Show link" : "Hide link"}
                >
                  {link.enabled === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Link"
                  aria-label="Delete Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
