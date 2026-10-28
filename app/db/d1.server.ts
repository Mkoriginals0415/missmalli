import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_HOMEPAGE_CONTENT, SeedProduct, HomepageContent } from "./mock-data";

export function getDb(env?: { DB?: D1Database }) {
  if (env?.DB) {
    return drizzle(env.DB, { schema });
  }
  return null;
}

let runtimeProducts: SeedProduct[] = [...INITIAL_PRODUCTS];
let runtimeHomepageContent: HomepageContent = { ...INITIAL_HOMEPAGE_CONTENT };
let runtimeRequests: any[] = [
  {
    id: 1042,
    requestNumber: "#1042",
    secretToken: "req_token_1042",
    customerPhone: "+91 98765 43210",
    status: "needs_reply",
    totalAmount: 11798,
    source: "bag",
    internalNote: "Customer asked for delivery by Friday",
    trackingNote: "",
    isPaymentReceived: 0,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Rani Pink Kanjivaram Silk Saree",
        variantDetails: "Rani Pink · With blouse",
        priceAtRequest: 8499,
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 2,
        productId: 2,
        productName: "Lavender Georgette Silk Saree",
        variantDetails: "Lilac Lavender · Without blouse",
        priceAtRequest: 3299,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

let runtimeSettings = { ...INITIAL_SETTINGS };

export async function getAllProducts(env?: { DB?: D1Database }) {
  return runtimeProducts;
}

export async function getProductBySlug(slug: string, env?: { DB?: D1Database }) {
  return runtimeProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: number, env?: { DB?: D1Database }) {
  return runtimeProducts.find((p) => p.id === id) || null;
}

export async function updateProductStock(productId: number, delta: number, env?: { DB?: D1Database }) {
  const product = runtimeProducts.find((p) => p.id === productId);
  if (product && product.variants.length > 0) {
    const current = product.variants[0].stockCount || 0;
    product.variants[0].stockCount = Math.max(0, current + delta);
    return product;
  }
  return null;
}

export async function getHomepageContent(env?: { DB?: D1Database }): Promise<HomepageContent> {
  return runtimeHomepageContent;
}

export async function updateHomepageContent(content: Partial<HomepageContent>, env?: { DB?: D1Database }): Promise<HomepageContent> {
  runtimeHomepageContent = { ...runtimeHomepageContent, ...content };
  return runtimeHomepageContent;
}

export async function getAllRequests(env?: { DB?: D1Database }) {
  return runtimeRequests;
}

export async function getRequestByTokenOrNumber(identifier: string, env?: { DB?: D1Database }) {
  return (
    runtimeRequests.find(
      (r) =>
        r.secretToken === identifier ||
        r.requestNumber === identifier ||
        r.requestNumber === `#${identifier}` ||
        String(r.id) === identifier
    ) || null
  );
}

export async function createNewRequest(
  data: {
    source: "buy_now" | "bag";
    totalAmount: number;
    customerPhone?: string;
    items: Array<{
      code?: string;
      productId: number;
      productName: string;
      variantDetails: string;
      price: number;
      imageUrl: string;
    }>;
  },
  env?: { DB?: D1Database }
) {
  const nextId = 1043 + runtimeRequests.length;
  const requestNumber = `#${nextId}`;
  const secretToken = `req_${Math.random().toString(36).substring(2, 10)}_${nextId}`;

  const newReq = {
    id: nextId,
    requestNumber,
    secretToken,
    customerPhone: data.customerPhone || "",
    status: "needs_reply",
    totalAmount: data.totalAmount,
    source: data.source,
    internalNote: "",
    trackingNote: "",
    isPaymentReceived: 0,
    createdAt: new Date().toISOString(),
    items: data.items.map((item, idx) => ({
      id: idx + 1,
      ...item,
      priceAtRequest: item.price,
    })),
  };

  runtimeRequests.unshift(newReq);

  return {
    requestId: newReq.id,
    requestNumber: newReq.requestNumber,
    secretToken: newReq.secretToken,
    requestUrl: `/r/${newReq.secretToken}`,
  };
}

export async function updateRequestStatus(
  requestId: number,
  updates: {
    status?: string;
    internalNote?: string;
    trackingNote?: string;
    isPaymentReceived?: number;
  },
  env?: { DB?: D1Database }
) {
  const req = runtimeRequests.find((r) => r.id === requestId);
  if (req) {
    if (updates.status !== undefined) req.status = updates.status;
    if (updates.internalNote !== undefined) req.internalNote = updates.internalNote;
    if (updates.trackingNote !== undefined) req.trackingNote = updates.trackingNote;
    if (updates.isPaymentReceived !== undefined) req.isPaymentReceived = updates.isPaymentReceived;
    return req;
  }
  return null;
}

export async function getStoreSettings(env?: { DB?: D1Database }) {
  return runtimeSettings;
}

export async function updateStoreSettings(newSettings: Record<string, string>, env?: { DB?: D1Database }) {
  runtimeSettings = { ...runtimeSettings, ...newSettings };
  return runtimeSettings;
}
