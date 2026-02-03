# Influencer Tracking System Documentation

## 🚀 System Overview

Your influencer tracking system is now set up with the following components:

### ✅ Features Implemented:

1. **Auto-Populated Coupon Codes** from referral links
2. **Referral Click Tracking** with user analytics
3. **Influencer Performance Dashboard** with real-time stats
4. **Stripe Webhook Integration** for automatic commission tracking
5. **CSV Export** functionality for payments and analytics

## 🔗 How Referral Links Work

### Link Format:
```
https://your-site.netlify.app/program?ref=sarah25
https://your-site.netlify.app/program?coupon=ALEX15
```

### What Happens:
1. **User clicks** influencer's referral link
2. **Coupon code** auto-populates in the payment form
3. **Click is tracked** with referral data
4. **User completes** purchase with discount
5. **Commission is calculated** automatically via Stripe webhook

## 👥 Managing Influencers

### Admin: Add influencers and set passwords (private, not in repo)
1. Log in at **`/admin`** (admin password).
2. Open the **Influencers** tab.
3. **Add influencer:** Name, Code (e.g. FLOW20), Commission %, Payout method, **Dashboard password**. Data is stored only in your **database** (Neon/Postgres)—never in the repo or env.
4. **Set password:** For existing influencers, click **Set password** and enter a new dashboard password (hashed in DB).

Passwords are hashed (bcrypt) and never stored in GitHub or env. Only you (admin) can add influencers and set their dashboard passwords.

### Partner dashboard (influencers):
Visit: `https://your-site.netlify.app/influencer-dashboard`  
Partners log in with **Partner code** + **Dashboard password** (the password you set in Admin → Influencers).

### Legacy: Add New Influencer (code-only, in repo):
1. Edit **`shared/influencers.ts`** to add a new entry (id, name, code, commission, payoutMethod).
2. Set that influencer’s **dashboard password** in Admin → Influencers (or via env `INFLUENCER_DASHBOARD_PASSWORDS` until migrated).
   - **Name**: Full name
   - **Email**: Contact email
   - **Social Handle**: @username
   - **Platform**: Instagram, TikTok, YouTube, etc.
   - **Coupon Code**: Auto-generated or custom
   - **Discount**: Percentage or fixed amount
   - **Commission Rate**: What % they earn per sale

### Example Influencer Setup:
```
Name: Sarah Johnson
Email: sarah@example.com
Handle: @sarah_manifests
Platform: Instagram
Coupon: SARAH25
Discount: 25%
Commission: 30%
```

## 💰 Commission Tracking

### Automatic Calculation:
- **Sale**: €19.00
- **Discount**: 25% (€4.75)
- **Final Amount**: €14.25
- **Commission**: 30% of €14.25 = €4.28

### Payment Tracking:
- All commissions tracked in dashboard
- Export CSV for payment processing
- Mark commissions as paid
- Full audit trail

## 📊 Analytics & Reporting

### Dashboard Metrics:
- **Total Clicks**: Link clicks per influencer
- **Conversions**: Completed purchases
- **Revenue**: Total sales generated
- **Commission Owed**: Amount to pay influencer
- **Conversion Rate**: Clicks to sales ratio

### CSV Export Includes:
- Influencer details
- Performance metrics
- Commission calculations
- Payment status
- Click tracking data

## 🔐 Referral Code vs Dashboard Password

- **Referral code** (e.g. `FLOW20`) is **public**: used in links (`?ref=FLOW20`) and at checkout. Each use counts as a referral. Anyone can see it.
- **Dashboard password** is **private**: only the influencer has it. They need it to log in at `/influencer-dashboard`. Without it, someone who knows the code cannot access earnings or payout info.

**Login:** Partner code + dashboard password (both required). Passwords are stored only in Netlify env; the app never sees them.

### Set dashboard passwords (Netlify)

1. Netlify → your site → **Site configuration** → **Environment variables**.
2. Add **`INFLUENCER_DASHBOARD_PASSWORDS`** (key) with value a JSON object mapping influencer **id** to password:
   ```json
   {"inf-1":"your-secret-1","inf-2":"your-secret-2","inf-3":"your-secret-3","inf-4":"your-secret-4"}
   ```
   Use the ids from `shared/influencers.ts`: `inf-1` (Magic Master), `inf-2` (Stellar Guide), `inf-3` (Quantum Creator), `inf-4` (Cosmic Flow).
3. Optional: add **`INFLUENCER_JWT_SECRET`** for signing session tokens (defaults to `ADMIN_PASSWORD` if set).
4. Redeploy so the function sees the new variables.

---

## 🔧 Technical Setup Required

### 1. Stripe Webhook Configuration:
1. **Go to** Stripe Dashboard → Developers → Webhooks
2. **Add endpoint**: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. **Copy webhook secret** to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Database Setup (Optional):
The system currently logs data to console. To persist data:
1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Implement the TODO database functions in the code
3. Store influencer and performance data permanently

## 🎯 Influencer Onboarding Process

### 1. Create Influencer Profile:
- Add them to the dashboard
- Generate unique coupon code
- Set discount and commission rates

### 2. Provide Materials:
- **Referral Link**: `yoursite.com/program?ref=theircode`
- **Coupon Code**: For manual entry
- **Discount Amount**: What their followers get
- **Commission Rate**: What they earn per sale

### 3. Track Performance:
- Monitor clicks and conversions
- Export monthly reports
- Pay commissions based on CSV data

## 🧪 Test One Referral Code

**Test person:** Magic Master — code `MAGIC25M`.

### Option A: In the browser
1. Open your app (local or deployed).
2. Go to: **`/program?ref=MAGIC25M`**
3. Coupon field should auto-fill with `MAGIC25M`.
4. Open DevTools → Network; filter by "track-referral".
5. You should see a POST to `/.netlify/functions/track-referral` with status **200** and response `{"success":true,"influencerId":"inf-1","eventType":"click"}`.

### Option B: cURL (no UI)
```bash
# Deployed site (replace with your Netlify URL)
curl -X POST https://YOUR-SITE.netlify.app/.netlify/functions/track-referral \
  -H "Content-Type: application/json" \
  -d '{"referral_code":"MAGIC25M","eventType":"click","amount":0}'
```
Expected: `{"success":true,"influencerId":"inf-1","eventType":"click"}`

Or run: `./scripts/test-referral.sh https://YOUR-SITE.netlify.app`

### Other test codes
- **STARS10** → Stellar Guide (inf-2)
- **QUANTUM50** → Quantum Creator (inf-3)

---

## 📱 Referral Link Examples

### For Social Media Posts:
```
🌟 Manifest your dreams with AI! 
Get 25% off with my exclusive link:
yoursite.com/program?ref=sarah25
Use code SARAH25 at checkout ✨
```

### For Email/Bio Links:
```
Manifestation AI Blueprint - 25% OFF
yoursite.com/program?ref=sarah25
```

## 🔍 Tracking Data Collected

### Per Click:
- Referral code used
- IP address (for analytics)
- User agent (device/browser info)
- Referrer URL (where they came from)
- Timestamp

### Per Purchase:
- Original amount
- Discount applied
- Final amount paid
- Commission calculated
- Customer email
- Stripe payment ID

## 💡 Best Practices

### For Influencers:
1. **Consistent Promotion**: Regular posts work better than one-offs
2. **Authentic Content**: Personal manifestation stories perform best
3. **Clear Call-to-Action**: Direct followers to use their link
4. **Track Their Stats**: Share performance reports monthly

### For You:
1. **Fair Commission Rates**: 25-35% is standard for digital products
2. **Quick Payments**: Pay commissions monthly
3. **Performance Bonuses**: Reward top performers
4. **Exclusive Codes**: Higher discounts for bigger influencers

## 🚀 Next Steps

1. **Deploy the changes** to Netlify
2. **Set up Stripe webhook** endpoint
3. **Test with a sample influencer**
4. **Start onboarding** your first influencers
5. **Monitor performance** and optimize

Your influencer system is ready to scale your manifestation program! 🎉
