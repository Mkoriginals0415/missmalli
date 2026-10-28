export interface SeedProduct {
  id: number;
  name: string;
  slug: string;
  collectionSlug: string;
  collectionName: string;
  fabric: string;
  length: string;
  care: string;
  price: number;
  salePrice?: number;
  description: string;
  status: "live" | "draft";
  images: string[];
  variants: Array<{
    id: number;
    colorName: string;
    colorHex: string;
    blouseOption: "with" | "without";
    stockCount: number;
  }>;
}

export const INITIAL_PRODUCTS: SeedProduct[] = [
  {
    id: 1,
    name: "Ruby Red Banarasi Silk Saree",
    slug: "ruby-red-banarasi",
    collectionSlug: "silk",
    collectionName: "Pure Silk",
    fabric: "Pure Katan Silk with Golden Zari",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Store wrapped in pure muslin cloth.",
    price: 9800,
    description: "An heirloom-grade Banarasi woven in pure mulberry katan silk with intricate floral jaal in antique gold zari. Perfect for weddings and grand festive celebrations.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 101, colorName: "Ruby Red", colorHex: "#9B111E", blouseOption: "with", stockCount: 2 },
      { id: 102, colorName: "Ruby Red", colorHex: "#9B111E", blouseOption: "without", stockCount: 1 },
      { id: 103, colorName: "Deep Crimson", colorHex: "#65000B", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 2,
    name: "Peacock Green Kanjivaram",
    slug: "peacock-green-kanjivaram",
    collectionSlug: "silk",
    collectionName: "Pure Silk",
    fabric: "Authentic Kanchipuram Silk",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Air periodically in shade.",
    price: 9500,
    description: "Traditional Korvai weaving featuring a regal peacock green body with contrasting magenta pallu and temple border zari motifs.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 201, colorName: "Peacock Green", colorHex: "#005E54", blouseOption: "with", stockCount: 1 },
      { id: 202, colorName: "Bottle Green", colorHex: "#093F2B", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 3,
    name: "Ivory Cotton Silk Chanderi",
    slug: "ivory-cotton-silk",
    collectionSlug: "cotton",
    collectionName: "Cotton Silk",
    fabric: "Chanderi Cotton Silk blend",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Gentle hand wash in cold water or mild dry clean.",
    price: 4950,
    description: "Lightweight, sheer and breathable Chanderi saree in serene ivory with delicate gold tissue borders and hand-block motifs.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 301, colorName: "Soft Ivory", colorHex: "#FAF5F0", blouseOption: "with", stockCount: 5 },
      { id: 302, colorName: "Soft Ivory", colorHex: "#FAF5F0", blouseOption: "without", stockCount: 4 },
      { id: 303, colorName: "Blush Pink", colorHex: "#E8A0C2", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 4,
    name: "Muted Rose Tussar Silk",
    slug: "muted-rose-tussar",
    collectionSlug: "festive",
    collectionName: "Festive",
    fabric: "Wild Tussar (Kosa) Silk",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean recommended.",
    price: 6950,
    description: "Richly textured wild tussar silk in dusty muted rose with antique metallic foil leaf print and zari pattu edging.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 401, colorName: "Muted Rose", colorHex: "#C08081", blouseOption: "with", stockCount: 2 },
      { id: 402, colorName: "Lavender Haze", colorHex: "#B59AD9", blouseOption: "with", stockCount: 1 },
    ],
  },
  {
    id: 5,
    name: "Royal Purple Paithani Silk",
    slug: "royal-purple-paithani",
    collectionSlug: "silk",
    collectionName: "Pure Silk",
    fabric: "Yeola Paithani Pure Silk",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 11200,
    description: "Classic Maharashtrian Paithani in royal purple with hand-woven Asavali peacock motifs along the rich golden pallu.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 501, colorName: "Royal Purple", colorHex: "#713D8C", blouseOption: "with", stockCount: 2 },
      { id: 502, colorName: "Deep Plum", colorHex: "#51265F", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 6,
    name: "Champagne Gold Tissue Saree",
    slug: "champagne-gold-tissue",
    collectionSlug: "festive",
    collectionName: "Festive",
    fabric: "Metallic Tissue with Silk Warp",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 7800,
    description: "Luminous champagne gold tissue saree with scalloped hand-embroidery border. Drapes like a dream for evening cocktails and receptions.",
    status: "live",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
    ],
    variants: [
      { id: 601, colorName: "Champagne Gold", colorHex: "#C99A48", blouseOption: "with", stockCount: 3 },
    ],
  },
];

export const INITIAL_SETTINGS = {
  seller_whatsapp_number: "919876543210",
  buy_now_message_template: "Hi Miss Malli, I'd like to buy this saree. Request {request}\n\n{saree}\n{price} · {variant}\n{link}",
  reserve_hours: "24",
  auto_expire_unanswered: "true",
  notify_email: "orders@missmalli.com",
};
