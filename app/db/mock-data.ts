export interface SeedProduct {
  id: number;
  code: string;
  name: string;
  slug: string;
  collectionSlug: "sarees" | "dresses" | "materials" | "exclusive" | string;
  collectionName: string;
  fabric: string;
  length: string;
  care: string;
  price: number;
  originalPrice?: number | null;
  discount?: string;
  badge?: string;
  occasion?: string;
  status?: "live" | "draft" | string;
  description: string;
  images: string[];
  variants: Array<{
    id: number;
    colorName: string;
    colorHex: string;
    blouseOption: "with" | "without" | string;
    stockCount: number;
  }>;
}

export const INITIAL_PRODUCTS: SeedProduct[] = [
  {
    id: 1,
    code: "MM-P01",
    name: "Imitation Pattu Saree with Rich Pallu",
    slug: "imitation-pattu-saree-rich-pallu",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Imitation Pattu Silk · Rich Zari Pallu",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Wrap in soft muslin cloth.",
    price: 2499,
    originalPrice: 3299,
    discount: "24% off",
    badge: "Bestseller",
    occasion: "Wedding",
    status: "live",
    description: "Grand imitation pattu saree featuring an opulent rich zari pallu, intricate traditional motifs along the body, and a majestic festive border. Crafted for wedding celebrations and family ceremonies.",
    images: [
      "/images/products/imitation-pattu-rich-pallu.jpeg",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 101, colorName: "Rich Zari Pattu", colorHex: "#B8923A", blouseOption: "with", stockCount: 4 },
      { id: 102, colorName: "Temple Magenta", colorHex: "#8B1E3F", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 2,
    code: "MM-P02",
    name: "Soft Chinon Trendy Saree",
    slug: "soft-chinon-trendy-saree",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Soft Chinon Silk · Contemporary Fall",
    length: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    care: "Dry clean recommended or gentle handwash.",
    price: 1499,
    originalPrice: 1999,
    discount: "25% off",
    badge: "New",
    occasion: "Festive",
    status: "live",
    description: "Trendy and lightweight soft chinon saree with a fluid, graceful silhouette. Delivers effortless elegance and all-day comfort with subtle designer borders.",
    images: [
      "/images/products/soft-chinon-trendy-saree.jpeg",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 201, colorName: "Soft Chinon Rose", colorHex: "#D879A8", blouseOption: "with", stockCount: 6 },
      { id: 202, colorName: "Dusty Lavender", colorHex: "#C9B6E4", blouseOption: "with", stockCount: 4 },
    ],
  },
  {
    id: 3,
    code: "MM-P03",
    name: "Pure Raw Mango Saree",
    slug: "pure-raw-mango-saree",
    collectionSlug: "exclusive",
    collectionName: "Exclusive",
    fabric: "Pure Raw Silk · Handcrafted Weave",
    length: "5.5 meters saree + 0.8 meter unstitched designer blouse piece",
    care: "Strictly dry clean only. Preserve in pure muslin cloth.",
    price: 4999,
    originalPrice: 6499,
    discount: "23% off",
    badge: "Bestseller",
    occasion: "Wedding",
    status: "live",
    description: "Exclusive luxury raw silk saree showcasing quintessential Raw Mango traditional motifs, artisanal handloom texture, and bespoke heritage border detailing. A statement drape for milestone moments.",
    images: [
      "/images/products/pure-raw-mango-saree.jpeg",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 301, colorName: "Raw Mango Olive / Gold", colorHex: "#8A793A", blouseOption: "with", stockCount: 3 },
      { id: 302, colorName: "Imperial Plum", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 4,
    code: "MM-P04",
    name: "Rich Pure Satin Crepe Saree",
    slug: "rich-pure-satin-crepe-saree",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure Satin Crepe · Lustrous Sheen",
    length: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    care: "Dry clean only. Steam iron on reverse.",
    price: 2499,
    originalPrice: 3199,
    discount: "22% off",
    badge: "New",
    occasion: "Festive",
    status: "live",
    description: "Lustrous pure satin crepe saree offering a fluid, featherlight drape with a delicate sheen. Tailored for cocktail soirees, celebratory dinners, and festive evenings.",
    images: [
      "/images/products/rich-pure-satin-crepe-saree.jpeg",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 401, colorName: "Satin Crepe Emerald", colorHex: "#1B4D3E", blouseOption: "with", stockCount: 5 },
      { id: 402, colorName: "Midnight Navy", colorHex: "#1B2A4A", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 5,
    code: "MM-P05",
    name: "Premium Tissue Banaras Saree",
    slug: "premium-tissue-banaras-saree",
    collectionSlug: "exclusive",
    collectionName: "Exclusive",
    fabric: "Banarasi Tissue Silk · Metallic Zari Weave",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Avoid spraying perfumes directly on zari.",
    price: 2499,
    originalPrice: 3499,
    discount: "28% off",
    badge: "Bestseller",
    occasion: "Wedding",
    status: "live",
    description: "Opulent Banarasi tissue saree with all-over shimmering golden metallic zari brocade work and an intricately bordered pallu. Radiates timeless royal charm under celebratory lights.",
    images: [
      "/images/products/premium-tissue-banaras-saree.jpeg",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 501, colorName: "Champagne Tissue Gold", colorHex: "#D4AF37", blouseOption: "with", stockCount: 4 },
      { id: 502, colorName: "Rose Gold Tissue", colorHex: "#B76E79", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 6,
    code: "MM-P06",
    name: "Premium Mul Cotton Saree",
    slug: "premium-mul-cotton-saree",
    collectionSlug: "materials",
    collectionName: "Dress Materials",
    fabric: "100% Pure Mulmul Cotton · Handblock Prints",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Gentle cold wash with mild detergent or dry clean.",
    price: 1399,
    originalPrice: 1799,
    discount: "22% off",
    badge: "New",
    occasion: "Daily",
    status: "live",
    description: "Ultra-breathable premium mulmul cotton saree adorned with heritage handcrafted ethnic motifs. Remarkably soft to the touch, crafted for effortless everyday comfort and graceful poise.",
    images: [
      "/images/products/premium-mul-cotton-saree.jpeg",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 601, colorName: "Mul Indigo", colorHex: "#1F3A52", blouseOption: "with", stockCount: 8 },
      { id: 602, colorName: "Earthy Terracotta", colorHex: "#C86D51", blouseOption: "with", stockCount: 5 },
    ],
  },
  {
    id: 7,
    code: "MM-P07",
    name: "Purple Peplum Set",
    slug: "purple-peplum-set",
    collectionSlug: "dresses",
    collectionName: "Dresses",
    fabric: "Festive Silk Blend · Embroidered Peplum & Bottom",
    length: "Designer peplum top with flared bottom & matching dupatta",
    care: "Dry clean only.",
    price: 1899,
    originalPrice: 2499,
    discount: "24% off",
    badge: "New",
    occasion: "Festive",
    status: "live",
    description: "Chic and regal designer purple peplum set featuring delicate neckline hand embroidery, flattering cinched waistline silhouette, and coordinated festive bottoms.",
    images: [
      "/images/products/purple-peplum-set.jpeg",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 701, colorName: "Royal Purple", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 5 },
      { id: 702, colorName: "Deep Violet", colorHex: "#4B0082", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 8,
    code: "MM-SK01",
    name: "Rani Pink Kanjivaram Silk Saree",
    slug: "rani-pink-kanjivaram",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Store wrapped in pure muslin cloth.",
    price: 8499,
    originalPrice: 10999,
    discount: "23% off",
    badge: "Bestseller",
    occasion: "Wedding",
    description: "Pure handwoven Kanjivaram silk with temple border and rich zari pallu. Intricate floral jaal woven in antique gold zari. Blouse piece included.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 801, colorName: "Rani Pink", colorHex: "#D879A8", blouseOption: "with", stockCount: 3 },
      { id: 802, colorName: "Royal Magenta", colorHex: "#9B111E", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 9,
    code: "MM-SK02",
    name: "Lavender Georgette Silk Saree",
    slug: "lavender-georgette",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Air periodically in shade.",
    price: 3299,
    badge: "New",
    occasion: "Festive",
    description: "Serene lilac lavender lightweight pure georgette silk drape adorned with delicate scalloped gold sequin borders.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 901, colorName: "Lilac Lavender", colorHex: "#C9B6E4", blouseOption: "with", stockCount: 4 },
      { id: 902, colorName: "Blush Pink", colorHex: "#E8B4C4", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 3,
    code: "MM-SK03",
    name: "Gold Tissue Silk Saree",
    slug: "gold-tissue-silk",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 6999,
    occasion: "Wedding",
    description: "Luminous metallic gold tissue with silk warp, fine zari detailing, and handcrafted border for celebratory evenings.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 301, colorName: "Champagne Gold", colorHex: "#B8923A", blouseOption: "with", stockCount: 5 },
    ],
  },
  {
    id: 4,
    code: "MM-SK04",
    name: "Maroon Banarasi Silk Saree",
    slug: "maroon-banarasi",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only. Store wrapped in muslin.",
    price: 9999,
    originalPrice: 12499,
    discount: "20% off",
    badge: "-20%",
    occasion: "Wedding",
    description: "Classic bridal heritage Banarasi handloom in deep royal maroon with heavy golden kadwa zari pallu and jangla motif body.",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 401, colorName: "Royal Maroon", colorHex: "#65000B", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 5,
    code: "MM-SK05",
    name: "Teal Cotton Silk Chanderi Saree",
    slug: "teal-cotton-silk",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Gentle cold handwash or dry clean.",
    price: 2799,
    occasion: "Daily",
    description: "Featherlight breathable Chanderi cotton silk in deep oceanic teal with delicate gold tissue pattu borders.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 501, colorName: "Ocean Teal", colorHex: "#005E54", blouseOption: "with", stockCount: 6 },
    ],
  },
  {
    id: 6,
    code: "MM-SK06",
    name: "Blush Organza Handwoven Saree",
    slug: "blush-organza",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 4199,
    badge: "New",
    occasion: "Festive",
    description: "Translucent sheer blush organza silk with hand-painted floral motifs and fine thread-zari scalloped hem.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 601, colorName: "Blush Rose", colorHex: "#E8B4C4", blouseOption: "with", stockCount: 3 },
    ],
  },
  {
    id: 7,
    code: "MM-SK07",
    name: "Plum Paithani Pure Silk Saree",
    slug: "plum-paithani",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 11499,
    occasion: "Wedding",
    description: "Heirloom Yeola Paithani in majestic royal plum silk with handwoven Asavali peacock motifs along the golden pallu.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 701, colorName: "Royal Plum", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 1 },
    ],
  },
  {
    id: 8,
    code: "MM-SK08",
    name: "Ivory Zari Tussar Silk Saree",
    slug: "ivory-zari-tussar",
    collectionSlug: "sarees",
    collectionName: "Sarees",
    fabric: "Pure silk · Handwoven",
    length: "5.5 meters saree + 0.8 meter blouse piece",
    care: "Dry clean only.",
    price: 5899,
    occasion: "Festive",
    description: "Richly textured wild Kosa Tussar silk in natural serene ivory with antique metallic gold foliage borders.",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 801, colorName: "Natural Ivory", colorHex: "#FBF8F2", blouseOption: "with", stockCount: 4 },
    ],
  },
  {
    id: 9,
    code: "MM-DS01",
    name: "Plum Zari Kurta Set",
    slug: "plum-zari-kurta-set",
    collectionSlug: "dresses",
    collectionName: "Dresses",
    fabric: "Pure silk · Handwoven",
    length: "Calf length kurta with matching pants & dupatta",
    care: "Dry clean only.",
    price: 4599,
    originalPrice: 5499,
    discount: "15% off",
    badge: "-15%",
    occasion: "Festive",
    description: "Handcrafted pure silk festive kurta set featuring intricate golden marodi embroidery, flared silhouette, and sheer organza dupatta.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 901, colorName: "Royal Plum", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 2 },
    ],
  },
];

export const ACCESSORIES = [
  { id: 101, code: "ACC-01", name: "Zari Embroidered Blouse", price: 1299, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80" },
  { id: 102, code: "ACC-02", name: "Handcrafted Pearl Jhumkas", price: 899, image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80" },
  { id: 103, code: "ACC-03", name: "Silk Velvet Potli Bag", price: 1499, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80" },
  { id: 104, code: "ACC-04", name: "Pure Silk Satin Petticoat", price: 799, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80" },
];

export interface HomepageSection {
  id: "hero" | "categories" | "newArrivals" | "promotion" | "artisan" | "testimonials" | "trustBadges";
  name: string;
  enabled: boolean;
}

export interface CollectionItem {
  id: string;
  name: string;
  count: string;
  slug: string;
  image: string;
  onHome?: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  city: string;
  rating: number;
  avatar?: string;
}

export interface TrustBadgeItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomepageContent {
  // Section ordering & visibility
  sections: HomepageSection[];

  // Hero Section
  hero: {
    headline: string;
    subheadline?: string;
    buttonText: string;
    buttonLink: string;
    badgeText: string;
    desktopImages: string[];
    mobileImages: string[];
    reviewQuote: string;
    reviewAuthor: string;
    reviewLocation: string;
  };

  // Categories Section
  categories: {
    title: string;
    subtitle: string;
    layout: "grid" | "notched" | "cards";
    items: CollectionItem[];
  };

  // New Arrivals Section
  newArrivals: {
    title: string;
    subtitle: string;
    viewAllText: string;
    viewAllLink: string;
    productLimit: number;
  };

  // Promotion / Festive Banner
  promotion: {
    title: string;
    subtitle: string;
    discountTag: string;
    couponCode: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    bgColor?: string;
  };

  // Artisan Spotlight
  artisan: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    videoUrl?: string;
  };

  // Testimonials / Customer Stories
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };

  // Trust Badges / Value Props
  trustBadges: {
    items: TrustBadgeItem[];
  };

  // Legacy flat fields for backward compatibility
  heroTitle?: string;
  heroButtonText?: string;
  categoriesTitle?: string;
  newArrivalsTitle?: string;
  festiveTitle?: string;
  festiveSubtitle?: string;
  festiveDiscount?: string;
  artisanTitle?: string;
  artisanDescription?: string;
  reviewQuote?: string;
  reviewAuthor?: string;
  reviewLocation?: string;
}

export const INITIAL_HOMEPAGE_CONTENT: HomepageContent = {
  sections: [
    { id: "hero", name: "Hero Showcase & Drape Gallery", enabled: true },
    { id: "trustBadges", name: "Brand Guarantees & Trust Badges", enabled: true },
    { id: "categories", name: "Shop by Category / Collections", enabled: true },
    { id: "newArrivals", name: "New Arrivals (Fresh from Loom)", enabled: true },
    { id: "promotion", name: "Festive Offer & Promo Banner", enabled: true },
    { id: "artisan", name: "Master Weavers & Artisan Heritage", enabled: true },
    { id: "testimonials", name: "Customer Testimonials & Stories", enabled: true },
  ],

  hero: {
    headline: "Elevate Your Grace With Heritage Drape",
    subheadline: "Pure handwoven Kanjivaram, Banarasi and wild Tussar silks direct from master weaver looms.",
    buttonText: "Explore Collections",
    buttonLink: "/sarees",
    badgeText: "Learn about our master artisans •",
    desktopImages: [
      "/images/products/imitation-pattu-rich-pallu.jpeg",
      "/images/products/pure-raw-mango-saree.jpeg",
      "/images/products/premium-tissue-banaras-saree.jpeg",
      "/images/products/rich-pure-satin-crepe-saree.jpeg",
      "/images/products/soft-chinon-trendy-saree.jpeg",
    ],
    mobileImages: [
      "/images/products/imitation-pattu-rich-pallu.jpeg",
      "/images/products/pure-raw-mango-saree.jpeg",
      "/images/products/premium-tissue-banaras-saree.jpeg",
      "/images/products/rich-pure-satin-crepe-saree.jpeg",
      "/images/products/soft-chinon-trendy-saree.jpeg",
      "/images/products/premium-mul-cotton-saree.jpeg",
      "/images/products/purple-peplum-set.jpeg",
    ],
    reviewQuote: "miss malli is a piece of art... handwoven typography review it piece of art.... loved the saree!",
    reviewAuthor: "Rafi H.",
    reviewLocation: "Hyderabad",
  },

  categories: {
    title: "Find Your Drape",
    subtitle: "Explore our signature weaves categorized for every milestone",
    layout: "grid",
    items: [
      {
        id: "cat_1",
        name: "Sarees",
        count: "240+ styles",
        slug: "sarees",
        image: "/images/products/imitation-pattu-rich-pallu.jpeg",
        onHome: true,
      },
      {
        id: "cat_2",
        name: "Dresses",
        count: "120+ styles",
        slug: "dresses",
        image: "/images/products/purple-peplum-set.jpeg",
        onHome: true,
      },
      {
        id: "cat_3",
        name: "Dress Materials",
        count: "90+ styles",
        slug: "materials",
        image: "/images/products/premium-mul-cotton-saree.jpeg",
        onHome: true,
      },
      {
        id: "cat_4",
        name: "Exclusive",
        count: "40+ styles",
        slug: "exclusive",
        image: "/images/products/pure-raw-mango-saree.jpeg",
        onHome: true,
      },
    ],
  },

  newArrivals: {
    title: "Fresh From The Loom",
    subtitle: "Handpicked bridal and festive editions finished this week",
    viewAllText: "View all designs",
    viewAllLink: "/sarees",
    productLimit: 4,
  },

  promotion: {
    title: "Flat 30% off on Silk Sarees",
    subtitle: "Handcrafted pure Katan, Kanjivaram and wild Tussar silks. Order directly on WhatsApp with complimentary fall, pico and express delivery.",
    discountTag: "Festive Edit · 2026",
    couponCode: "FESTIVE30",
    buttonText: "Shop the Sale",
    buttonLink: "/sarees?filter=sale",
    image: "/images/products/premium-tissue-banaras-saree.jpeg",
    bgColor: "bg-brand-plum",
  },

  artisan: {
    title: "Woven by hands, worn with pride",
    description: "Each saree is crafted by master weavers from Kanchipuram, Varanasi and Pochampally. Every weave honors centuries of loom heritage and ethical livelihood.",
    buttonText: "Chat With Our Concierge",
    buttonLink: "https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20tell%20me%20about%20your%20artisans",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    videoUrl: "",
  },

  testimonials: {
    title: "Loved by Our Customers",
    subtitle: "Real experiences from over 5,000+ handloom collectors across India & worldwide",
    items: [
      {
        id: "test_1",
        quote: "Beautiful fabric and the zari work is exquisite. Felt like a pure piece of art in person. The WhatsApp team was so helpful!",
        author: "Rafi H.",
        city: "Hyderabad",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "test_2",
        quote: "The drape and pure silk texture surpassed my expectations. Ordering on WhatsApp with request tracker was so seamless!",
        author: "Anjali S.",
        city: "Chennai",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "test_3",
        quote: "Heirloom grade Banarasi. Fast delivery, free pico/fall, and the personal WhatsApp video assistance was incredible.",
        author: "Meera K.",
        city: "Bengaluru",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  trustBadges: {
    items: [
      {
        id: "badge_1",
        icon: "Award",
        title: "100% Pure Silk Certified",
        description: "Govt. Silk Mark & Handloom authenticity on every drape",
      },
      {
        id: "badge_2",
        icon: "Truck",
        title: "Complimentary Fall & Pico",
        description: "Ready-to-wear finishing + insured express Pan-India shipping",
      },
      {
        id: "badge_3",
        icon: "MessageCircle",
        title: "Direct WhatsApp Ordering",
        description: "Zero checkout friction, live weaver photos & 24h reserve hold",
      },
      {
        id: "badge_4",
        icon: "RotateCcw",
        title: "Video Call Selection",
        description: "Live close-up video previews with our saree styling concierge",
      },
    ],
  },

  // Legacy mappings
  heroTitle: "Elevate Your Grace With Heritage Drape",
  heroButtonText: "Explore Collections",
  categoriesTitle: "Find Your Drape",
  newArrivalsTitle: "Fresh From The Loom",
  festiveTitle: "Flat 30% off on Silk Sarees",
  festiveSubtitle: "Handcrafted pure Katan, Kanjivaram and wild Tussar silks. Order directly on WhatsApp with complimentary fall, pico and express delivery.",
  festiveDiscount: "Festive Edit · 2026",
  artisanTitle: "Woven by hands, worn with pride",
  artisanDescription: "Each saree is crafted by master weavers from Kanchipuram, Varanasi and Pochampally. Every weave honors centuries of loom heritage.",
  reviewQuote: "miss malli is a piece of art... handwoven typography review it piece of art.... loved the saree!",
  reviewAuthor: "Rafi H.",
  reviewLocation: "Hyderabad",
};

export interface StoreThemeColors {
  primaryPlum: string;    // Royal plum primary
  deepPlum: string;       // Deep plum footer & buttons
  ivoryCanvas: string;    // Soft canvas background
  accentGold: string;     // Zari gold accent
  accentLilac: string;    // Lilac secondary accent
  accentBlush: string;    // Blush pink accent
}

export const DEFAULT_THEME_COLORS: StoreThemeColors = {
  primaryPlum: "#5B2A6E",
  deepPlum: "#2A1235",
  ivoryCanvas: "#FBF8F2",
  accentGold: "#B8923A",
  accentLilac: "#C9B6E4",
  accentBlush: "#E8B4C4",
};

export const INITIAL_SETTINGS = {
  seller_whatsapp_number: "919876543210",
  buy_now_message_template: "Hi Miss Malli, I'd like to order: {saree} (Product ID: {code})\nPrice: ₹{price}\nRequest #{request}\nLink: {link}",
  reserve_hours: "24",
  auto_expire_unanswered: "true",
  notify_email: "orders@missmalli.com",
  theme_colors: JSON.stringify(DEFAULT_THEME_COLORS),
};
