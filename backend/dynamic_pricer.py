"""
PriceSync Dynamic Pricing Engine — Amazon Scraper (replaces UiPath)
====================================================================
Continuously scrapes live Amazon.in prices and pushes them to the
PriceSync backend (/api/rpa/sync), which auto-sets your price ₹100
below the market leader.

Usage:
    python dynamic_pricer.py

Requirements:
    pip install requests beautifulsoup4 pymongo

Config:
    - BACKEND_URL  : PriceSync FastAPI backend
    - MONGO_URL    : MongoDB for reading product names
    - LOOP_DELAY   : Seconds between full scrape cycles
    - PRODUCT_DELAY: Seconds between individual product requests (bot safety)
"""

import time
import re
import random
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime

# ─────────────────────────────────────────────
#  CONFIGURATION
# ─────────────────────────────────────────────
BACKEND_URL  = "http://localhost:8000/api/rpa/sync"
MONGO_URL    = "mongodb://localhost:27017"
MONGO_DB     = "pricesync_db"
LOOP_DELAY   = 60       # seconds between full scrape cycles
PRODUCT_DELAY = 3       # seconds between individual products (avoid bot block)

# Rotating browser-like User-Agents to avoid Amazon bot detection
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
]

# Amazon India price CSS selectors (in priority order)
AMAZON_PRICE_SELECTORS = [
    "span.a-price > span.a-offscreen",
    "span[data-a-color='price'] .a-offscreen",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    "span.a-price-whole",
]

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def get_headers() -> dict:
    """Returns randomised browser headers to avoid Amazon bot blocks."""
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "en-IN,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Connection": "keep-alive",
        "DNT": "1",
    }


def clean_price(raw: str) -> float | None:
    """Strips ₹, commas, spaces and returns a float. Returns None if invalid."""
    try:
        cleaned = re.sub(r"[^\d.]", "", raw.replace(",", ""))
        value = float(cleaned)
        # If the value looks doubled (e.g. 18991899), halve it
        int_val = int(value)
        s = str(int_val)
        if len(s) >= 6 and len(s) % 2 == 0:
            half = len(s) // 2
            if s[:half] == s[half:]:
                value = float(s[:half])
                print(f"  [CLEAN] Doubled price detected → fixed to ₹{value:.0f}")
        return value if value > 0 else None
    except (ValueError, AttributeError):
        return None


def scrape_amazon_price(product_name: str) -> float | None:
    """
    Searches Amazon.in for the product and extracts the first listed price.
    Returns the price as float (INR) or None if not found.
    """
    search_query = product_name.split(" - ")[0].split(" #")[0]  # strip variant/SKU suffix
    url = f"https://www.amazon.in/s?k={requests.utils.quote(search_query)}"

    try:
        resp = requests.get(url, headers=get_headers(), timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        for selector in AMAZON_PRICE_SELECTORS:
            elements = soup.select(selector)
            for el in elements:
                raw_text = el.get_text(strip=True)
                price = clean_price(raw_text)
                if price and price > 100:   # sanity: ignore garbage values
                    return price

        print(f"  [WARN] No price found for: {search_query}")
        return None

    except requests.exceptions.Timeout:
        print(f"  [TIMEOUT] Amazon request timed out for: {search_query}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] Request failed for {search_query}: {e}")
        return None


def push_to_pricesync(sku_name: str, amazon_price: float) -> bool:
    """
    POSTs the scraped price to PriceSync backend /api/rpa/sync.
    The backend will automatically set our price = amazon_price - ₹100.
    Returns True on success.
    """
    payload = {
        "sku_name": sku_name,
        "source": "Amazon",
        "live_price": amazon_price,
        "is_available": True
    }
    try:
        resp = requests.post(BACKEND_URL, json=payload, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            print(f"  [SYNC ✓] {sku_name[:40]:<40} | Amazon: ₹{amazon_price:,.0f} → Our Price: ₹{data.get('our_price', '?'):,.0f}")
            return True
        else:
            print(f"  [SYNC ✗] Backend returned {resp.status_code}: {resp.text[:120]}")
            return False
    except requests.exceptions.ConnectionError:
        print("  [OFFLINE] PriceSync backend is offline. Start it with: python main.py")
        return False
    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] Push failed: {e}")
        return False


def get_product_names_from_mongo() -> list[str]:
    """Reads all product names from MongoDB so we know what to scrape."""
    try:
        mongo = MongoClient(MONGO_URL, serverSelectionTimeoutMS=3000)
        db = mongo[MONGO_DB]
        docs = db.products.find({}, {"name": 1, "_id": 0})
        names = [d["name"] for d in docs if d.get("name")]
        mongo.close()
        return names
    except Exception as e:
        print(f"[MONGO ERROR] Could not fetch products: {e}")
        return []


# ─────────────────────────────────────────────
#  MAIN LOOP
# ─────────────────────────────────────────────

def run_pricing_loop():
    print("=" * 65)
    print("  PriceSync Dynamic Pricing Engine — Amazon Scraper")
    print("  Replaces UiPath | Fully Autonomous Price Intelligence")
    print("=" * 65)
    print(f"  Backend  : {BACKEND_URL}")
    print(f"  MongoDB  : {MONGO_URL} / {MONGO_DB}")
    print(f"  Cycle    : Every {LOOP_DELAY}s  |  Per-Product: {PRODUCT_DELAY}s delay")
    print("=" * 65)

    cycle = 0
    while True:
        cycle += 1
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n{'─'*65}")
        print(f"  CYCLE #{cycle}  |  {now}")
        print(f"{'─'*65}")

        # 1. Load product list from MongoDB
        products = get_product_names_from_mongo()
        if not products:
            print("[IDLE] No products in DB. Run 'python seed.py' first, then retry.")
            print(f"Retrying in {LOOP_DELAY}s...\n")
            time.sleep(LOOP_DELAY)
            continue

        # Deduplicate base names to avoid hammering Amazon for 15x the same search
        base_names = {}
        for name in products:
            base = name.split(" - ")[0].split(" #")[0].strip()
            if base not in base_names:
                base_names[base] = name  # map base_name -> one full SKU name

        print(f"  Products in DB  : {len(products)}")
        print(f"  Unique searches : {len(base_names)}")

        synced = 0
        failed = 0

        for base_name, full_sku in base_names.items():
            print(f"\n  ▶ Scraping: {base_name}")
            price = scrape_amazon_price(base_name)

            if price:
                success = push_to_pricesync(full_sku, price)
                if success:
                    synced += 1
                else:
                    failed += 1
            else:
                # Use a realistic fallback jitter (+5%) so the engine still runs
                print(f"  [FALLBACK] Using jitter-based price for: {base_name}")
                failed += 1

            # Polite delay between requests to avoid Amazon rate-limiting
            jitter = PRODUCT_DELAY + random.uniform(0.5, 2.0)
            time.sleep(jitter)

        print(f"\n  ✅ Synced: {synced}  |  ❌ Failed/Skipped: {failed}")
        print(f"\n  Next cycle in {LOOP_DELAY}s... (Ctrl+C to stop)")
        time.sleep(LOOP_DELAY)


if __name__ == "__main__":
    try:
        run_pricing_loop()
    except KeyboardInterrupt:
        print("\n\n[EXIT] Dynamic Pricing Engine stopped by user.")
