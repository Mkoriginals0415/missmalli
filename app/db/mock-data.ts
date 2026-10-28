export interface SeedProduct {
  id: number;
  code: string;
  name: string;
  slug: string;
  collectionSlug: "sarees" | "dresses" | "materials" | "exclusive";
  collectionName: string;
  fabric: string;
  length: string;
  care: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: "New" | "Bestseller" | "-15%" | "-20%";
  occasion?: "Wedding" | "Festive" | "Daily";
  description: string;
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
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 101, colorName: "Rani Pink", colorHex: "#D879A8", blouseOption: "with", stockCount: 3 },
      { id: 102, colorName: "Royal Magenta", colorHex: "#9B111E", blouseOption: "with", stockCount: 2 },
      { id: 103, colorName: "Deep Purple", colorHex: "#5B2A6E", blouseOption: "with", stockCount: 2 },
    ],
  },
  {
    id: 2,
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
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      { id: 201, colorName: "Lilac Lavender", colorHex: "#C9B6E4", blouseOption: "with", stockCount: 4 },
      { id: 202, colorName: "Blush Pink", colorHex: "#E8B4C4", blouseOption: "with", stockCount: 2 },
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
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    ],
    mobileImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "cat_2",
        name: "Dresses",
        count: "120+ styles",
        slug: "dresses",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "cat_3",
        name: "Dress Materials",
        count: "90+ styles",
        slug: "materials",
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "cat_4",
        name: "Exclusive",
        count: "40+ styles",
        slug: "exclusive",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
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

export const INITIAL_SETTINGS = {
  seller_whatsapp_number: "919876543210",
  buy_now_message_template: "Hi Miss Malli, I'd like to order: {saree} (Product ID: {code})\nPrice: ₹{price}\nRequest #{request}\nLink: {link}",
  reserve_hours: "24",
  auto_expire_unanswered: "true",
};
