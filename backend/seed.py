import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random
from datetime import datetime

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.pricesync_db
products_collection = db.products

async def seed_enterprise_catalog():
    await products_collection.delete_many({})
    print("--- [CLEAN] PriceSync Registry Reset ---")

    review_pool = [
        {"user": "Rahul K.", "comment": "Amazing quality, better than expected!"},
        {"user": "Sneha M.", "comment": "My kid loves this, highly recommended."},
        {"user": "Arjun S.", "comment": "Great value for money and super fast sync."},
        {"user": "Priya V.", "comment": "Top notch build quality. Very impressed."},
        {"user": "Vikram D.", "comment": "Best tech purchase this year!"},
        {"user": "Ananya R.", "comment": "Colors are vibrant and it works perfectly."},
        {"user": "Karan T.", "comment": "Sync is very accurate, got a great deal."},
        {"user": "Megha J.", "comment": "Solid performance and very durable."}
    ]

    # amazon_price = REAL Amazon.in price (verified)
    # our price is auto-set to amazon_price - 1000
    catalog_templates = [
        # ── Kids Tech ─────────────────────────────────────────────────────────
        {
            "name": "VTech Kidizoom Smartwatch DX3", "category": "Kids Tech",
            "amazon_price": 5499,
            "img": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
            "variants": ["Blue", "Purple", "Pink"],
            "specs": {"Display": "1.4\" Touch Screen", "Camera": "2MP Front + Rear", "Battery": "370 mAh Li-Ion", "Water Resistance": "IPX5 Splashproof", "Games": "55 Built-in Activities", "Connectivity": "USB Charging", "Age Group": "5–12 Years", "Weight": "48g"}
        },
        {
            "name": "DJI Tello Mini Drone", "category": "Kids Tech",
            "amazon_price": 9999,
            "img": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
            "variants": ["Standard", "Boost Combo"],
            "specs": {"Max Flight Time": "13 min", "Max Speed": "28.8 km/h", "Camera": "5MP HD 720p", "Video Stabilisation": "Electronic EIS", "Range": "100m", "Weight": "80g", "Propellers": "4 × 3-inch", "SDK": "Scratch & Python Compatible"}
        },
        {
            "name": "Fisher-Price Code-a-pillar", "category": "Kids Tech",
            "amazon_price": 4500,
            "img": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            "variants": ["Master Edition"],
            "specs": {"Segments": "8 Command Segments", "Connectivity": "Motor-Driven Links", "Battery": "4 × AA", "Age Group": "3–6 Years", "Skills": "Sequencing & Coding Logic", "Material": "BPA-Free Plastic", "Sound": "Built-in Sounds & Lights", "Weight": "600g"}
        },
        # ── Gaming ────────────────────────────────────────────────────────────
        {
            "name": "Nintendo Switch OLED Edition", "category": "Gaming",
            "amazon_price": 29999,
            "img": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800",
            "variants": ["Neon Red/Blue", "White Edition"],
            "specs": {"Display": "7\" OLED 1280×720", "Processor": "NVIDIA Custom Tegra", "RAM": "4 GB", "Storage": "64 GB + microSD", "Battery": "4310 mAh (4.5–9 hrs)", "Connectivity": "Wi-Fi 5, BT 4.1, USB-C", "Docked Resolution": "1080p @ 60fps", "Weight": "320g"}
        },
        {
            "name": "LEGO Technic Lamborghini Sian", "category": "Gaming",
            "amazon_price": 34999,
            "img": "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800",
            "variants": ["Lime Green"],
            "specs": {"Pieces": "3696 Parts", "Scale": "1:8", "Features": "V12 Engine, Gearbox, Suspension", "Dimensions": "62 × 25 × 15 cm", "Age Group": "18+", "Material": "ABS Plastic", "Set Number": "42115", "Edition": "Limited Collectible"}
        },
        {
            "name": "PlayStation 5 Console", "category": "Gaming",
            "amazon_price": 54990,
            "img": "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800",
            "variants": ["Disk Edition", "Digital"],
            "specs": {"Processor": "AMD Zen 2 8-core @ 3.5GHz", "GPU": "10.28 TFLOPS RDNA 2", "RAM": "16 GB GDDR6", "Storage": "825 GB Custom NVMe SSD", "Max Resolution": "8K", "Max Frame Rate": "120fps", "Optical Drive": "4K UHD Blu-ray (Disk Ed.)", "Connectivity": "HDMI 2.1, USB-A, USB-C, Wi-Fi 6, BT 5.1"}
        },
        # ── Premium Tech ──────────────────────────────────────────────────────
        {
            "name": "iPhone 16 Pro Max", "category": "Premium Tech",
            "amazon_price": 144900,
            "img": "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800",
            "variants": ["Natural Titanium", "Desert Titanium"],
            "specs": {"Display": "6.9\" Super Retina XDR OLED 460ppi 120Hz", "Processor": "Apple A18 Pro (3nm)", "RAM": "8 GB", "Storage": "256 GB / 512 GB / 1 TB", "Rear Camera": "48MP Main + 48MP UW + 12MP 5× Telephoto", "Front Camera": "12MP TrueDepth", "Battery": "4685 mAh — Up to 33 hrs video", "Extras": "5G, Titanium Frame, USB-C 3.0, Face ID"}
        },
        {
            "name": "iPad Air M2", "category": "Premium Tech",
            "amazon_price": 59900,
            "img": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
            "variants": ["Starlight", "Space Grey"],
            "specs": {"Display": "11\" / 13\" Liquid Retina 264ppi", "Processor": "Apple M2 Chip", "RAM": "8 GB Unified", "Storage": "128 GB / 256 GB / 512 GB / 1 TB", "Rear Camera": "12MP Wide f/1.8", "Front Camera": "12MP Ultra-Wide Centre Stage", "Battery": "Up to 10 hrs", "Connectivity": "Wi-Fi 6E, USB-C, Apple Pencil Pro"}
        },
        {
            "name": "Sony WH-1000XM5", "category": "Premium Tech",
            "amazon_price": 24990,
            "img": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
            "variants": ["Black", "Silver"],
            "specs": {"Driver Size": "30mm Carbon Fibre", "ANC": "8 Mics Dual-Chip Processor", "Frequency Response": "4 Hz – 40 kHz", "Battery Life": "30 hrs (ANC On) | 40 hrs (Off)", "Quick Charge": "3 min = 3 hrs playback", "Connectivity": "Bluetooth 5.2, USB-C, 3.5mm", "Weight": "250g", "Codecs": "SBC, AAC, LDAC"}
        },
        # ── Outdoor ───────────────────────────────────────────────────────────
        {
            "name": "Hydro Flask Kids Bottle", "category": "Outdoor",
            "amazon_price": 2499,
            "img": "https://images.unsplash.com/photo-1602143302326-19220c2a742b?w=800",
            "variants": ["Pacific", "Watermelon"],
            "specs": {"Capacity": "354 ml (12 oz)", "Insulation": "TempShield™ Double Wall", "Cold Retention": "24 hrs", "Hot Retention": "12 hrs", "Material": "18/8 Pro-grade Stainless Steel", "Lid": "Straw Lid BPA-Free", "Dishwasher Safe": "Yes", "Weight": "227g"}
        },
        {
            "name": "Micro Mini Deluxe Scooter", "category": "Outdoor",
            "amazon_price": 8900,
            "img": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
            "variants": ["Aqua", "Red"],
            "specs": {"Max Rider Weight": "20 kg", "Deck Width": "118 mm", "Wheels": "120mm Front, 80mm Rear", "Handlebar": "46–57 cm Adjustable", "Frame": "Aircraft-Grade Aluminium", "Brake": "Rear Foot Brake", "Age Group": "2–5 Years", "Weight": "1.8 kg"}
        },
        {
            "name": "Nerf Super Soaker Hydra", "category": "Outdoor",
            "amazon_price": 1999,
            "img": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            "variants": ["Blue/Orange"],
            "specs": {"Tank Capacity": "1.1 L", "Range": "Up to 9 m", "Streams": "5 Simultaneous", "Pump": "Pull-back Trigger", "Material": "BPA-Free Plastic", "Age Group": "6+ Years", "Refill": "Top-Fill Cap", "Weight": "450g (empty)"}
        },
        # ── Mobile Phones ─────────────────────────────────────────────────────
        {
            "name": "iPhone 15 Pro Max", "category": "Mobile Phones",
            "amazon_price": 114900,
            "img": "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800",
            "variants": ["Black Titanium", "White Titanium", "Blue Titanium"],
            "specs": {"Display": "6.7\" OLED ProMotion 460ppi 120Hz", "Processor": "Apple A17 Pro (3nm)", "RAM": "8 GB", "Storage": "256 GB / 512 GB / 1 TB", "Rear Camera": "48MP Main + 12MP UW + 12MP 5× Telephoto", "Front Camera": "12MP TrueDepth", "Battery": "4422 mAh — 29 hrs video", "Extras": "5G, Titanium Frame, USB-C 3.0, Face ID, IP68"}
        },
        {
            "name": "Samsung Galaxy S24 Ultra", "category": "Mobile Phones",
            "amazon_price": 109999,
            "img": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
            "variants": ["Titanium Black", "Titanium Gray", "Titanium Violet"],
            "specs": {"Display": "6.8\" QHD+ Dynamic AMOLED 2X 120Hz 2600 nits", "Processor": "Snapdragon 8 Gen 3 (4nm)", "RAM": "12 GB LPDDR5X", "Storage": "256 GB / 512 GB / 1 TB UFS 4.0", "Rear Camera": "200MP Main + 12MP UW + 50MP 5× + 10MP 3×", "Front Camera": "12MP", "Battery": "5000 mAh — 45W Wired | 15W Wireless", "Extras": "S-Pen Built-in, IP68, Titanium Frame"}
        },
        {
            "name": "OnePlus 12", "category": "Mobile Phones",
            "amazon_price": 54999,
            "img": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",
            "variants": ["Silky Black", "Flowy Emerald"],
            "specs": {"Display": "6.82\" QHD+ AMOLED LTPO 120Hz 4500 nits", "Processor": "Snapdragon 8 Gen 3 (4nm)", "RAM": "12 GB / 16 GB LPDDR5X", "Storage": "256 GB / 512 GB UFS 4.0", "Rear Camera": "50MP Sony LYT-808 + 48MP UW + 64MP 3× Periscope", "Front Camera": "32MP", "Battery": "5400 mAh — 100W SUPERVOOC | 50W AirVOOC", "Extras": "IP65, Hasselblad Tuning, Ceramic Back"}
        },
        {
            "name": "Google Pixel 8 Pro", "category": "Mobile Phones",
            "amazon_price": 74999,
            "img": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
            "variants": ["Obsidian", "Porcelain", "Bay"],
            "specs": {"Display": "6.7\" LTPO OLED QHD+ 120Hz 2400 nits", "Processor": "Google Tensor G3 (4nm)", "RAM": "12 GB LPDDR5", "Storage": "128 GB / 256 GB / 512 GB / 1 TB", "Rear Camera": "50MP Main + 48MP UW + 48MP 5× Telephoto", "Front Camera": "10.5MP", "Battery": "5050 mAh — 30W Wired | 23W Wireless", "Extras": "IP68, Temp Sensor, 7 Years OS Updates, Google AI"}
        },
        {
            "name": "Vivo X100 Pro", "category": "Mobile Phones",
            "amazon_price": 55999,
            "img": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
            "variants": ["Asteroid Black", "Tide White"],
            "specs": {"Display": "6.78\" AMOLED LTPO 120Hz QHD+ 3000 nits", "Processor": "MediaTek Dimensity 9300 (4nm)", "RAM": "16 GB LPDDR5T", "Storage": "512 GB UFS 4.0", "Rear Camera": "50MP Sony LYT-900 + 50MP UW + 50MP 4.3× ZEISS", "Front Camera": "32MP", "Battery": "5400 mAh — 100W FlashCharge | 50W Wireless", "Extras": "IP68, ZEISS Optics, Ceramic Back"}
        },
        {
            "name": "Realme GT 6", "category": "Mobile Phones",
            "amazon_price": 34999,
            "img": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
            "variants": ["Fluid Silver", "Razor Green"],
            "specs": {"Display": "6.78\" AMOLED FHD+ 120Hz 4000 nits", "Processor": "Snapdragon 8s Gen 3 (4nm)", "RAM": "8 GB / 12 GB LPDDR5X", "Storage": "256 GB UFS 3.1", "Rear Camera": "50MP Sony LYT-808 + 8MP UW + 2MP Macro", "Front Camera": "32MP", "Battery": "5500 mAh — 120W SuperVOOC", "Extras": "IP65, AI Camera Features"}
        },
        {
            "name": "Motorola Edge 50 Pro", "category": "Mobile Phones",
            "amazon_price": 25499,
            "img": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
            "variants": ["Black Beauty", "Vanilla Cream", "Luxe Lavender"],
            "specs": {"Display": "6.67\" pOLED FHD+ 144Hz 1600 nits", "Processor": "Snapdragon 7 Gen 3 (4nm)", "RAM": "12 GB LPDDR4X", "Storage": "256 GB UFS 2.2", "Rear Camera": "50MP OIS + 10MP Telephoto + 13MP UW", "Front Camera": "50MP OIS", "Battery": "4500 mAh — 125W TurboPower | 50W Wireless", "Extras": "IP68, Vegan Leather / Alcantara Back, Stereo Speakers"}
        },
        {
            "name": "Nothing Phone 2a", "category": "Mobile Phones",
            "amazon_price": 19999,
            "img": "https://images.unsplash.com/photo-1622629797619-c100e3e67e2e?w=800",
            "variants": ["Black", "White", "Blue"],
            "specs": {"Display": "6.7\" AMOLED FHD+ 120Hz 1300 nits", "Processor": "MediaTek Dimensity 7200 Pro (4nm)", "RAM": "8 GB / 12 GB LPDDR5", "Storage": "128 GB / 256 GB UFS 2.2", "Rear Camera": "50MP OIS + 50MP Ultra-Wide", "Front Camera": "32MP", "Battery": "5000 mAh — 45W Fast Charge", "Extras": "Glyph Interface LEDs, Transparent Back, 2 Years OS"}
        },
        {
            "name": "Redmi Note 13 Pro Plus", "category": "Mobile Phones",
            "amazon_price": 28999,
            "img": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800",
            "variants": ["Midnight Black", "Aurora Purple", "Fusion White"],
            "specs": {"Display": "6.67\" AMOLED FHD+ 120Hz 2600 nits Curved", "Processor": "MediaTek Dimensity 7200 Ultra (4nm)", "RAM": "8 GB / 12 GB LPDDR5", "Storage": "256 GB UFS 2.2", "Rear Camera": "200MP OIS + 8MP UW + 2MP Macro", "Front Camera": "16MP", "Battery": "5000 mAh — 120W HyperCharge", "Extras": "IP68, Corning Gorilla Glass Victus"}
        },
        {
            "name": "POCO X6 Pro 5G", "category": "Mobile Phones",
            "amazon_price": 22999,
            "img": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800",
            "variants": ["Black", "Yellow", "Grey"],
            "specs": {"Display": "6.67\" AMOLED FHD+ 120Hz 2400 nits", "Processor": "MediaTek Dimensity 8300 Ultra (4nm)", "RAM": "8 GB / 12 GB LPDDR5X", "Storage": "256 GB UFS 4.0", "Rear Camera": "64MP OIS + 8MP UW + 2MP Macro", "Front Camera": "16MP", "Battery": "5000 mAh — 67W Turbo Charge", "Extras": "IP54, Gorilla Glass 5, 240Hz Touch Sampling"}
        },
    ]

    bulk_data = []
    for template in catalog_templates:
        for i in range(15):
            variant = random.choice(template["variants"])
            amz = template["amazon_price"]
            # Small jitter ±2% on amazon price per variant
            amz_jittered = round(amz * random.uniform(0.98, 1.02) / 100) * 100
            # Our price = ₹1000 below Amazon + tiny ±₹50 shimmer
            our_price = max(100, amz_jittered - 1000 + random.randint(-50, 50))
            stock_count = random.choice([0, 4, 12, 50, 100])

            num_reviews = random.randint(3, 5)
            product_reviews = []
            selected_users = random.sample(review_pool, num_reviews)
            for rev in selected_users:
                product_reviews.append({
                    "user": rev["user"],
                    "comment": rev["comment"],
                    "rating": random.randint(4, 5)
                })

            bulk_data.append({
                "name": f"{template['name']} - {variant} #{random.randint(100, 999)}",
                "category": template["category"],
                "price": our_price,
                "current_price": our_price,
                "amazon_price": amz_jittered,
                "stock": stock_count,
                "reviews": product_reviews,
                "specs": template.get("specs", {}),
                "description": f"Premium {template['category']} product — {variant} edition. ₹{1000} less than Amazon!",
                "cost_price": round(amz * 0.65),
                "image_url": template["img"],
                "auto_pricing": True,
                "created_at": datetime.now(),
                "last_rpa_sync": datetime.now() if random.random() > 0.4 else None
            })

    random.shuffle(bulk_data)
    if bulk_data:
        await products_collection.insert_many(bulk_data)
        print(f"--- [SUCCESS] Seeded {len(bulk_data)} products at REAL Amazon prices − ₹1,000 ---")

    await db.users.delete_many({"username": "admin"})
    await db.users.insert_one({
        "username": "admin", "password": "admin123", "role": "admin",
        "full_name": "System Administrator", "email": "admin@pricesync.enterprise"
    })
    print("--- [SUCCESS] Admin ready (admin / admin123) ---")

if __name__ == "__main__":
    asyncio.run(seed_enterprise_catalog())