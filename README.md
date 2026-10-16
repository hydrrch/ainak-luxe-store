# Ainak Luxe (OptiStyle PK) — Full-Stack Eyewear E-Commerce Platform

A production-grade, full-stack luxury eyewear e-commerce platform inspired by [ainak.pk](https://ainak.pk/). Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, real-time Virtual Try-On, prescription lens customization, Pakistani Cash on Delivery (COD) checkout, customer account portal, and a protected administration center.

---

## 🌟 Key Highlights & Verified Features

### 1. Augmented Virtual Try-On Mirror
- **Live Webcam Mode**: Real-time video mirror with face geometry and pupil tracking (`requestAnimationFrame` loop).
- **Photo Upload Alternative**: Upload portrait selfies directly from mobile or desktop.
- **Accurate Mathematical Overlay**: Positioned relative to eye centers and nose bridge, scaled to interpupillary distance, and rotated according to head tilt.
- **Fine-Tuning Controls**: Interactive alignment sliders for scale (75%–135%), nose bridge height (Y-offset), horizontal alignment (X-offset), and tilt angle.
- **Frame & Variant Switcher**: Live switching between frames and color variants without resetting the camera session.
- **Snapshot Generator**: Downloads the composite image of the user wearing the chosen frame.
- **Instant Add-to-Bag**: Adds the calibrated frame directly to cart from the try-on session.
- **Hardware Teardown**: Clean camera stream release (`track.stop()`) on modal close.

### 2. Pakistani E-Commerce & Checkout Flow
- **Pakistani Currency**: All prices formatted natively in PKR (`Rs. 18,500`).
- **Pakistani Mobile Validation**: Validates local mobile formats (`0300-1234567` / `+923001234567`).
- **Major Pakistani Cities Dropdown**: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, and 200+ cities.
- **Cash on Delivery (COD)**: Functional out-of-the-box with zero third-party API dependencies.
- **Sandbox Online Gateway & Bank Transfer**: Configurable test payment modes.
- **Free Shipping Threshold**: Free delivery on orders above Rs. 4,000, with a live progress indicator.
- **Coupon Discount System**: Percentage (`AINAK10` for 10% off) and fixed amount discounts (`WELCOME500`), validated strictly on the server against minimum order requirements and expiry.
- **Inventory Overselling Protection**: Atomic database transaction checks and decrements stock upon order placement.

### 3. Functional Product Catalogue & Search
- **Database Query Filtering**: All filtering and search are executed directly against the database via Prisma ORM (never frontend-only array filtering).
- **Multi-Field Search**: Searches across frame title, brand, description, and SKU.
- **Combined Faceted Filters**:
  - Category (Eyeglasses, Sunglasses, Reading, Kids)
  - Gender (Men, Women, Unisex, Kids)
  - Brand (Ray-Ban, Prada, Gucci, Tom Ford, Louis Vuitton, Cartier, Hugo Boss, Moscot, etc.)
  - Frame Shape (Wayfarer, Aviator, Round, Square, Cat-Eye, Clubmaster, Hexagonal)
  - Material (Acetate, Metal, Titanium, TR-90, Mixed)
  - Rim Type (Full Rim, Half Rim, Rimless)
  - Frame Size (Small, Medium, Large)
  - Price Range Slider (Min/Max PKR)
- **Sorting**: Newest, Bestseller, Price Low to High, Price High to Low.
- **Server Pagination**: Dynamic page calculation with clean URL query synchronization.

### 4. Prescription Lens Customization
- **Lens Options**:
  - Frame Only (Rs. 0)
  - Blue Cut Screen Protection (Rs. 1,500)
  - Anti-Glare / Anti-Reflective (Rs. 1,000)
  - Photochromic Transition (Rs. 3,500)
  - Bifocal with Line (Rs. 3,000)
  - Progressive Multi-Focal (Rs. 6,500)
- **Custom Prescription Entry**:
  - Distance, Reading, Bifocal, and Progressive selection.
  - Sphere (OD/OS), Cylinder (OD/OS), Axis (OD/OS), and Pupillary Distance (PD).
  - Saved into cart item records and serialized into order items.

### 5. Customer Accounts & Tracking
- Registration, Login, and Session management with bcryptjs and JWT cookies.
- Customer dashboard with order history, line items, and saved wishlist.
- Public order tracking at `/track-order` supporting live status progression: `PENDING` → `CONFIRMED` → `PROCESSING` (Lens Glazing) → `SHIPPED` (with TCS/Leopards courier tracking number) → `DELIVERED`.

### 6. Protected Administrator Dashboard
- Route `/admin` protected with server-side role verification (`ADMIN`).
- **Metrics Dashboard**: Total revenue (PKR), total orders, active registered customers, and low-stock alerts.
- **Orders Management**: Search orders, filter by status, update order/payment status, and attach courier tracking numbers.
- **Catalogue CRUD**: Create new frames, edit base price and stock counts, and delete products.
- **Low Stock Monitoring**: Real-time alerts for frames with 10 or fewer units in inventory.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14.2.15 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4 (`#ba252f` Crimson Brand, `#d39d4e` Gold, `#111827` Luxury Slate) |
| **Database** | SQLite (Zero-setup local development) / PostgreSQL (Production ready) |
| **ORM** | Prisma 5.22.0 |
| **Authentication** | JWT (`jsonwebtoken`) + Secure HTTP-only cookies + `bcryptjs` password hashing |
| **Virtual Try-On** | HTML5 Canvas + MediaPipe-compatible facial landmark tracking + Scalable SVG frame overlays |
| **Icons** | Lucide React |

---

## 📂 Project Directory Structure

```
extractor/
├── prisma/
│   ├── schema.prisma       # Relational models: User, Order, Product, Variant, LensOption, etc.
│   ├── seed.js             # Comprehensive seeder (12 frames, 10 brands, coupons, admin/customer)
│   └── dev.db              # Local SQLite database
├── public/
│   └── glasses/            # Scalable transparent SVG frame overlays for Virtual Try-On
│       ├── wayfarer-black.svg
│       ├── aviator-gold.svg
│       ├── round-metal.svg
│       ├── cat-eye.svg
│       ├── transparent-crystal.svg
│       └── clubmaster.svg
├── scripts/
│   └── test-runner.js      # 54-assertion automated full-stack verification test suite
├── src/
│   ├── app/
│   │   ├── api/            # Route handlers: auth, products, cart, checkout, orders, reviews, admin
│   │   ├── account/        # Customer portal, login & registration
│   │   ├── admin/          # Protected administration control center
│   │   ├── cart/           # Shopping bag page with prescription breakdown & free delivery meter
│   │   ├── category/[slug] # Category dynamic filter routes
│   │   ├── checkout/       # Pakistani delivery address & COD checkout
│   │   ├── order-success/  # Order receipt, prescription details & printable invoice
│   │   ├── product/[slug]  # Product detail page with gallery zoom, dimensions & lens selector
│   │   ├── products/       # Catalogue page with database query filtering & sorting
│   │   ├── track-order/    # Public courier shipment tracking
│   │   ├── globals.css     # Global styles & custom scrollbars
│   │   ├── layout.tsx      # Root layout with providers, header, footer & floating widgets
│   │   ├── page.tsx        # Storefront homepage with hero try-on banner & category grids
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   └── sitemap.ts      # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── cart/           # Slide-over CartDrawer
│   │   ├── home/           # TryOnHeroBanner, HomeTabs
│   │   ├── layout/         # AnnouncementBar, Header, Footer, WhatsAppWidget
│   │   ├── product/        # ProductGallery, ProductPurchaseBox, ProductReviewSection
│   │   ├── products/       # ProductFilters, ProductSortBar
│   │   ├── tryon/          # VirtualTryOnModal (Camera stream, photo upload, calibration sliders)
│   │   └── ui/             # ProductCard, PrintButton
│   ├── context/
│   │   ├── AuthContext.tsx # User session provider
│   │   ├── CartContext.tsx # Cart state, totals & coupon provider
│   │   └── TryOnContext.tsx# Global Virtual Try-On state & product switcher
│   └── lib/
│       ├── auth.ts         # JWT signing/verification, password hashing
│       ├── cart.ts         # Guest & user cart merging, total calculations
│       ├── prisma.ts       # Prisma client singleton
│       └── utils.ts        # Currency formatters (PKR), order generators, constants
├── .env.example            # Environment variables template
├── package.json            # Scripts & dependencies
├── tailwind.config.ts      # Brand color palette configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Quickstart Local Setup Instructions

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd extractor
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration uses zero-dependency SQLite:
```ini
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STORE_NAME="Ainak Luxe"
JWT_SECRET="ainak_luxe_jwt_secret_dev_2026_super_secure_key"
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run db:seed
```
This generates the database schema and populates:
- **10 Luxury Brands**: Ray-Ban, Prada, Gucci, Tom Ford, Louis Vuitton, Cartier, etc.
- **12 Fully-Featured Products**: With dimensions, color variants, try-on configs, and images.
- **6 Precision Lens Options**: Blue Cut, Anti-Glare, Photochromic, Bifocal, Progressive.
- **Coupons**: `AINAK10` (10% off), `WELCOME500` (Rs. 500 off), `FREESHIP` (Free shipping).
- **Default Accounts**: Admin & Customer.

### 4. Run Automated Test Suite
Run the 54-assertion end-to-end verification test suite:
```bash
npm run build
npm start &
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔐 Administrator Setup & Default Credentials

The initial seed creates pre-configured accounts:

### Administrator Account
- **Portal URL**: [http://localhost:3000/admin](http://localhost:3000/admin) (or `/admin/login`)
- **Email**: `admin@ainakluxe.pk`
- **Password**: `Admin123!@#`
- **Capabilities**: View revenue/orders, update order delivery statuses, input TCS/Leopards tracking numbers, add/edit/delete products, manage inventory.

### Customer Account
- **Portal URL**: [http://localhost:3000/account](http://localhost:3000/account) (or `/account/login`)
- **Email**: `customer@example.com`
- **Password**: `Customer123!@#`

> **Security Note**: In production, change the administrator password immediately via the database or environment configuration. The password hashing uses bcrypt with 10 salt rounds.

---

## 👓 Virtual Try-On Configuration

The virtual try-on engine accepts transparent SVG frame assets located in `public/glasses/`:
- `wayfarer-black.svg`
- `aviator-gold.svg`
- `round-metal.svg`
- `cat-eye.svg`
- `transparent-crystal.svg`
- `clubmaster.svg`

### Adding New Frames to Virtual Try-On
When adding a new frame in the Admin Dashboard (`/admin`), set:
- **Virtual Try-On SVG Overlay**: Choose an existing overlay or place a custom transparent SVG in `public/glasses/` and reference its path.
- **Try-On Calibration**: Adjust default `tryOnScale` (default `1.0`), `tryOnOffsetY` (default `0.0`), and `tryOnOffsetX`.
- **Dimensions**: Specify lens width, bridge width, temple length, lens height, and total width in millimeters.

---

## 💳 Payment Gateway Configuration

### 1. Cash on Delivery (COD)
- Fully operational without third-party credentials.
- Enabled by default for all addresses in Pakistan.

### 2. JazzCash / EasyPaisa / Sandbox Gateway
To enable online card processing or mobile wallets, fill in the credentials in `.env`:
```ini
PAYMENT_SANDBOX_MODE="true"
EASYPAISA_STORE_ID="your_easypaisa_store_id"
EASYPAISA_HASH_KEY="your_easypaisa_hash_key"
JAZZCASH_MERCHANT_ID="your_jazzcash_merchant_id"
JAZZCASH_PASSWORD="your_jazzcash_password"
JAZZCASH_INTEGRITY_SALT="your_jazzcash_salt"
```

---

## ☁️ Deployment Instructions

### Vercel / Cloud Platforms
1. Connect the repository to Vercel.
2. In Project Settings > Environment Variables, provide:
   - `DATABASE_URL` (PostgreSQL connection string, e.g. from Supabase or Neon).
   - `JWT_SECRET`.
   - `NEXT_PUBLIC_APP_URL`.
3. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
4. Deploy. Vercel automatically runs `npm run build`, generating the Prisma Client and optimized standalone bundles.

---

## 📊 Verification Test Results

```
======================================================
Starting OptiStyle / Ainak Luxe Full-Stack Verification Suite
Target: http://localhost:3000
======================================================

[Test 1] Storefront Homepage & Metadata
  ✓ Homepage returns HTTP 200 OK
  ✓ Homepage contains brand identity
  ✓ Homepage contains Virtual Try-On references

[Test 2] Virtual Try-On Transparent Frame Overlays
  ✓ Asset /glasses/wayfarer-black.svg returns HTTP 200
  ✓ Asset /glasses/wayfarer-black.svg is a valid SVG document
  ✓ Asset /glasses/aviator-gold.svg returns HTTP 200
  ✓ Asset /glasses/aviator-gold.svg is a valid SVG document
  ✓ Asset /glasses/round-metal.svg returns HTTP 200
  ✓ Asset /glasses/round-metal.svg is a valid SVG document
  ✓ Asset /glasses/cat-eye.svg returns HTTP 200
  ✓ Asset /glasses/cat-eye.svg is a valid SVG document
  ✓ Asset /glasses/transparent-crystal.svg returns HTTP 200
  ✓ Asset /glasses/transparent-crystal.svg is a valid SVG document
  ✓ Asset /glasses/clubmaster.svg returns HTTP 200
  ✓ Asset /glasses/clubmaster.svg is a valid SVG document

[Test 3] Products Catalogue & Database Query Filtering
  ✓ GET /api/products returns HTTP 200
  ✓ Products returned as array
  ✓ Found 12 products in database
  ✓ Brand facets returned
  ✓ Search by 'Ray-Ban' returned only matching products
  ✓ Shape filter AVIATOR returned matching products
  ✓ Price range filter 5000-15000 respected

[Test 4] Product Detail API with Lens Options & Reviews
  ✓ Product detail returns HTTP 200
  ✓ Correct product retrieved
  ✓ Lens options list included
  ✓ Includes Blue Cut, Anti-Glare, Photochromic, and Progressive lenses

[Test 5] Customer Authentication & Session Cookies
  ✓ Registration returns HTTP 200
  ✓ Auth token cookie set upon registration
  ✓ Login returns HTTP 200
  ✓ Current user profile matches logged in account

[Test 6] Shopping Cart, Prescription Storage & Coupon Engine
  ✓ Added product to cart with custom prescription
  ✓ Cart item created
  ✓ Prescription right eye sphere saved
  ✓ Pupillary distance saved
  ✓ Coupon AINAK10 validated successfully
  ✓ Coupon valid flag true
  ✓ 10% percentage discount recognized

[Test 7] Checkout Flow with Pakistani Address & COD
  ✓ Order placed successfully with COD
  ✓ Order success confirmed
  ✓ Valid order number generated: OPT-20261016-8259
  ✓ Cart cleared after checkout

[Test 8] Customer Order Lookup & Public Tracking
  ✓ Track order endpoint returns order
  ✓ Customer phone matches
  ✓ Initial status is PENDING
  ✓ Payment method is COD

[Test 9] Admin Security Enforcement & Order Lifecycle Management
  ✓ Non-admin user correctly blocked from admin stats (HTTP 403)
  ✓ Admin login successful
  ✓ Admin stats accessible by administrator
  ✓ Admin sees total order count in database
  ✓ Admin updated order status to PROCESSING with TCS tracking
  ✓ Customer sees updated status: PROCESSING
  ✓ Customer sees assigned tracking number

[Test 10] SEO Sitemap & Robots Validation
  ✓ robots.txt returns HTTP 200
  ✓ sitemap.xml returns HTTP 200

======================================================
All 54 Test Assertions PASSED Successfully!
Failed Tests: 0
======================================================
```
