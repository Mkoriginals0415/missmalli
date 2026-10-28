export interface WhatsAppOrderPayload {
  sellerPhone: string;
  requestNumber: string;
  requestUrl: string;
  items: Array<{
    name: string;
    variantDetails: string;
    price: number;
  }>;
  totalAmount: number;
}

export function generateWhatsAppBuyUrl(payload: WhatsAppOrderPayload): string {
  const { sellerPhone, requestNumber, requestUrl, items, totalAmount } = payload;
  
  // Format phone: remove non-digits
  const cleanPhone = sellerPhone.replace(/\D/g, "");
  
  let message = "";
  if (items.length === 1) {
    const item = items[0];
    message = `Hi Miss Malli, I'd like to buy this saree. Request ${requestNumber}\n\n` +
      `*${item.name}*\n` +
      `₹ ${item.price.toLocaleString("en-IN")} · ${item.variantDetails}\n\n` +
      `Details & status: ${requestUrl}`;
  } else {
    const itemList = items
      .map((item, idx) => `${idx + 1}. *${item.name}* (${item.variantDetails}) - ₹ ${item.price.toLocaleString("en-IN")}`)
      .join("\n");
      
    message = `Hi Miss Malli, I'd like to buy these sarees. Request ${requestNumber}\n\n` +
      `${itemList}\n\n` +
      `*Total: ₹ ${totalAmount.toLocaleString("en-IN")}*\n\n` +
      `Details & status: ${requestUrl}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateWhatsAppQuestionUrl(sellerPhone: string, productName: string, productUrl: string): string {
  const cleanPhone = sellerPhone.replace(/\D/g, "");
  const message = `Hi Miss Malli, I have a question about this saree: *${productName}*\n${productUrl}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
