# UiPath — Amazon Price Scraping Guide v10.1

## Overview
This guide explains how UiPath robots scrape **live Amazon.in prices** and send them to the PriceSync RPA Bridge at `POST http://localhost:8000/api/rpa/sync`.

---

## Step 1: Open Amazon Product Page in Chrome

In UiPath Studio, use **Open Browser** activity:
- URL: `https://www.amazon.in/s?k=iPhone+16+Pro+Max`
- Browser: Chrome

---

## Step 2: Get the Price Element

Use **Get Text** or **Get Attribute** activity with these CSS selectors:

| Product Section | CSS Selector |
|---|---|
| Main Price (whole) | `span.a-price-whole` |
| Main Price (full) | `span[data-a-color="price"] .a-offscreen` |
| Alternate Price | `#priceblock_ourprice` |
| Deal Price | `#priceblock_dealprice` |
| New Price | `span.a-price > span.a-offscreen` |

> **Tip:** Right-click the price on Amazon → Inspect → Copy Selector in Chrome DevTools.

---

## Step 3: Clean the Price

After scraping, clean the price using the **Assign** activity:

```vb
cleanPrice = Double.Parse(
  System.Text.RegularExpressions.Regex.Replace(
    rawPriceText.Replace(",", ""), "[^0-9.]", ""
  )
)
```

This removes `₹`, commas, and spaces.

---

## Step 4: Send to PriceSync API

Use **HTTP Request** activity:
- **Method:** POST
- **URL:** `http://localhost:8000/api/rpa/sync`
- **Headers:** `Content-Type: application/json`
- **Body Type:** String
- **Body:**

```json
{
  "sku_name": "iPhone 16 Pro Max",
  "source": "Amazon",
  "live_price": YOUR_CLEANED_PRICE_VARIABLE,
  "is_available": true
}
```

---

## Step 5: Loop Through All Products

Use **For Each** activity to loop through your product list:

```
Products = {"iPhone 16 Pro Max", "MacBook Pro M4 Pro", "Samsung Galaxy S25 Ultra", ...}

For Each product In Products:
  1. Navigate to: https://www.amazon.in/s?k={product}
  2. Scrape price using CSS selector
  3. Clean price
  4. POST to http://localhost:8000/api/rpa/sync
  5. Wait 2 seconds (avoid bot detection)
```

---

## Expected Backend Response

A successful sync returns:
```json
{
  "status": "success",
  "sku": "iPhone 16 Pro Max",
  "amazon_price": 144900.0,
  "our_price": 144800.0
}
```

PriceSync sets your price **₹100 cheaper** than Amazon automatically.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `SKU not found in DB` | Run `python seed.py` first to seed the product |
| `Deserialize JSON` error | Remove quotes around variable names in Body field |
| Price returns `0` | Try `span.a-price > span.a-offscreen` selector |
| `[]` brackets in product name causing crash | Fixed — backend uses `re.escape()` automatically |
