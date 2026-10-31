import * as schema from "~/db/schema";
import { getDb } from "~/db/d1.server";
import { SeedProduct } from "~/db/mock-data";

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface GlobalSeoSettings {
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  canonicalDomain: string;
  defaultOgImage: string;
  robotsIndexing: "all" | "noindex";
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  ga4MeasurementId?: string;
  pages: {
    home: PageSeoConfig;
    sarees: PageSeoConfig;
    dresses: PageSeoConfig;
    sale: PageSeoConfig;
    collections: PageSeoConfig;
    artisans: PageSeoConfig;
    info: PageSeoConfig;
    [key: string]: PageSeoConfig;
  };
  categorySeo: Record<string, PageSeoConfig>;
  productOverrides: Record<string, PageSeoConfig>;
}

export const DEFAULT_SEO_SETTINGS: GlobalSeoSettings = {
  siteTitle: "Miss Malli | Made for Her Moments",
  titleTemplate: "%s | Miss Malli",
  defaultDescription:
    "Exclusive handpicked Indian sarees, festive collections, and pure silks. Buy directly from authentic artisans on WhatsApp.",
  canonicalDomain: "https://missmalli.in",
  defaultOgImage: "https://missmalli.in/brand/logo.png",
  robotsIndexing: "all",
  googleSiteVerification: "",
  bingSiteVerification: "",
  ga4MeasurementId: "",
  pages: {
    home: {
      title: "Miss Malli | Made for Her Moments – Handcrafted Sarees",
      description:
        "Discover luxury pure silks, Kanjivaram, Organza, and festive sarees handcrafted with love by Indian master artisans.",
    },
    sarees: {
      title: "Handcrafted Sarees Collection | Miss Malli",
      description:
        "Explore exquisite handloom sarees, Banarasi, Kanjivaram, Chiffon, and Silk sarees with complimentary Fall & Pico.",
    },
    dresses: {
      title: "Festive Dresses & Kurtas | Miss Malli",
      description:
        "Elegantly tailored ethnic dresses and contemporary drapes for festive elegance and celebratory moments.",
    },
    sale: {
      title: "Festive Offers & Special Sarees | Miss Malli",
      description:
        "Limited edition handwoven sarees at special festive pricing with instant WhatsApp concierge checkout.",
    },
    collections: {
      title: "Exclusive Heirloom Collections | Miss Malli",
      description:
        "Curated heirloom silk collections woven by master weavers across India with certified Silk Mark authenticity.",
    },
    artisans: {
      title: "Meet Our Master Artisans & Weavers | Miss Malli",
      description:
        "Preserving generational Indian handloom craftsmanship, transparent pricing, and direct weaver support.",
    },
    info: {
      title: "About Us & Customer Care | Miss Malli",
      description:
        "Learn about Miss Malli's story, certified Silk Mark quality, shipping, returns, and concierge WhatsApp support.",
    },
  },
  categorySeo: {
    silk: {
      title: "Pure Silk Sarees | Miss Malli",
      description: "Authentic pure silk sarees with Silk Mark certification and heirloom gold zari.",
    },
    georgette: {
      title: "Graceful Georgette Sarees | Miss Malli",
      description: "Lightweight and flowy georgette sarees adorned with delicate embroidery and scalloped borders.",
    },
    organza: {
      title: "Handpainted Organza Sarees | Miss Malli",
      description: "Ethereal translucent organza sarees featuring floral pastels and contemporary drapes.",
    },
  },
  productOverrides: {},
};

let runtimeSeoSettings = { ...DEFAULT_SEO_SETTINGS };

export async function getSeoSettings(env?: { DB?: D1Database }): Promise<GlobalSeoSettings> {
  const db = getDb(env);
  if (db) {
    try {
      const row = await db.query.storeSettings.findFirst({
        where: (s, { eq }) => eq(s.key, "seo_settings_json"),
      });
      if (row?.value) {
        const parsed = JSON.parse(row.value);
        runtimeSeoSettings = {
          ...DEFAULT_SEO_SETTINGS,
          ...runtimeSeoSettings,
          ...parsed,
          pages: { ...DEFAULT_SEO_SETTINGS.pages, ...parsed.pages },
          categorySeo: { ...DEFAULT_SEO_SETTINGS.categorySeo, ...parsed.categorySeo },
          productOverrides: { ...DEFAULT_SEO_SETTINGS.productOverrides, ...parsed.productOverrides },
        };
      }
    } catch (e) {
      // D1 query failed, use runtime cache
    }
  }
  return runtimeSeoSettings;
}

export async function updateSeoSettings(
  newSeo: Partial<GlobalSeoSettings>,
  env?: { DB?: D1Database }
): Promise<GlobalSeoSettings> {
  await getSeoSettings(env);
  runtimeSeoSettings = {
    ...runtimeSeoSettings,
    ...newSeo,
  };

  const db = getDb(env);
  if (db) {
    try {
      await db
        .insert(schema.storeSettings)
        .values({
          key: "seo_settings_json",
          value: JSON.stringify(runtimeSeoSettings),
        })
        .onConflictDoUpdate({
          target: schema.storeSettings.key,
          set: { value: JSON.stringify(runtimeSeoSettings) },
        });
    } catch (e) {
      console.error("Error saving SEO settings to D1:", e);
    }
  }
  return runtimeSeoSettings;
}

/* =========================================================
   JSON-LD Structured Data Generators
   ========================================================= */

export function buildOrganizationSchema(domain = "https://missmalli.in", phone = "+919876543210") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Miss Malli",
    "url": domain,
    "logo": `${domain}/brand/logo.png`,
    "slogan": "Made for Her Moments",
    "description": "Exclusive handpicked Indian sarees, festive collections, and pure silks.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": phone,
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi", "Telugu"],
      },
    ],
    "sameAs": [
      "https://www.instagram.com/missmalli",
      "https://www.facebook.com/missmalli",
    ],
  };
}

export function buildWebSiteSchema(domain = "https://missmalli.in") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Miss Malli",
    "url": domain,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${domain}/sarees?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(domain: string, items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${domain}${item.url}`,
    })),
  };
}

export function buildProductSchema(domain: string, product: SeedProduct, ratingData?: { ratingValue: number; reviewCount: number }) {
  const images = (product.images || []).map((img) => (img.startsWith("http") ? img : `${domain}${img}`));
  const primaryImage = images[0] || `${domain}/brand/logo.png`;
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  const schemaObj: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.length > 0 ? images : primaryImage,
    "description": product.description || `${product.name} in pure ${product.fabric}. Handcrafted Indian saree.`,
    "sku": `MM-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Miss Malli",
      "slogan": "Made for Her Moments",
    },
    "offers": {
      "@type": "Offer",
      "url": `${domain}/p/${product.slug}`,
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2028-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.status === "live" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Miss Malli",
      },
    },
  };

  // Only include genuine rating if authentic data is supplied
  if (ratingData && ratingData.reviewCount > 0) {
    schemaObj.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingData.ratingValue,
      "reviewCount": ratingData.reviewCount,
    };
  }

  return schemaObj;
}

export function buildCollectionSchema(domain: string, title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `${domain}${path}`,
  };
}
