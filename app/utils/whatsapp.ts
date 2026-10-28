export interface WhatsAppOrderPayload {
  sellerPhone: string;
  requestNumber: string;
  requestUrl: string;
  items: Array<{
    code?: string;
    name: string;
    variantDetails: string;
    price: number;
  }>;
  totalAmount: number;
}

export function generateWhatsAppBuyUrl(payload: WhatsAppOrderPayload): string {
  const { sellerPhone, requestNumber, requestUrl, items, totalAmount } = payload;
  const cleanPhone = sellerPhone.replace(/\D/g, "");

  let message = "";
  if (items.length === 1) {
    const item = items[0];
    const codeStr = item.code ? `[Product ID: #${item.code}]` : "";
    message = `Hi Miss Malli, I would like to order this drape.\n\n` +
      `✨ *${item.name}* ${codeStr}\n` +
      `💰 *₹ ${item.price.toLocaleString("en-IN")}*\n` +
      `🎨 Variant: ${item.variantDetails}\n` +
      `🔖 Request: ${requestNumber}\n\n` +
      `View item & live status:\n${requestUrl}`;
  } else {
    const itemList = items
      .map((item, idx) => {
        const codeStr = item.code ? `(#${item.code})` : "";
        return `${idx + 1}. *${item.name}* ${codeStr}\n   ₹ ${item.price.toLocaleString("en-IN")} · ${item.variantDetails}`;
      })
      .join("\n\n");

    message = `Hi Miss Malli, I would like to order these pieces.\n\n` +
      `🔖 *Request ${requestNumber} (${items.length} items)*\n\n` +
      `${itemList}\n\n` +
      `*Total Amount: ₹ ${totalAmount.toLocaleString("en-IN")}*\n\n` +
      `View order & live status:\n${requestUrl}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppQuestionUrl(sellerPhone: string, productName: string, productCode?: string): string {
  const cleanPhone = sellerPhone.replace(/\D/g, "");
  const codeStr = productCode ? `(#${productCode})` : "";
  const message = `Hi Miss Malli, I have an inquiry about *${productName}* ${codeStr}.\nCould you please help me with details and styling advice?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
