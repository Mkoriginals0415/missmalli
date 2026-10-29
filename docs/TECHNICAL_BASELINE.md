# Miss Malli Technical Baseline & Architecture Documentation

## 1. System Architecture
- **Framework**: Remix v2 (v2.17.5) with Vite (v5.4.14)
- **Runtime Environment**: Cloudflare Pages with edge server-side rendering (SSR)
- **Edge Handler**: `functions/[[path]].ts` wrapping `@remix-run/cloudflare` `createRequestHandler`
- **Static Assets Routing**: `public/_routes.json` bypassing Functions for `/assets/*`, `/brand/*`, `/images/*`, `/favicon.ico`
- **Database**: Cloudflare D1 Database (`miss-malli-db`, ID: `ca79ce10-b736-4c0c-9ce2-00173e9d6b1a`)
- **ORM & Migrations**: Drizzle ORM (`drizzle-orm/d1`) with SQLite migrations in `migrations/`
- **Styling**: Tailwind CSS (v3.4.17) with custom brand tokens:
  - Ivory: `#FBF8F2`
  - Plum: `#5B2A6E`
  - Deep Plum: `#2A1235`
  - Lilac: `#C9B6E4`
  - Blush: `#E8B4C4`
  - Zari Gold: `#B8923A`
  - Ink: `#111111`
  - Radius: `card` (22px), `pill` (30px)
- **Client Persistence**: Browser `localStorage` for Guest Wishlist (`miss_malli_saved_sarees_v1`) and Shopping Bag (`miss_malli_bag_v1`)
- **Ordering Channel**: WhatsApp Business API URL scheme (`https://wa.me/...`) with pre-filled encoded order details

## 2. Baseline Verification
- TypeScript typecheck: `npm run typecheck` passes with 0 errors
- Production build: `npm run build` generates `build/client` and `build/server`
- Deployment pipeline: Wrangler CLI (`pages deploy build/client`) & GitHub integration
