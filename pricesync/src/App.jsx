import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart, Home, Search, Zap, ArrowRight, ChevronRight,
  TrendingDown, RefreshCcw, Package, ShieldCheck, Trash2, LogOut,
  Activity, Smartphone, Laptop, Tv, ArrowLeft, CreditCard, Truck,
  CheckCircle2, DollarSign, BarChart3, History, AlertCircle, Cpu,
  Lock, User, ShieldAlert, LogIn, TrendingUp, Filter, Eye, Tag,
  Info, Award, RotateCcw, UserPlus, Minus, Plus, Target, Database,
  Dumbbell, Star, Heart, Rocket, Gift, BookOpen, Gamepad2
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const generateAnalyticsData = () => {
  const revenueHistory = Array.from({ length: 30 }, (_, i) => ({
    day: `Day -${29 - i}`,
    yield: 50000 + Math.floor(i * 1500 + Math.random() * 5000),
    target: 45000 + Math.floor(i * 1200)
  }));

  const winRateData = [
    { name: 'Successful SKU Holding', value: 87, fill: '#6366f1' },
    { name: 'Competitive Variance', value: 13, fill: '#1e293b' }
  ];

  const marginData = [
    { category: 'Smartphones', target: 25, actual: 28 },
    { category: 'Laptops', target: 15, actual: 18 },
    { category: 'Audio', target: 35, actual: 32 },
    { category: 'Cameras', target: 20, actual: 24 }
  ];

  return { revenueHistory, winRateData, marginData };
};

const analyticsMetrics = generateAnalyticsData();


// --- UI Components ---
const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-slate-800 text-slate-400 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Dataset ---
const REAL_WORLD_PRODUCTS = [
  { id: 101, name: "RTX 4090 - Midnight Stealth", category: "Gaming", cost: 150000, price: 189000, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
  { id: 102, name: "Apple Watch Ultra - Elite Edition", category: "Wearables", cost: 72000, price: 89900, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400" },
  { id: 103, name: "Sony A7S III - Studio Pro", category: "Electronics", cost: 280000, price: 345000, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
  { id: 104, name: "Samsung Bespoke - Platinum Edition", category: "Home Appliances", cost: 180000, price: 245000, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { id: 105, name: "Peloton Guide - Performance Pro", category: "Fitness", cost: 45000, price: 62000, img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400" },
  // Mobile Phones
  { id: 201, name: "iPhone 15 Pro Max - Black Titanium", category: "Mobile Phones", cost: 110000, price: 159900, img: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400" },
  { id: 202, name: "Samsung Galaxy S24 Ultra - Titanium Black", category: "Mobile Phones", cost: 90000, price: 134999, img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400" },
  { id: 203, name: "OnePlus 12 - Silky Black", category: "Mobile Phones", cost: 45000, price: 64999, img: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400" },
  { id: 204, name: "Google Pixel 8 Pro - Obsidian", category: "Mobile Phones", cost: 75000, price: 106999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400" },
  { id: 205, name: "Vivo X100 Pro - Asteroid Black", category: "Mobile Phones", cost: 62000, price: 89999, img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400" },
  { id: 206, name: "Realme GT 6 - Fluid Silver", category: "Mobile Phones", cost: 22000, price: 34999, img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400" },
  { id: 207, name: "Motorola Edge 50 Pro - Black Beauty", category: "Mobile Phones", cost: 21000, price: 31999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
  { id: 208, name: "Nothing Phone 2a - White", category: "Mobile Phones", cost: 13000, price: 19999, img: "https://images.unsplash.com/photo-1622629797619-c100e3e67e2e?w=400" },
  { id: 209, name: "Redmi Note 13 Pro Plus - Aurora Purple", category: "Mobile Phones", cost: 19000, price: 29999, img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400" },
  { id: 210, name: "POCO X6 Pro 5G - Yellow", category: "Mobile Phones", cost: 14000, price: 22999, img: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400" },
];

const generateFullDataset = () => {
  const dataset = [];
  const days = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];

  REAL_WORLD_PRODUCTS.forEach((p, i) => {
    const history = days.map((day, idx) => ({
      day,
      priceSync: idx === 6 ? p.price : Math.round(p.price * (1 + (Math.random() * 0.1 - 0.05))),
      amazon: Math.round(p.price * 1.03 * (1 + (Math.random() * 0.04 - 0.02))),
      flipkart: Math.round(p.price * 1.02 * (1 + (Math.random() * 0.04 - 0.02)))
    }));

    dataset.push({
      id: i + 1, ...p, cost_price: p.cost, current_price: p.price,
      amazon_price: Math.round(p.price * 1.03), flipkart_price: Math.round(p.price * 1.02),
      min_margin: 25.0, history
    });
  });

  for (let i = 0; i < 496; i++) {
    const base = REAL_WORLD_PRODUCTS[i % REAL_WORLD_PRODUCTS.length];
    const id = dataset.length + 1;
    const history = days.map((day, idx) => ({
      day,
      priceSync: idx === 6 ? base.price : Math.round(base.price * (1 + (Math.random() * 0.1 - 0.05))),
      amazon: Math.round(base.price * 1.03 * (1 + (Math.random() * 0.04 - 0.02))),
      flipkart: Math.round(base.price * 1.02 * (1 + (Math.random() * 0.04 - 0.02)))
    }));

    dataset.push({
      id, name: `${base.name.split(' ')[0]} ${base.category.slice(0, -1)} Pro-${id}`,
      category: base.category, description: base.desc, cost_price: base.cost, current_price: base.price,
      amazon_price: Math.round(base.price * 1.03), flipkart_price: Math.round(base.price * 1.02),
      image_url: base.img, min_margin: 25.0, specs: base.specs, emi: base.emi, history
    });
  }
  return dataset;
};


// --- Extracted Sub-Views to Prevent Rewriting ---


const CategoryDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    { id: 'all', label: 'All Products', icon: Gift },
    { id: 'Mobile Phones', label: 'Mobile Phones', icon: Smartphone },
    { id: 'Kids Tech', label: 'Kids Tech', icon: Gamepad2 },
    { id: 'Gaming', label: 'Gaming', icon: Star },
    { id: 'Premium Tech', label: 'Premium Tech', icon: Zap },
    { id: 'Outdoor', label: 'Outdoor', icon: Rocket },
  ];

  const activeLabel = categories.find(c => c.id === selected)?.label || 'Filter Market';

  return (
    <div className="relative group min-w-[280px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-sky-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-sky-700 hover:border-sky-400 hover:bg-sky-50 transition-all shadow-lg shadow-sky-100"
      >
        <span className="flex items-center gap-3">
          <Filter size={14} className="text-sky-400" />
          {activeLabel}
        </span>
        <ChevronRight size={16} className={`text-sky-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white border-2 border-sky-100 rounded-[1.5rem] overflow-hidden shadow-2xl shadow-sky-100 z-50">
          <div className="p-2 space-y-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => { onSelect(c.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selected === c.id ? 'bg-sky-500 text-white' : 'text-sky-600 hover:bg-sky-50 hover:text-sky-700'}`}
              >
                <c.icon size={14} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HomeView = ({ products, searchQuery, setSelectedProduct, setActiveTab, selectedCategory, setSelectedCategory, setSearchQuery }) => {
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cardColors = [
    'from-sky-50 to-blue-100 border-sky-200',
    'from-pink-50 to-rose-100 border-pink-200',
    'from-amber-50 to-yellow-100 border-amber-200',
    'from-violet-50 to-purple-100 border-violet-200',
    'from-emerald-50 to-green-100 border-emerald-200',
  ];

  const getStockBadge = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', cls: 'bg-rose-500 text-white' };
    if (stock <= 5) return { label: `Low Stock — ${stock} left`, cls: 'bg-amber-400 text-white' };
    return { label: 'In Stock', cls: 'bg-emerald-500 text-white' };
  };

  return (
    <div className="space-y-8">
      {/* Hero + Search Bar */}
      <div className="hero-gradient rounded-2xl p-6 space-y-5">
        <div className="flex flex-col xl:flex-row items-center gap-4 justify-between">
          <div className="hidden xl:block">
            <h2 className="text-2xl font-black tracking-tight"><span className="gradient-text">Smart Pricing.</span> <span className="text-slate-700">Real Savings.</span></h2>
            <p className="text-slate-500 text-xs font-medium mt-1">AI-powered competitive pricing across {filtered.length} products</p>
          </div>
          <div className="relative w-full xl:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products, categories, brands..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CategoryDropdown selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        {/* Stats Strip */}
        <div className="flex flex-wrap gap-3">
          <span className="stat-pill bg-sky-100 text-sky-700"><Activity size={11} /> {filtered.length} Products</span>
          <span className="stat-pill bg-emerald-100 text-emerald-700"><TrendingDown size={11} /> Beating Amazon</span>
          <span className="stat-pill bg-indigo-100 text-indigo-700"><Zap size={11} /> Live Prices</span>
          <span className="stat-pill bg-violet-100 text-violet-700"><ShieldCheck size={11} /> Verified Stock</span>
        </div>
      </div>

      {/* Premium Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.slice(0, 150).map((p, i) => {
          const stock = p.stock ?? p.inventory_count ?? 99;
          const oos = stock === 0;
          const badge = getStockBadge(stock);
          const savings = p.amazon_price > p.current_price ? p.amazon_price - p.current_price : 0;
          return (
            <div
              key={p._id || i}
              className={`product-card group flex flex-col ${oos ? 'opacity-60' : ''} cursor-pointer`}
              onClick={() => { setSelectedProduct(p); setActiveTab('details'); }}
            >
              {/* Image area */}
              <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-50 to-slate-100 h-48 flex items-center justify-center">
                <img
                  src={p.image_url || p.img}
                  alt={p.name}
                  className={`h-36 w-auto max-w-[80%] object-contain drop-shadow-lg transition-transform duration-500 ${!oos && 'group-hover:scale-110'}`}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'; }}
                />
                {/* Badges row */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm ${badge.cls}`}>
                    {badge.label}
                  </span>
                  {savings > 0 && (
                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Save ₹{savings.toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Category pill */}
                <span className="absolute top-3 right-3 bg-white/90 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                  {p.category}
                </span>
                {/* Live sync indicator */}
                {p.last_rpa_sync && !oos && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <span className="text-[8px] font-bold">LIVE</span>
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={9} className="text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[9px] text-slate-400 font-semibold ml-1">5.0</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{p.name}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{p.description || `Premium ${p.category} product — AI-optimised pricing.`}</p>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Best Price</p>
                    <h3 className={`text-xl font-black tabular-nums ${oos ? 'text-slate-400' : 'price-badge'}`}>₹{p.current_price?.toLocaleString()}</h3>
                    <p className="text-[9px] text-slate-400 line-through">₹{p.amazon_price?.toLocaleString()}</p>
                  </div>
                  {oos ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 text-rose-500 px-3 py-1.5 rounded-xl border border-rose-200">
                      <AlertCircle size={12} />
                      <span className="text-[9px] font-bold uppercase">Sold Out</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-4 py-2 rounded-xl group-hover:from-sky-600 group-hover:to-indigo-600 transition-all shadow-md shadow-indigo-200 shine-on-hover">
                      <span className="text-[10px] font-bold uppercase tracking-wide">View</span>
                      <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const AuthPortal = ({ authView, setAuthView, authRole, setAuthRole, handleAuth, authError, setActiveTab }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center mb-10 text-center">
        <Activity className="text-indigo-500 mb-4" size={48} />
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
          {authView === 'login' ? 'Login' : 'Create Account'}
        </h1>
      </div>

      <div className="flex bg-slate-950 p-1 rounded-2xl mb-8 border border-slate-800">
        <button onClick={() => setAuthRole('user')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authRole === 'user' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>User</button>
        <button onClick={() => setAuthRole('admin')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authRole === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Admin</button>
      </div>

      <form className="space-y-6" onSubmit={handleAuth}>
        <input name="username" type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" placeholder="Username / ID" />

        {authView === 'signup' && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <input name="full_name" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" placeholder="Full Professional Name" />
            <input name="email" type="email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" placeholder="Corporate Email Address" />
            <input name="organization" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" placeholder="Organization / Entity" />
          </div>
        )}

        <input name="password" type="password" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" placeholder="Access Key" />
        {authError && <p className="text-rose-500 text-[10px] font-bold uppercase text-center">{authError}</p>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
          {authView === 'login' ? 'Authorize Access' : 'Register Identity'}
        </button>
      </form>


      <button onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')} className="w-full mt-6 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400">
        {authView === 'login' ? 'New here? Enroll Now' : 'Have access? Login Here'}
      </button>

      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col gap-4 items-center">
        <button
          onClick={() => {
            // Mock a login event for bypass
            handleAuth({
              preventDefault: () => { }, target: {
                username: { value: 'admin' },
                password: { value: 'admin123' },
                role: { value: 'admin' },
                get: (name) => name === 'username' ? 'admin' : (name === 'password' ? 'admin123' : 'admin')
              }
            });
          }}
          className="w-full bg-slate-800 border border-indigo-500/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-500/5 flex items-center justify-center gap-3"
        >
          <ShieldCheck size={14} /> Bypass Protocol
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </button>
      </div>
    </div>
  </div>
);

// --- Price Control Panel Component ---
const PriceControlPanel = ({ products, minMargin, setMinMargin, setProducts }) => {
  const [search, setSearch] = useState('');
  const [priceEdits, setPriceEdits] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [marginSaving, setMarginSaving] = useState(false);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 60);

  const handlePriceChange = (id, val) => {
    setPriceEdits(prev => ({ ...prev, [id]: val }));
  };

  const savePrice = async (product) => {
    const newPrice = parseFloat(priceEdits[product._id || product.id]);
    if (!newPrice || newPrice <= 0) return;
    const id = product._id;
    setStatusMap(prev => ({ ...prev, [id]: 'saving' }));
    try {
      if (id) {
        const res = await fetch(`http://localhost:8000/api/products/${id}/price`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_price: newPrice, reason: 'Admin Manual Override' })
        });
        if (!res.ok) throw new Error();
      }
      // Update React state immediately
      setProducts(prev => prev.map(p =>
        (p._id === id || p.id === product.id) ? { ...p, current_price: newPrice } : p
      ));
      setStatusMap(prev => ({ ...prev, [id]: 'success' }));
      setTimeout(() => setStatusMap(prev => ({ ...prev, [id]: null })), 2000);
    } catch {
      setStatusMap(prev => ({ ...prev, [id]: 'error' }));
      setTimeout(() => setStatusMap(prev => ({ ...prev, [id]: null })), 2000);
    }
  };

  const saveMargin = async () => {
    setMarginSaving(true);
    try {
      await fetch('http://localhost:8000/api/settings/margin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ margin: minMargin })
      });
    } catch { }
    setTimeout(() => setMarginSaving(false), 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Global Margin Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
          <TrendingUp size={12} /> Global Minimum Margin Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Min Profit Margin</p>
                <h3 className="text-6xl font-black text-emerald-400 tabular-nums">{minMargin}<span className="text-2xl text-emerald-600">%</span></h3>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Pricing Engine Effect</p>
                <p className="text-xs font-bold text-indigo-400">
                  {minMargin < 15 ? '⚡ Aggressive — Max Market Share' : minMargin < 25 ? '⚖ Balanced — Competitive Hold' : minMargin < 35 ? '🛡 Conservative — Margin Protected' : '💎 Premium — High Yield Mode'}
                </p>
              </div>
            </div>
            <input
              type="range" min={5} max={60} step={1}
              value={minMargin}
              onChange={e => setMinMargin(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #10b981 0%, #10b981 ${((minMargin - 5) / 55) * 100}%, #1e293b ${((minMargin - 5) / 55) * 100}%, #1e293b 100%)` }}
            />
            <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <span>5% Min</span><span>30% Balanced</span><span>60% Max</span>
            </div>
            <button
              onClick={saveMargin}
              className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${marginSaving ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'}`}
            >
              {marginSaving ? '✓ Margin Saved to Engine' : 'Apply Margin to Pricing Engine'}
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-8 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">How This Works</p>
            {[
              { label: 'Engine reads this margin', desc: 'Every 3s price cycle respects your floor', icon: '⚡' },
              { label: 'Cost × (1 + margin%)', desc: 'Minimum price = product cost + your %', icon: '📐' },
              { label: 'Beats Amazon anyway', desc: 'Final price = Min(amazon−₹100, floor)', icon: '🏆' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-800/40">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-black text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Product Price Override */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
            <Tag size={12} /> Per-Product Price Override
          </h4>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-[11px] text-white outline-none focus:border-indigo-500 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 uppercase text-[9px] font-black border-b border-slate-800/50 tracking-widest">
                <th className="pb-4 pr-4">Product</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Current Price</th>
                <th className="pb-4 px-4">Amazon Price</th>
                <th className="pb-4 px-4">New Price (₹)</th>
                <th className="pb-4 pl-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.map((p, i) => {
                const id = p._id || p.id;
                const status = statusMap[p._id];
                return (
                  <tr key={id || i} className="group hover:bg-slate-800/20 transition-all">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={p.image_url || p.img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                        </div>
                        <p className="text-xs font-bold text-white line-clamp-1 max-w-[200px]">{p.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-emerald-400 tabular-nums">₹{p.current_price?.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-slate-500 tabular-nums line-through">₹{p.amazon_price?.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        placeholder={p.current_price?.toFixed(0)}
                        value={priceEdits[id] || ''}
                        onChange={e => handlePriceChange(id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-[11px] font-black text-white outline-none focus:border-emerald-500 w-32 tabular-nums transition-all"
                      />
                    </td>
                    <td className="py-4 pl-4">
                      <button
                        onClick={() => savePrice(p)}
                        disabled={!priceEdits[id]}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all min-w-[90px] text-center ${status === 'success' ? 'bg-emerald-600 text-white' :
                          status === 'error' ? 'bg-rose-600 text-white' :
                            status === 'saving' ? 'bg-slate-700 text-slate-400' :
                              priceEdits[id] ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' :
                                'bg-slate-800 text-slate-600 cursor-not-allowed'
                          }`}
                      >
                        {status === 'success' ? '✓ Saved' : status === 'error' ? '✗ Failed' : status === 'saving' ? 'Saving…' : 'Apply'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-600 py-10 uppercase font-black text-xs tracking-widest">No products match search.</p>
          )}
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-6 text-center">
            Showing {filtered.length} of {products.length} products — Changes sync to MongoDB instantly
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [products, setProducts] = useState(() => generateFullDataset());
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [engineActive, setEngineActive] = useState(true);
  const [minMargin, setMinMargin] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Live Product Fetch from MongoDB (Real-Time Sync) ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0) {
          // Attach history for chart rendering since MongoDB doesn't store it
          const days = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
          const enriched = data.map(p => ({
            ...p,
            current_price: p.current_price || p.price || 0,
            amazon_price: p.amazon_price || 0,
            flipkart_price: p.flipkart_price || 0,
            img: p.image_url,
            history: days.map((day, idx) => ({
              day,
              priceSync: idx === 6 ? (p.current_price || p.price) : Math.round((p.current_price || p.price) * (1 + (Math.random() * 0.06 - 0.03))),
              amazon: Math.round((p.amazon_price || 0) * (1 + (Math.random() * 0.04 - 0.02))),
              flipkart: Math.round((p.flipkart_price || 0) * (1 + (Math.random() * 0.04 - 0.02)))
            }))
          }));
          setProducts(enriched);
          setLastUpdate(new Date());
        }
      } catch (e) {
        // Backend offline — keep showing local data silently
      }
    };

    fetchProducts(); // Immediate fetch on load
    const interval = setInterval(fetchProducts, 4000); // Refresh every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Professional Auth State
  const [authStatus, setAuthStatus] = useState('unauthenticated');
  const [userData, setUserData] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [authRole, setAuthRole] = useState('user'); // 'user' or 'admin'
  const [authError, setAuthError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [adminSubView, setAdminSubView] = useState('analytics'); // 'analytics' or 'logs'
  const [customerName, setCustomerName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isOnline, setIsOnline] = useState(true);

  // Backend health check — detect if Python backend is offline
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await fetch('http://localhost:8000/api/products', { method: 'GET', signal: AbortSignal.timeout(3000) });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    checkHealth();
    const healthInterval = setInterval(checkHealth, 10000);
    return () => clearInterval(healthInterval);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(i => i.qty > 0));
  };

  // Fiscal Yield Calculations
  const subtotal = useMemo(() => cart.reduce((s, i) => s + (i.current_price * i.qty), 0), [cart]);
  const deliveryFee = subtotal > 0 ? 500 : 0;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'PRICESYNC10') {
      setDiscount(Math.floor(subtotal * 0.1));
    } else {
      setDiscount(0);
      if (couponCode) alert("Invalid Security Protocol: Coupon Code unrecognized.");
    }
  };

  const tax = useMemo(() => Math.floor((subtotal - discount) * 0.18), [subtotal, discount]);
  const totalYield = (subtotal - discount) + tax + deliveryFee;


  // Engine Simulation
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setProducts(prev => {
        const batch = [...prev];
        if (batch.length === 0) return prev;

        // Update exactly 2-3 random products per cycle (Dynamic Jitter)
        const updateCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const cycleLogs = [];
        for (let i = 0; i < updateCount; i++) {
          const idx = Math.floor(Math.random() * batch.length);
          const p = batch[idx];
          const newAmz = Math.round(p.amazon_price * (1 + (Math.random() * 0.04 - 0.02)));
          const final = Math.max(newAmz - 150, p.cost_price * (1 + (minMargin / 100)));

          // Update history's "Today" value (Index 6)
          const newHistory = [...p.history];
          newHistory[6] = { ...newHistory[6], priceSync: final, amazon: newAmz };

          batch[idx] = { ...p, amazon_price: newAmz, current_price: final, history: newHistory };
          cycleLogs.push({ name: p.name, new_price: final, updated_at: new Date().toISOString() });

          // If this is the selected product, update the chart state dynamically
          if (selectedProduct && selectedProduct.id === p.id) {
            setSelectedProduct(batch[idx]);
          }
        }

        setLogs(l => [...cycleLogs, ...l].slice(0, 100));
        setLastUpdate(new Date());
        return batch;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [engineActive, minMargin]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const u = data.get('username');
    const p = data.get('password');
    const fullName = data.get('full_name');
    const email = data.get('email');
    const org = data.get('organization');
    const endpoint = authView === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const payload = {
        username: u,
        password: p,
        role: authRole,
        ...(authView === 'signup' && { full_name: fullName, email: email, organization: org })
      };

      const resp = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await resp.json();
      if (!resp.ok) throw new Error(res.detail || 'Authorization failed.');

      setUserData(res);
      setAuthStatus(res.role || 'user');
      if (res.role === 'admin') setActiveTab('admin');
      else setActiveTab('home');
      setAuthError('');
    } catch (err) {
      setAuthError(err.message);
    }
  };



  // --- View Rendering ---

  const isPublicTab = ['home', 'details'].includes(activeTab);

  if (authStatus === 'unauthenticated' && !isPublicTab) return (
    <AuthPortal
      authView={authView}
      setAuthView={setAuthView}
      authRole={authRole}
      setAuthRole={setAuthRole}
      handleAuth={handleAuth}
      authError={authError}
      setActiveTab={setActiveTab}
    />
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 text-gray-700 selection:bg-sky-200">
      {/* Floating background decorations — professional data theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <TrendingUp size={140} className="absolute top-8 right-8 text-sky-100 animate-float" />
        <BarChart3 size={100} className="absolute bottom-16 left-8 text-indigo-100 animate-spin-slow" />
        <DollarSign size={70} className="absolute top-1/2 left-1/5 text-emerald-100 animate-float" style={{ animationDelay: '2s' }} />
        <Activity size={50} className="absolute bottom-1/3 right-1/4 text-sky-100 animate-float" style={{ animationDelay: '1s' }} />
        <Zap size={80} className="absolute top-1/3 right-20 text-violet-100 animate-pulse" />
      </div>

      {/* Offline Warning Banner */}
      {!isOnline && (
        <div className="w-full bg-rose-500 text-white text-center py-2 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 z-[200] sticky top-0">
          <AlertCircle size={12} /> Backend Offline — Run `python main.py` to restore live sync
        </div>
      )}
      <nav className="relative z-10 bg-white/80 backdrop-blur-2xl border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between sticky top-0 navbar-glow">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow shine-on-hover">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none">
              <span className="gradient-text">PriceSync</span>
            </h1>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.25em] mt-0.5">AI Pricing Intelligence</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <div className="live-dot"></div>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Live Sync</span>
          </div>
          <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'home'
            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-indigo-200'
            : 'text-slate-500 hover:text-indigo-500 hover:bg-indigo-50'
            }`}>Shop</button>
          <button onClick={() => authStatus === 'admin' ? setActiveTab('admin') : setActiveTab('login')} className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'admin'
            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-indigo-200'
            : 'text-slate-500 hover:text-indigo-500 hover:bg-indigo-50'
            }`}>Admin</button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
          >
            <ShoppingCart size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-pink-500 to-rose-500 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full text-white shadow-md">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>
          {authStatus !== 'unauthenticated' && <button onClick={() => setAuthStatus('unauthenticated')} className="p-2.5 bg-rose-50 text-rose-400 rounded-xl border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"><LogOut size={18} /></button>}
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-12">
        {activeTab === 'home' && (
          <HomeView
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedProduct={setSelectedProduct}
            setActiveTab={setActiveTab}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeTab === 'details' && selectedProduct && (
          <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-12 duration-700 space-y-16">
            <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-indigo-400 transition-colors">
              <ArrowLeft size={16} /> Marketplace
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* QUADRANT 1: High-Res High-End Image */}
              <div className="image-container h-[600px] border-2 border-slate-800/40 shadow-2xl bg-slate-900/40">
                <img src={selectedProduct.image_url || selectedProduct.img} className="product-image" alt={selectedProduct.name} />
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <Badge variant="success">In Stock</Badge>
                  <Badge variant="info">Verified</Badge>
                  {selectedProduct.last_rpa_sync && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live Sync</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QUADRANT 2: Optimal Price Registry Box */}
              <div className="flex flex-col space-y-8 bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-800/60 shadow-2xl backdrop-blur-md">
                <div className="space-y-4">
                  <Badge variant="info">{selectedProduct.category}</Badge>
                  <h2 className="text-6xl font-black text-white tracking-tighter leading-tight">{selectedProduct.name}</h2>
                  <p className="text-slate-400 font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-800/80">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Best Market Price</p>
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-7xl font-black text-emerald-400 tabular-nums tracking-tighter">₹{selectedProduct.current_price.toLocaleString()}</h3>
                      <span className="text-slate-500 line-through text-xl font-bold opacity-30">₹{selectedProduct.amazon_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-500/5 px-4 py-3 rounded-xl border border-indigo-500/10">
                      <Tag size={12} /> {selectedProduct.emi} No-Cost EMI
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 px-4 py-3 rounded-xl border border-emerald-500/10">
                      <Award size={12} /> Flat ₹2,000 Bank Off
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="col-span-2 bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Algorithmic Insight</p>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">
                        {selectedProduct.inventory_count < 50 ? 'Profit Recovery (Low Stock)' : `Strategy: ${selectedProduct.category}`}
                      </h4>
                    </div>
                    <Target size={40} className="text-indigo-500/10 absolute right-[-10px] group-hover:scale-110 transition-transform" />
                    <Badge variant={selectedProduct.inventory_count < 50 ? 'danger' : 'success'}>Active</Badge>
                  </div>
                  <button onClick={() => addToCart(selectedProduct)} className="flex-1 bg-indigo-600 py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 group">
                    <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" /> Add to Cart
                  </button>
                  <button className="flex-1 bg-slate-800 border border-slate-700/50 py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all">Specs</button>
                </div>
              </div>

              {/* QUADRANT 3: Market Comparison Registry */}
              <div className="bg-slate-950 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-2xl flex flex-col">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
                  <Activity size={12} /> Live Channel Benchmarking
                </h4>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-center p-6 bg-slate-900/40 rounded-3xl border border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xs text-white">PS</div>
                      <span className="text-sm font-bold text-white tracking-wide">PriceSync Optimal</span>
                    </div>
                    <span className="text-lg font-black text-emerald-400">₹{selectedProduct.current_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-slate-900/20 rounded-3xl border border-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#ff9900]/20 rounded-xl flex items-center justify-center font-black text-[10px] text-[#ff9900]">AZ</div>
                      <span className="text-sm font-bold text-slate-400 tracking-wide">Amazon Prime</span>
                    </div>
                    <span className="text-lg font-black text-slate-500 line-through">₹{selectedProduct.amazon_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-slate-900/20 rounded-3xl border border-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#2874f0]/20 rounded-xl flex items-center justify-center font-black text-[10px] text-[#2874f0]">FK</div>
                      <span className="text-sm font-bold text-slate-400 tracking-wide">Flipkart Plus</span>
                    </div>
                    <span className="text-lg font-black text-slate-500 line-through">₹{selectedProduct.flipkart_price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Target Acquisition Savings: ₹{Math.max(0, selectedProduct.amazon_price - selectedProduct.current_price).toLocaleString()}</p>
                </div>
              </div>

              {/* QUADRANT 4: 7-Day Performance Trend Graph */}
              <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-slate-800 pb-4">7-Day Price History</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProduct.history}>
                      <defs>
                        <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="priceSync" stroke="#6366f1" fillOpacity={1} fill="url(#colorSync)" strokeWidth={3} name="PriceSync" animationDuration={400} />
                      <Line type="monotone" dataKey="amazon" stroke="#ff9900" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Amazon" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 mt-6 justify-center">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Registry</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ff9900]"></div><span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Market</span></div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
              <div className="bg-white border-2 border-sky-100 p-8 rounded-[2.5rem] shadow-xl">
                <h4 className="text-base font-black text-gray-700 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  Customer Reviews
                  <span className="bg-sky-100 text-sky-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {selectedProduct.reviews.length} reviews
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {selectedProduct.reviews.map((rev, ri) => (
                    <div key={ri} className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-700">{rev.user}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} size={10}
                              className={s < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications */}
            {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Cpu size={12} className="text-white" />
                  </div>
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x-0">
                  {Object.entries(selectedProduct.specs).map(([key, value], si) => (
                    <div
                      key={si}
                      className={`flex justify-between items-start gap-4 py-3 px-2 ${si % 2 === 0 ? 'sm:pr-6' : 'sm:pl-6'} border-b border-slate-100 last:border-b-0`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[110px] flex-shrink-0">{key}</span>
                      <span className="text-[11px] font-semibold text-slate-700 text-right leading-snug">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}


        {activeTab === 'admin' && authStatus === 'admin' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Admin Dashboard</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Market Intelligence & Logs</p>
              </div>
              <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
                <button
                  onClick={() => setAdminSubView('market_pulse')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adminSubView === 'market_pulse' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <Activity size={14} /> Market Pulse
                </button>
                <button
                  onClick={() => setAdminSubView('health')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adminSubView === 'health' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <Cpu size={14} /> System Health
                </button>
                <button
                  onClick={() => setAdminSubView('analytics')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adminSubView === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <BarChart3 size={14} /> Intelligence
                </button>
                <button
                  onClick={() => setAdminSubView('price_control')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adminSubView === 'price_control' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <Tag size={14} /> Price Control
                </button>
                <button
                  onClick={() => setAdminSubView('logs')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adminSubView === 'logs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <RotateCcw size={14} /> Audit Logs
                </button>
              </div>
            </div>

            {adminSubView === 'health' ? (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-800 pb-4">Engine Telemetry: Sync Heartbeat</h4>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsMetrics.revenueHistory.map((d, i) => ({ ...d, heartbeat: 60 + Math.sin(i) * 5 + Math.random() * 2 }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                          <Line type="monotone" dataKey="heartbeat" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={300} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">CPU Utilization</p>
                        <h4 className="text-4xl font-black text-white">12.4%</h4>
                      </div>
                      <Cpu size={48} className="text-indigo-400 opacity-20" />
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">DB Throughput</p>
                        <h4 className="text-4xl font-black text-white">1.2 GB/s</h4>
                      </div>
                      <Database size={48} className="text-emerald-400 opacity-20" />
                    </div>
                  </div>
                </div>
              </div>
            ) : adminSubView === 'market_pulse' ? (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-xl space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Velocity</p>
                    <h4 className="text-4xl font-black text-white">42 <span className="text-xs text-indigo-400">updates/min</span></h4>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-xl space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Lead Efficiency</p>
                    <h4 className="text-4xl font-black text-white">94.2%</h4>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[2.5rem] shadow-xl space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active SKU Dominance</p>
                    <h4 className="text-4xl font-black text-white">432 / 500</h4>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-800 pb-4">Market Pulse: Real-time Volatility</h4>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsMetrics.revenueHistory.map(d => ({ ...d, volatility: 20 + Math.random() * 60 }))}>
                          <defs>
                            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Area type="stepAfter" dataKey="volatility" stroke="#10b981" fill="url(#colorPulse)" strokeWidth={2} name="Market Volatility" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-800 pb-4">Competitor Gap Analysis</h4>
                    <div className="h-[300px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'PriceSync Lead', value: 87, fill: '#6366f1' },
                              { name: 'Amazon Gap', value: 8, fill: '#ff9900' },
                              { name: 'Flipkart Gap', value: 5, fill: '#2874f0' }
                            ]}
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                          >
                            {analyticsMetrics.winRateData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">Gap</span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Analytic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : adminSubView === 'analytics' ? (
              <div className="space-y-12">
                {/* Metric Intelligence Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Gross Yield', value: '₹4.8M', trend: '+12.4%', icon: DollarSign, color: 'text-indigo-400' },
                    { label: 'Avg System Margin', value: '28.4%', trend: '+2.1%', icon: Zap, color: 'text-emerald-400' },
                    { label: 'Market Win-Rate', value: '87.2%', trend: '+4.5%', icon: Target, color: 'text-indigo-400' },
                    { label: 'Competitive Latency', value: '140ms', trend: '-20ms', icon: Activity, color: 'text-emerald-400' }
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2rem] shadow-xl hover:border-slate-700 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${m.color}`}><m.icon size={20} /></div>
                        <span className={`text-[9px] font-black ${m.trend.startsWith('+') ? 'text-emerald-400' : 'text-indigo-400'} uppercase`}>{m.trend}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
                      <h4 className="text-3xl font-black text-white">{m.value}</h4>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Revenue Stream Trend */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 border-b border-slate-800 pb-4">Revenue Stream: 30-Day Cumulative Yield</h4>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsMetrics.revenueHistory}>
                          <defs>
                            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="day" stroke="#475569" fontSize={8} axisLine={false} tickLine={false} tick={{ fill: '#475569' }} hide={true} />
                          <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="yield" stroke="#6366f1" fillOpacity={1} fill="url(#colorYield)" strokeWidth={3} name="Total Yield" />
                          <Area type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="System Target" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Market Win-Rate Status */}
                  <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 w-full text-left">Competitive Nexus Rate</h4>
                    <div className="relative w-full h-[250px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsMetrics.winRateData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {analyticsMetrics.winRateData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-white">87%</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pricing Win Rate</span>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4 w-full">
                      <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Dominance</span>
                        <Badge variant="success">Dominant</Badge>
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">PriceSync successfully holds the target market floor for 432/500 monitored SKUs.</p>
                    </div>
                  </div>
                </div>

                {/* Margin Analysis Dashboard */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 shadow-xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 border-b border-slate-800 pb-4">Category Margin Variance Analysis</h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsMetrics.marginData} barGap={12}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="category" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          cursor={{ fill: '#1e293b', opacity: 0.3 }}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                        />
                        <Bar dataKey="target" fill="#1e293b" radius={[6, 6, 0, 0]} name="Target Protocol" />
                        <Bar dataKey="actual" fill="#10b981" radius={[6, 6, 0, 0]} name="Actual Realized" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 flex gap-8 justify-center">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-slate-800"></div><span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Target Threshold</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-emerald-500"></div><span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Realized Margin</span></div>
                  </div>
                </div>
              </div>
            ) : adminSubView === 'price_control' ? (
              <PriceControlPanel
                products={products}
                minMargin={minMargin}
                setMinMargin={setMinMargin}
                setProducts={setProducts}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
                  <RotateCcw size={12} /> Operational Manifest Logs
                </h4>
                <div className="overflow-x-auto custom-scrollbar pr-2">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 uppercase text-[10px] font-black border-b border-slate-800/50"><th className="pb-6">Product Name</th><th className="pb-6">Total Cost</th><th className="pb-6 text-right">Update Time</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {logs.map((l, i) => (
                        <tr key={i} className="hover:bg-slate-800/20 group transition-colors">
                          <td className="py-6 font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{l.name}</td>
                          <td className="py-6 font-black text-emerald-400 tabular-nums">₹{l.new_price.toLocaleString()}</td>
                          <td className="py-6 text-right text-slate-500 font-medium tabular-nums">{new Date(l.updated_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {logs.length === 0 && <tr><td colSpan="3" className="py-20 text-center text-slate-600 uppercase font-black text-xs tracking-[0.3em]">No operational logs recorded.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'checkout' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-8">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Your Cart</h2>
              <Badge variant="info">{cart.length} Items</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Column 1: Shipping & Item Summary */}
              <div className="space-y-8">
                <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800/60 shadow-xl space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 flex items-center gap-3">
                    <User size={12} /> Shipping Details
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Legal Entity Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter full recipient name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Logistics Nexus Address</label>
                      <textarea
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 min-h-[120px] transition-all font-medium"
                        placeholder="Detailed delivery coordinates..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/40 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Acquisition Inventory</h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="bg-slate-950/40 border border-slate-800/40 p-5 rounded-3xl flex justify-between items-center group hover:border-slate-700 transition-all">
                        <div className="flex gap-5 items-center">
                          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center p-2 border border-slate-800/50"><img src={item.image_url || item.img} className="max-h-full object-contain" /></div>
                          <div><h4 className="text-white font-bold text-sm">{item.name}</h4><p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Allocation: {item.qty} units</p></div>
                        </div>
                        <p className="text-lg font-black text-white tabular-nums">₹{(item.current_price * item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-slate-600 py-10 uppercase font-black text-xs tracking-widest">No active manifests found.</p>}
                  </div>
                </div>
              </div>

              {/* Column 2: Fiscal Protocol & Settlement */}
              <div className="space-y-8">
                <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800/60 shadow-xl space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                    <Tag size={12} /> Yield Optimization Protocol
                  </h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Protocol ID"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all font-black uppercase tracking-widest text-[11px]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Authenticate
                    </button>
                  </div>
                  {discount > 0 && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> Protocol Accepted: 10% Yield Reduction Applied.</p>}
                </div>

                <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800/60 shadow-xl space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                    <CreditCard size={12} /> Settlement Gateway
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`p-6 rounded-3xl border transition-all text-center space-y-3 ${paymentMethod === 'online' ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-950 border-slate-800/60'}`}
                    >
                      <Lock size={20} className={`mx-auto ${paymentMethod === 'online' ? 'text-indigo-400' : 'text-slate-600'}`} />
                      <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'online' ? 'text-white' : 'text-slate-500'}`}>Encrypted Online</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-6 rounded-3xl border transition-all text-center space-y-3 ${paymentMethod === 'cod' ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-950 border-slate-800/60'}`}
                    >
                      <RotateCcw size={20} className={`mx-auto ${paymentMethod === 'cod' ? 'text-indigo-400' : 'text-slate-600'}`} />
                      <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-white' : 'text-slate-500'}`}>Cash on Delivery</p>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-10 rounded-[2.5rem] border-2 border-indigo-500/20 space-y-8 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="tabular-nums">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                        <span>Discount Applied</span>
                        <span className="tabular-nums">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
                      <span>Shipping Fee</span>
                      <span className="tabular-nums">₹{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
                      <span>Tax (GST 18%)</span>
                      <span className="tabular-nums">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-800/80 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Order Total</p>
                        <h3 className="text-6xl font-black text-emerald-400 tabular-nums tracking-tighter">₹{totalYield.toLocaleString()}</h3>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!userData || !userData.userId) {
                          setActiveTab('login');
                          return;
                        }
                        if (!customerName) return alert("Please enter your name.");
                        if (!shippingAddress) return alert("Shipping address required.");

                        const manifest = {
                          user_id: userData.userId,
                          username: userData.username,
                          customer_name: customerName,
                          items: cart.map(i => ({ id: i.id, name: i.name, price: i.current_price, qty: i.qty })),
                          total_yield: totalYield,
                          address: shippingAddress,
                          payment_method: paymentMethod,
                          coupon_code: discount > 0 ? couponCode : null,
                          discount: discount
                        };

                        try {
                          const r = await fetch('http://localhost:8000/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(manifest)
                          });
                          if (r.ok) {
                            setCart([]);
                            setCustomerName('');
                            setShippingAddress('');
                            setCouponCode('');
                            setDiscount(0);
                            setActiveTab('home');
                            alert("Order Placed Successfully!");
                          }
                        } catch (e) { alert("Order processing error."); }
                      }}
                      className="w-full bg-indigo-600 py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] text-white hover:bg-indigo-500 shadow-2xl transition-all border border-indigo-400/20"
                    >
                      Complete Purchase
                    </button>
                    <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-widest">Secure Checkout via PriceSync Neural Defense</p>
                  </div>
                  <History className="absolute -bottom-10 -left-10 text-white/5" size={200} />
                </div>
              </div>
            </div>
          </div>
        )}


      </main>

      {/* Cart Drawer Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsCartOpen(false)}>
        <div
          className={`absolute right-0 top-0 h-full w-[450px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Your Cart</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Review Your Items</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="rotate-180" size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl flex gap-6 items-center group">
                <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center p-2 border border-slate-800/30">
                  <img src={item.image_url || item.img} className="max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-emerald-400 font-black text-sm tabular-nums mb-3">₹{item.current_price.toLocaleString()}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Minus size={14} /></button>
                      <span className="w-8 text-center text-xs font-black text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-red-400 transition-colors">Discard</button>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                <ShoppingCart size={64} className="text-slate-600" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Your Cart is Empty</p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-800 bg-slate-900/40 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Order Total</p>
                <h3 className="text-4xl font-black text-white tabular-nums tracking-tighter">₹{subtotal.toLocaleString()}</h3>
              </div>
              <Badge variant="success">Secured</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCart([])}
                className="py-4 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
              >
                Clear Cart
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => { setActiveTab('checkout'); setIsCartOpen(false); }}
                className="py-4 rounded-2xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/10 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-200 py-8 px-8 mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-sky-400 to-indigo-500 p-1.5 rounded-lg">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-black text-sm tracking-tight"><span className="gradient-text">PriceSync</span></span>
          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Enterprise v2.0</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-emerald-400" /> Secure Checkout</span>
          <span className="flex items-center gap-1.5"><Zap size={11} className="text-sky-400" /> Live Pricing</span>
          <span>© 2026 PriceSync</span>
        </div>
      </footer>
    </div>
  );
}
