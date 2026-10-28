import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  displayOrder: integer("display_order").default(0),
  isOnHome: integer("is_on_home").default(1),
  imageUrl: text("image_url"),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  collectionId: integer("collection_id").references(() => collections.id),
  collectionSlug: text("collection_slug").default("silk"),
  fabric: text("fabric").notNull(),
  length: text("length").default("5.5 meters saree + 0.8 meter blouse piece"),
  care: text("care").default("Dry clean only. Store wrapped in a muslin cloth."),
  price: integer("price").notNull(),
  salePrice: integer("sale_price"),
  description: text("description"),
  status: text("status").default("live"), // 'live' | 'draft'
  isFeatured: integer("is_featured").default(1),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0),
  isCover: integer("is_cover").default(0),
});

export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  blouseOption: text("blouse_option").notNull(), // 'with' | 'without'
  stockCount: integer("stock_count").default(2),
  priceOverride: integer("price_override"),
});

export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestNumber: text("request_number").notNull().unique(), // e.g. '#1042'
  secretToken: text("secret_token").notNull(), // URL identifier
  customerPhone: text("customer_phone"),
  status: text("status").default("needs_reply"), // 'needs_reply' | 'replied' | 'confirmed' | 'dispatched' | 'closed'
  totalAmount: integer("total_amount").notNull(),
  source: text("source").default("buy_now"), // 'buy_now' | 'bag'
  internalNote: text("internal_note"),
  trackingNote: text("tracking_note"),
  isPaymentReceived: integer("is_payment_received").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  expiresAt: text("expires_at"),
});

export const requestItems = sqliteTable("request_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id").references(() => requests.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  variantId: integer("variant_id"),
  productName: text("product_name").notNull(),
  variantDetails: text("variant_details").notNull(),
  priceAtRequest: integer("price_at_request").notNull(),
  imageUrl: text("image_url"),
});

export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  offerText: text("offer_text").notNull(),
  bannerImage: text("banner_image"),
  collectionSlug: text("collection_slug"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isActive: integer("is_active").default(1),
});

export const storeSettings = sqliteTable("store_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
