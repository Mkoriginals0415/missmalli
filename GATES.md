# Gates: Mobile Viewport, Bento Hero Moodboard, and 9:16 Frame Aspect Ratio

OWNS: app/**, public/**

Scope: Fix product page mobile viewport rendering, build interlocking bento hero with editorial moodboard images, and eliminate image cropping for 9:16 portrait images.

- [x] G1: Mobile viewport meta tag present in HTML head for product and root routes
  CHECK: node scripts/verify-gates.mjs
  EXPECT: <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"/>
  EVIDENCE: Verified on live Cloudflare Pages: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"/>` present in initial SSR HTML payload for PDP.

- [x] G2: Hero showcase uses editorial moodboard images in an interlocking bento layout inspired by user reference, not catalog product images
  CHECK: node scripts/verify-gates.mjs
  EXPECT: bento hero verified
  EVIDENCE: Verified. `app/routes/_index.tsx` contains `bento-hero-mosaic` with interlocking rounded shapes and pills. `app/db/mock-data.ts` uses luxury moodboard photography (Rani pink silk, lilac georgette, gold zari brocade, loom weavers) instead of individual catalog products.

- [x] G3: 9:16 / 2:3 vertical aspect ratio used on product cards and PDP so images do not get cut off
  CHECK: node scripts/verify-gates.mjs
  EXPECT: aspect ratio verified
  EVIDENCE: Verified across `app/routes/p.$slug.tsx`, `app/routes/sarees.tsx`, `app/routes/_index.tsx`, `app/routes/wishlist.tsx`, `app/routes/search.tsx`, and `app/routes/bag.tsx` using `aspect-[2/3]` with `object-top` and `object-contain` fallback.

- [x] G4: Full TypeScript compilation and Vite production build pass with 0 errors
  CHECK: npm run typecheck && npm run build
  EXPECT: 0 errors
  EVIDENCE: Passed `tsc` with 0 errors; Vite built 2093 client modules and SSR bundle without issues.

- [x] G5: Production build deployed live to Cloudflare Pages and verified
  CHECK: node scripts/verify-gates.mjs
  EXPECT: HTTP 200 on live deployment
  EVIDENCE: Deployed to `https://f7dbc68f.miss-malli.pages.dev` with HTTP 200 for PDP and root route.
