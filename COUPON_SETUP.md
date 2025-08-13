# Stripe Coupon Setup Guide

## How to Create Coupons in Stripe

### 1. Access Stripe Dashboard
- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Navigate to **Products > Coupons**

### 2. Create a New Coupon
Click **"Create coupon"** and configure:

#### Basic Information:
- **Coupon ID**: Enter a memorable code (e.g., `WELCOME10`, `SAVE20`, `EARLY50`)
- **Coupon Name**: Display name for internal use

#### Discount Type:
Choose one of:
- **Percentage**: Enter percentage off (e.g., 10%, 25%, 50%)
- **Fixed Amount**: Enter fixed amount off (e.g., €5, €10)

#### Duration:
- **Once**: Apply discount once
- **Repeating**: Apply for multiple billing cycles (for subscriptions)
- **Forever**: Apply permanently (for subscriptions)

### 3. Example Coupons for Your Manifestation App

#### Magic25M (Free Access) ⭐
```
Coupon ID: MAGIC25M
Type: Percentage
Amount: 100%
Duration: Once
Max Redemptions: 1000
```
*Special code for free access - automatically created by the system*

#### Welcome Coupon (10% off)
```
Coupon ID: WELCOME10
Type: Percentage
Amount: 10%
Duration: Once
```

#### Early Bird (€5 off)
```
Coupon ID: EARLY5
Type: Fixed Amount
Amount: €5.00
Currency: EUR
Duration: Once
```

#### Special Promotion (50% off)
```
Coupon ID: MANIFEST50
Type: Percentage
Amount: 50%
Duration: Once
Max Redemptions: 100 (optional)
```

### 4. Advanced Options

#### Restrictions:
- **Max Redemptions**: Limit total uses
- **Redeem By**: Set expiration date
- **Minimum Amount**: Require minimum order value
- **Currency**: Specify currency (set to EUR for your app)

#### Example Restricted Coupon:
```
Coupon ID: LIMITED20
Type: Percentage
Amount: 20%
Duration: Once
Max Redemptions: 50
Redeem By: December 31, 2024
Minimum Amount: €15.00
```

### 5. How It Works in Your App

1. **Customer enters coupon code** in the coupon input field
2. **Code is sent to Stripe** with the checkout session
3. **Stripe validates** the coupon and applies discount
4. **Customer sees** discounted price in checkout
5. **Payment processes** with the discount applied

### 6. Testing Coupons

#### Test Mode Coupons:
- Create test coupons in Stripe test mode
- Use test payment methods to verify functionality
- Check that discounts apply correctly

#### Example Test Coupons:
```
TEST10     - 10% off
TEST5EUR   - €5 off
TESTFREE   - 100% off (free)
```

### 7. Coupon Analytics

Track coupon usage in Stripe:
- **Dashboard > Products > Coupons**
- View redemption counts
- See total discount amounts
- Monitor popular codes

### 8. Best Practices

#### Naming Conventions:
- Use clear, memorable codes
- Include discount amount (SAVE20, GET10OFF)
- Use consistent formatting (ALL CAPS)

#### Marketing Uses:
- **Welcome codes** for new customers
- **Seasonal promotions** (SPRING25, NEWYEAR50)
- **Social media** exclusive codes
- **Email newsletter** discounts
- **Limited time** offers

### 9. Integration Notes

Your app now supports:
- ✅ **Direct coupon codes** (entered by customer)
- ✅ **Promotion codes** (Stripe's built-in feature)
- ✅ **Automatic validation** (invalid codes are handled gracefully)
- ✅ **Multiple discount types** (percentage and fixed amount)

### 10. Customer Experience

#### Regular Coupons:
1. Customer clicks "Get Started - €19"
2. Clicks "Have a coupon code?" link
3. Enters coupon code (e.g., "WELCOME10")
4. Code is applied automatically in Stripe checkout
5. Sees discounted price before payment
6. Completes purchase with discount

#### Magic25M Free Access:
1. Customer clicks "Get Started - €19"
2. Clicks "Have a coupon code?" link
3. Enters "MAGIC25M"
4. Button changes to "Get Free Access ✨"
5. Proceeds to free Stripe checkout (€0.00)
6. Gets instant access to all features

### 11. Special Features

#### Magic25M Code:
- ✅ **Automatically created** by the system
- ✅ **100% discount** (completely free)
- ✅ **Special UI treatment** (golden styling)
- ✅ **Visual indicators** ("FREE ACCESS ✨")
- ✅ **Button transforms** to "Get Free Access"
- ✅ **Same access** as paid users
- ✅ **Generous limit** (1000 redemptions)

The coupon system is now ready to use! 🎉
