export interface WhatsAppOrderPayload {
  sellerPhone: string;
  requestNumber: string;
  requestUrl: string;
  items: Array<{
    code?: string;
    name: string;
    variantDetails: string;
    price: number;
    imageUrl?: string;
  }>;
  totalAmount: number;
  customTemplate?: string;
}

/**
 * Normalizes any phone number into international WhatsApp format (digits only).
 * If 10 digits (typical Indian mobile), automatically prepends 91.
 */
export function normalizeWhatsAppPhone(phone?: string | null): string {
  let clean = (phone || "").replace(/\D/g, "");
  if (!clean) return "919876543210";
  if (clean.length === 10) {
    clean = "91" + clean;
  } else if (clean.length === 11 && clean.startsWith("0")) {
    clean = "91" + clean.slice(1);
  }
  return clean;
}

/**
 * Formats phone number for clean human display (e.g. +91 98765 43210)
 */
export function formatPhoneDisplay(phone?: string | null): string {
  const clean = normalizeWhatsAppPhone(phone);
  if (clean.startsWith("91") && clean.length === 12) {
    return `+91 ${clean.slice(2, 7)} ${clean.slice(7)}`;
  }
  return `+${clean}`;
}

/**
 * Ensures an image URL is absolute with scheme so scrapers/fetchers can retrieve it.
 */
export function toAbsoluteImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return `https://missmalli.in${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Formats clean, elegant WhatsApp order message text with full product request details.
 * Contains NO raw image URLs, relying on WhatsApp's OpenGraph meta preview card from requestUrl.
 */
export function generateWhatsAppBuyMessage(payload: WhatsAppOrderPayload): string {
  const { requestNumber, requestUrl, items, totalAmount, customTemplate } = payload;

  if (customTemplate && items.length === 1) {
    const item = items[0];
    return customTemplate
      .replace(/\{saree\}/g, item.name)
      .replace(/\{code\}/g, item.code || "")
      .replace(/\{variant\}/g, item.variantDetails)
      .replace(/\{price\}/g, item.price.toLocaleString("en-IN"))
      .replace(/\{request\}/g, requestNumber)
      .replace(/\{image\}/g, "") // Never output raw image URL in text
      .replace(/\{link\}/g, requestUrl)
      .replace(/\n\s*\n\s*\n/g, "\n\n");
  }

  if (items.length === 1) {
    const item = items[0];
    const codeStr = item.code ? `[Product ID: #${item.code}]` : "";
    return (
      `Hi Miss Malli, I would like to order this drape.\n\n` +
      `✨ *${item.name}* ${codeStr}\n` +
      `💰 *₹ ${item.price.toLocaleString("en-IN")}*\n` +
      `🎨 Variant: ${item.variantDetails}\n` +
      `🔖 Request: ${requestNumber}\n\n` +
      `View item & live status:\n${requestUrl}`
    );
  }

  const itemList = items
    .map((item, idx) => {
      const codeStr = item.code ? `(#${item.code})` : "";
      return `${idx + 1}. *${item.name}* ${codeStr}\n   ₹ ${item.price.toLocaleString("en-IN")} · ${item.variantDetails}`;
    })
    .join("\n\n");

  return (
    `Hi Miss Malli, I would like to order these pieces.\n\n` +
    `🔖 *Request ${requestNumber} (${items.length} items)*\n\n` +
    `${itemList}\n\n` +
    `*Total Amount: ₹ ${totalAmount.toLocaleString("en-IN")}*\n\n` +
    `View order & live status:\n${requestUrl}`
  );
}

export function generateWhatsAppBuyUrl(payload: WhatsAppOrderPayload): string {
  const cleanPhone = normalizeWhatsAppPhone(payload.sellerPhone);
  const message = generateWhatsAppBuyMessage(payload);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppQuestionUrl(sellerPhone: string, productName: string, productCode?: string): string {
  const cleanPhone = normalizeWhatsAppPhone(sellerPhone);
  const codeStr = productCode ? `(#${productCode})` : "";
  const message = `Hi Miss Malli, I have an inquiry about *${productName}* ${codeStr}.\nCould you please help me with details and styling advice?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
