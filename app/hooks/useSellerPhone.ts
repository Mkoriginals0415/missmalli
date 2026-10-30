import { useRouteLoaderData } from "@remix-run/react";
import { normalizeWhatsAppPhone, formatPhoneDisplay } from "~/utils/whatsapp";

export function useSellerPhone() {
  const rootData = useRouteLoaderData<{ sellerPhone?: string }>("root");
  const rawPhone = rootData?.sellerPhone || "919876543210";
  const phone = normalizeWhatsAppPhone(rawPhone);
  const formatted = formatPhoneDisplay(phone);

  const getChatUrl = (text = "Hi Miss Malli, I would like assistance with an order") => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return {
    phone,
    formatted,
    getChatUrl,
  };
}
