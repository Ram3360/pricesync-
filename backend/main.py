import asyncio
import random
import re
import pyodbc
from datetime import datetime
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

# --- Configuration ---
# MongoDB Initialization
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.pricesync_db

# --- RPA Data Models ---
class RPASyncData(BaseModel):
    sku_name: str
    source: str  # 'Amazon' or 'Flipkart'
    live_price: float
    is_available: bool

class UserAuth(BaseModel):
    username: str
    password: str
    role: str = "user"
    full_name: Optional[str] = None
    email: Optional[str] = None
    organization: Optional[str] = None

# SQL Server Configuration (The Power BI Bridge)
SQL_CONN_STR = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=PriceSync_Audit;"
    "Trusted_Connection=yes;"
)

def log_to_sql(sku, price, amz_price):
    """Pushes price jitter to SQL for Power BI with terminal logging."""
    try:
        conn = pyodbc.connect(SQL_CONN_STR)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO PriceAuditRegistry (SKU_Name, CapturedPrice, AmzPrice, SyncTime) VALUES (?, ?, ?, ?)",
            (sku, float(price), float(amz_price), datetime.now())
        )
        conn.commit()
        conn.close()
        print(f"--- SQL SYNC SUCCESS: {sku} | \u20b9{price} | {datetime.now().strftime('%H:%M:%S')} ---")
    except Exception as e:
        # FAIL-SAFE: SQL offline should not crash the RPA bridge
        print(f"!!! SQL OFFLINE WARNING (non-fatal): {e}")

def clean_messy_price(raw_price: float) -> float:
    """Fix doubled prices from Amazon scraping (e.g. 18991899 → 1899)."""
    price_str = str(int(raw_price))
    length = len(price_str)
    if length >= 6 and length % 2 == 0:
        half = length // 2
        first_half = price_str[:half]
        second_half = price_str[half:]
        if first_half == second_half:
            cleaned = float(first_half)
            print(f"[PRICE CLEAN] Detected doubled price {raw_price} → {cleaned}")
            return cleaned
    return raw_price

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Segment Profiles: Strategy & Market Lead Config
SEGMENT_PROFILES = {
    "Gaming": {"lead": 0.04, "strategy": "Market Dominance (High Margin)"},
    "Wearables": {"lead": 0.12, "strategy": "Growth Penetration"},
    "Home Appliances": {"lead": 0.08, "strategy": "Optimal Yield Protection"},
    "Electronics": {"lead": 0.06, "strategy": "Standard Competitiveness"},
    "Fitness": {"lead": 0.15, "strategy": "Aggressive Market Entry"},
    "Mobile Phones": {"lead": 0.05, "strategy": "Competitive Penetration"},
    "Kids Tech": {"lead": 0.10, "strategy": "Volume Growth"},
    "Premium Tech": {"lead": 0.03, "strategy": "Premium Holding"},
    "Outdoor": {"lead": 0.12, "strategy": "Seasonal Yield Boost"}
}

async def pricing_engine_with_bi_sync():
    """Every 10s: reprices ALL products — ₹1000 below Amazon + ±₹50 jitter via bulk_write."""
    print("Pricing Engine Active: BULK mode — ALL products repriced every 10 seconds...")
    while True:
        try:
            products = await db.products.find({"auto_pricing": True}).to_list(2000)

            if products:
                from pymongo import UpdateOne
                ops = []
                cat_sample = {}

                for product in products:
                    category = product.get("category", "Electronics")
                    profile = SEGMENT_PROFILES.get(category, SEGMENT_PROFILES["Electronics"])
                    amz_price = product.get("amazon_price", 0)
                    inv_count = product.get("stock") or product.get("inventory_count", 100)

                    discount = 1000
                    jitter = random.randint(-50, 50)   # ±₹50 shimmer
                    new_price = max(100, round(amz_price - discount + jitter))

                    strategy = profile["strategy"]
                    if isinstance(inv_count, int) and inv_count < 50:
                        strategy = "Inventory Protection"
                        new_price = max(100, round(amz_price - 500 + jitter))

                    ops.append(UpdateOne(
                        {"_id": product["_id"]},
                        {"$set": {"current_price": new_price, "price": new_price}}
                    ))
                    cat_sample[category] = new_price

                result = await db.products.bulk_write(ops)
                sample_str = " | ".join(f"{c}: ₹{p:,}" for c, p in list(cat_sample.items())[:4])
                print(f"--- ENGINE: {result.modified_count}/{len(products)} repriced | {sample_str}")
            else:
                print("!!! ENGINE IDLE: No products found. Run 'python seed.py' first.")

        except Exception as e:
            print(f"Engine Loop Error: {e}")

        await asyncio.sleep(10)  # Reprice ALL products every 10 seconds

@app.on_event("startup")
async def startup():
    # Re-enable the live pricing engine alongside the RPA Orchestrator
    print("--- RPA ORCHESTRATOR ACTIVE: Ready for UiPath Telemetry ---")
    print("--- LIVE PRICING ENGINE: Starting autonomous price calibration ---")
    asyncio.create_task(pricing_engine_with_bi_sync())

# --- ADVANCEMENT: The UiPath Bridge Endpoint ---
@app.post("/api/rpa/sync")
async def sync_from_uipath(data: RPASyncData):
    """
    Receives real-time telemetry from UiPath robots.
    Updates the website instantly with a competitive edge.
    """
    try:
        # CLEAN: Fix doubled prices from messy Amazon scraping
        clean_price = clean_messy_price(data.live_price)
        
        # RPA Business Rule: Maintain ₹1000 edge below market leader
        our_new_price = clean_price - 1000
        
        # SAFE: Use re.escape to prevent regex crashes from product names with brackets
        safe_sku = re.escape(data.sku_name)
        result = await db.products.update_one(
            {"name": {"$regex": safe_sku, "$options": "i"}},
            {"$set": {
                "amazon_price": clean_price,
                "current_price": our_new_price,
                "price": our_new_price,
                "last_rpa_sync": datetime.now()
            }}
        )
        
        if result.matched_count == 0:
            return {"status": "error", "message": f"SKU {data.sku_name} not found in DB"}

        # Sync to SQL Audit for Power BI Analytics (non-fatal if SQL offline)
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, log_to_sql, data.sku_name, our_new_price, clean_price)
        
        print(f">>> ROBOT SYNC SUCCESS: {data.sku_name} | Amazon: \u20b9{clean_price} | Our Price: \u20b9{our_new_price}")
        return {"status": "success", "sku": data.sku_name, "amazon_price": clean_price, "our_price": our_new_price}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OrderItem(BaseModel):
    id: int
    name: str
    price: float
    qty: int

class OrderManifest(BaseModel):
    user_id: str
    username: str
    customer_name: str
    items: List[OrderItem]
    total_yield: float
    address: str
    payment_method: str
    coupon_code: Optional[str] = None
    discount: float

@app.post("/api/auth/signup")
async def signup(user: UserAuth):
    existing = await db.users.find_one({"username": user.username})
    if existing:
        return {"detail": "Identity already registered."}
    
    user_dict = user.dict()
    result = await db.users.insert_one(user_dict)
    user_dict["userId"] = str(result.inserted_id)
    return user_dict

@app.post("/api/auth/login")
async def login(user: UserAuth):
    found = await db.users.find_one({"username": user.username, "password": user.password, "role": user.role})
    if not found:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid Security Protocol: Access Denied.")
    
    found["userId"] = str(found["_id"])
    del found["_id"]
    return found

@app.post("/api/orders")
async def create_order(order: OrderManifest):
    order_dict = order.dict()
    order_dict["timestamp"] = datetime.now()
    await db.orders.insert_one(order_dict)
    print(f"--- ORDER SUCCESS: {order.username} | ₹{order.total_yield} | {order.payment_method} ---")
    return {"status": "Registry Authorized"}

@app.get("/api/products")
async def get_products():
    products = await db.products.find().to_list(1000)
    for p in products: p["_id"] = str(p["_id"])
    return products


class ManualPriceOverride(BaseModel):
    new_price: float
    reason: str = "Admin Manual Override"


@app.patch("/api/products/{product_id}/price")
async def override_product_price(product_id: str, body: ManualPriceOverride):
    """Admin manual price override — sets price directly in MongoDB."""
    try:
        from bson import ObjectId as ObjId
        result = await db.products.update_one(
            {"_id": ObjId(product_id)},
            {"$set": {
                "current_price": body.new_price,
                "price": body.new_price,
                "last_admin_override": datetime.now(),
                "override_reason": body.reason
            }}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        print(f">>> ADMIN OVERRIDE: Product {product_id} → ₹{body.new_price} | Reason: {body.reason}")
        return {"status": "success", "product_id": product_id, "new_price": body.new_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/settings/margin")
async def update_global_margin(payload: dict):
    """Stores the global minimum margin in DB for the pricing engine to read."""
    margin = payload.get("margin", 25)
    await db.settings.update_one(
        {"key": "global_margin"},
        {"$set": {"value": margin, "updated_at": datetime.now()}},
        upsert=True
    )
    print(f">>> MARGIN UPDATED: {margin}%")
    return {"status": "success", "margin": margin}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)