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
 * Formats clean, elegant WhatsApp order message text with ZERO raw image URLs.
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

/**
 * Mobile-first hybrid WhatsApp ordering helper:
 * - On Mobile (supporting navigator.share with files): Attaches actual photo file(s) directly to WhatsApp with message as caption.
 * - On Desktop / Fallback: Opens WhatsApp Web click-to-chat URL with clean text and OpenGraph meta card preview.
 */
export async function sendWhatsAppOrderWithMedia({
  sellerPhone,
  messageText,
  imageUrls,
  fallbackUrl,
}: {
  sellerPhone: string;
  messageText: string;
  imageUrls?: string[];
  fallbackUrl?: string;
}): Promise<{ shared: boolean }> {
  const cleanPhone = normalizeWhatsAppPhone(sellerPhone);
  const waUrl = fallbackUrl || `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  const validUrls = (imageUrls || []).filter(Boolean);

  if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && validUrls.length > 0) {
    try {
      const filePromises = validUrls.map(async (url, idx) => {
        const fullUrl = toAbsoluteImageUrl(url);
        const res = await fetch(fullUrl);
        const blob = await res.blob();
        const ext = blob.type.includes("png") ? "png" : "jpg";
        return new File([blob], `miss-malli-drape-${idx + 1}.${ext}`, {
          type: blob.type || "image/jpeg",
        });
      });

      const files = await Promise.all(filePromises);

      if (navigator.canShare({ files })) {
        await navigator.share({
          files,
          text: messageText,
        });
        return { shared: true };
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { shared: false };
      }
      console.warn("Native file share fallback:", err);
    }
  }

  // Desktop or standard fallback
  if (typeof window !== "undefined") {
    window.open(waUrl, "_blank");
  }
  return { shared: false };
}
