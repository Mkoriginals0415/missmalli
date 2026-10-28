# Miss Malli | Made for Her Moments 🌸

High-fashion Indian saree e-commerce storefront with TikTok-style swipe browsing, frictionless WhatsApp ordering, dynamic OpenGraph preview cards, and Cloudflare Pages + D1 edge architecture.

Designed strictly around the Miss Malli brand kit and wireframe specifications (`Miss_Malli_Store_Design_v2.pdf`).

---

## 🌟 Key Highlights

- **TikTok-Style Image Swipe Feed (M2 & W2)**: Vertical swipe to transition between sarees; horizontal swipe to switch photos of the same saree. Desktop keyboard and arrow support.
- **WhatsApp Checkout (M5 & M10)**: No account required, no address form on the site. Generates an instant order request (`#1042`), locks variant & price, and launches WhatsApp to the seller with pre-filled message and preview link.
- **Dual-View Request Tracker (M12 & A2)**: One link (`/r/[token]`):
  - **Customer view**: Live progress stepper (`Sent` ➔ `Replied` ➔ `Confirmed` ➔ `Dispatched`).
  - **Seller view**: Quick reply macros, order status toggles, stock release, payment record.
- **Cloudflare Edge Native**: Frontend and backend run on Cloudflare Pages/Workers SSR with Cloudflare D1 SQLite database.
- **WhatsApp Dynamic Preview Cards**: Server-side rendered OpenGraph metadata so links shared in WhatsApp display rich preview cards with cover photo, saree name, and price.

---

## 🚀 Phase 1: Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
- Open Chrome DevTools and switch to mobile responsive mode (9:16 aspect ratio) for the full TikTok-swipe experience.

### 3. Local Production Preview with Cloudflare Miniflare
```bash
npm run build
npm run preview
```

---

## 🐙 Phase 2: GitHub Repository Setup

To commit and push your project to GitHub:

```bash
git init
git add .
git commit -m "feat: initial Miss Malli store implementation with Cloudflare D1"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/miss-malli.git
git push -u origin main
```

---

## ☁️ Phase 3: Cloudflare Deployment (D1 + Pages)

Both the database and the frontend run entirely on Cloudflare's global edge network.

### 1. Login to Cloudflare via Wrangler
```bash
npx wrangler login
```

### 2. Create the Cloudflare D1 Database
```bash
npx wrangler d1 create miss-malli-db
```
Wrangler will output your database ID. Update `wrangler.toml` with your `database_id`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "miss-malli-db"
database_id = "<PASTE_YOUR_DATABASE_ID_HERE>"
```

### 3. Apply Schema Migrations to D1
```bash
npx wrangler d1 execute miss-malli-db --file=./migrations/0000_initial.sql
```

### 4. Deploy to Cloudflare Pages
#### Option A: Direct Wrangler Deploy
```bash
npm run build
npx wrangler pages deploy ./build/client --project-name=miss-malli
```

#### Option B: Automated Git CI/CD via Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Select your `miss-malli` GitHub repository.
3. Build Settings:
   - **Framework preset**: `Remix` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `build/client`
4. Under **Settings ➔ Functions ➔ D1 Database bindings**, add:
   - Variable name: `DB`
   - D1 database: `miss-malli-db`
5. Save and Deploy!
