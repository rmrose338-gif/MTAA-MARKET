# Mtaa Market

A small full-stack marketplace starter with a React/Vite storefront, an Express API, SQLite persistence, and an optional Flask sales-analysis service.

## Requirements

- Node.js 22.12+
- npm
- Python 3.10+ only if you want to run the optional analytics service

## Run locally

1. Start the API:

   ```powershell
   cd backend/api
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

   The API runs at `http://localhost:5000`. It creates and seeds `backend/database/mtaa_market.db` on first startup. Set `MTAA_DATABASE_PATH` in `.env` to store the database elsewhere.

   To enable the administrator console, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/api/.env` before the first API start. Use an email you control and a unique password of 12–72 characters. The first configured admin is created once; public customer/seller registration cannot create an administrator. If no administrator exists, `/admin/login` also offers one-time first-admin setup with an email and new password. Once created, setup is disabled; additional admins and password changes are managed in the protected admin Settings page. The console is available at `/admin/login`.

2. In another terminal, start the website:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. The frontend uses the API at `http://localhost:5000/api` by default. Set `VITE_API_URL` to override it. The API allows the usual Vite development origins on ports 5173 and 5174.

   The sample catalog includes fresh fruit and vegetables, farm produce, groceries and kiosk goods, household essentials, personal care and cleaning products, phone accessories, school and office supplies, small hardware and repair supplies, clothing, shoes, perfumes, jewelry, and community services. Buyers must sign in or create a buyer account before they can browse the shop or see product listings. Clothing and footwear are separated into men's, women's, and children's browse sections; perfumes and jewelry appear in “Other clothing & accessories.” Search supports product names and descriptions; buyers can filter by category, clothing/shoe section, and price. Product pages show stock, and sellers can choose to publish their market area and phone/WhatsApp contact details.

3. Optional analytics service:

   ```powershell
   cd backend/python-service
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python app.py
   ```

   It listens on `http://localhost:8000`; the Express analytics endpoint proxies to it when `PYTHON_SERVICE_URL` is configured.

## Deploy on Render

The root `render.yaml` Blueprint deploys the React storefront as a free static site and the Express API as a free web service. The Blueprint generates a `JWT_SECRET` and connects the frontend and API automatically. The optional Python analytics service is not included in this Blueprint.

This free deployment uses SQLite on the API's ephemeral filesystem. **Users, products, orders, and other database changes may be lost when the service restarts, spins down, or redeploys.** Use this setup for a demo, not production data that must be retained. Render's free web service may spin down after inactivity, so the first request can take time to respond.

Push the repository to GitHub, then in Render choose **New > Blueprint**, connect `rmrose338-gif/MTAA-MARKET`, select the `main` branch, review the free services, and deploy. To enable the administrator console, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the API service's Render environment before its first startup. Add M-Pesa credentials in the API service environment only if enabling STK Push; do not put secrets in `render.yaml` or Git.

## Demo

Customers must create a buyer account or sign in before they can browse the shop, add items to a cart, or place an order. The storefront and API both require buyer authentication for cart and order operations. Sellers create an account with a name, Kenyan mobile number, and password; no email address is needed. Existing email-based accounts can still sign in with their previous email address. At checkout, customers can choose sample boda boda delivery (KSh 150), an Uber delivery ride (KSh 350), or seller pickup. Sample arrival windows are shown at checkout and saved with the order; sellers confirm actual transport cost and timing. Customers can pay cash on delivery/pickup, send M-Pesa directly to the seller, or use an M-Pesa STK Push that confirms payment with Safaricom before the order is marked paid. The website does not book couriers or provide live tracking.

### Enable M-Pesa STK Push

1. Register for Safaricom Daraja API access and obtain a shortcode, consumer key/secret, and STK passkey. Copy `backend/api/.env.example` to `backend/api/.env` and set `MPESA_ENV=sandbox` plus `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, and `MPESA_PASSKEY`.
2. Expose the API through a publicly reachable HTTPS URL (for local testing, use an HTTPS tunnel such as Cloudflare Tunnel or ngrok). Set `MPESA_CALLBACK_URL` to `https://your-public-api.example/api/payments/mpesa/callback` and set `MPESA_CALLBACK_TOKEN` to a unique random string of at least 32 characters. The app adds this token to the callback URL to reject unauthenticated callback attempts. A localhost URL cannot receive Daraja callbacks.
3. Restart the API. The M-Pesa checkout option sends the order total plus the selected estimated delivery fee to the customer's Kenyan phone. Customers approve the prompt on their device; the app records `pending`, `paid`, or `failed` based on the callback and displays the M-Pesa receipt when confirmed. Failed or declined prompts can be retried from the order confirmation.
4. Use Daraja sandbox test credentials and numbers while testing. Switch `MPESA_ENV=production` only with production credentials and a production-ready HTTPS deployment. Never ask customers to enter their M-Pesa PIN on this website.

Checkout checks the API's public `/api/orders/payment-options` endpoint and disables M-Pesa STK Push when the required settings are missing. This endpoint never returns credentials. M-Pesa direct-to-seller remains a separate, unverified payment choice.

Sellers can list products or create service adverts for tailoring and repairs, shoe repair, hairdressing, laundry, cleaning, phone repair, local delivery, and shopping assistance. Service categories show clearly labeled examples, and the seller form pre-fills an editable example advert; only adverts actually published by sellers appear as real worker listings. Sellers can add a shop/market area and explicitly choose whether their phone, WhatsApp link, and area are shown publicly. Shoppers can call or message opted-in sellers. Clothing and footwear listings are limited to KSh 30–1,000, and the sample clothing catalogue uses locally hosted photographs of the named items and appropriate models. New seller registrations require administrator approval, and new product listings are reviewed before appearing in the marketplace. Product listings include a product photo, description, category, price, and stock; demo products and delivery choices use locally hosted images. Buyers can report saved orders. Sellers see order fulfilment details in the seller space. The admin console provides product moderation, seller and customer account management, order tracking, category management, complaints, sales analytics, administrator management, and an audit log. The database is local and is not intended for production deployment.

Signed-in customers can use `/customer` for order and payment summaries, a saved delivery address, language selection, and a server-backed wishlist. Seller accounts use `/seller` for listing and stock management, sales and order summaries, and a six-month chart of completed sales. Product edits are sent back for administrator review; products with order history cannot be deleted, so sellers can set stock to zero instead. Administrators sign in separately at `/admin/login`; the protected admin dashboard includes marketplace totals, product and account management, payment references, reports, and settings. Delivery progress is based on order status updates; the site does not provide courier GPS tracking or push notifications.

The product browser groups clothing and shoes into their own sections and other goods into named product categories. Selecting a category opens all available products in it; product detail pages show similar named items first, then other choices from the same clothing/shoe group or product category. Apparel and footwear use real, locally hosted item photographs and offer size selection without color filters. The seeded reusable food containers and school lunch box use product-specific photos. The Beauty & Personal Care sample catalogue is intentionally small, uses product-matched local photographs, and does not offer unverified cosmetic shade options. Older sample beauty listings are retained only for order-history references and are hidden from the storefront. Photo credits: “Glass food storage container with Easy Find Lids” by Rubbermaid Products, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Glass_food_storage_container_with_Easy_Find_Lids.jpg); “Lock and Lock box bento Valentines Day” by Melissa, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lock_and_Lock_box_bento_Valentines_Day_(8473513335).jpg); “Black and White Striped Dress, Black Cardigan, and Cobalt Blue Flats” by Jamie, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Black_and_White_Striped_Dress,_Black_Cardigan,_and_Cobalt_Blue_Flats_(17205094882).jpg).

Beauty image credits: “Absolute Tulip Lotion - (7028027789)” by m01229, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Absolute_Tulip_Lotion_-_(7028027789).jpg); “Fake Eyelashes” by ookikioo, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Fake_Eyelashes.jpg); “Foundation (cosmetics)” by Jen, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Foundation_(cosmetics).jpg); “LRP sunscreen bottle” by Netstars22, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:LRP_sunscreen_bottle.jpg); “Mascara de pestañas” by Jorge Barrios, public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mascara_de_pesta%C3%B1as.jpg). The photographed Avon trademark is shown for product identification only and does not imply endorsement.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET/PATCH /api/auth/me`
- `GET /api/products`, `GET /api/products/:id`, `POST /api/products`
- `GET /api/jobs`, `GET /api/jobs/:id`, `GET /api/jobs/mine`, `POST /api/jobs`
- `GET /api/categories`
- `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/:productId`
- `POST /api/orders`, `GET /api/orders`
- `GET /api/orders/:id/payment-status`, `POST /api/orders/:id/mpesa` (STK status and retry)
- `POST /api/orders/mpesa/callback` (Daraja STK result callback)
- `GET /api/payments/:id/status`, `POST /api/payments/:id/stk` (payment status and STK retry)
- `POST /api/payments/mpesa/callback` (payment callback; the order callback path remains supported)
- `GET /api/orders/seller/summary`
- `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:productId` (signed-in customers)
- `PATCH /api/products/:id`, `DELETE /api/products/:id` (seller-owned product management)
- `GET /api/analytics/sales` (optional Python service)
- `POST /api/complaints` (signed-in customer/seller issue reports)
- `/api/admin/*` (admin login, protected moderation, management, analytics, settings, and activity log)
- `GET /api/admin/payments` (administrator payment history and transaction references)
