import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Headphones,
  Heart,
  Instagram,
  Laptop,
  MapPin,
  Menu,
  MonitorUp,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
  Wrench,
  X,
  Youtube,
  Zap,
} from "lucide-react";

import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import OfferTicker from "./components/OfferTicker";
import CompareBar from "./components/CompareBar";
import SmartBuild from "./components/SmartBuild";
import FAQ from "./components/FAQ";
import FloatingActions from "./components/FloatingActions";
import ProductFilters from "./components/ProductFilters";
import AuthModal from "./components/AuthModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutPanel from "./components/CheckoutPanel";
import WishlistDrawer from "./components/WishlistDrawer";
import AIChat from "./components/AIChat";

import usePersistentState from "./hooks/usePersistentState";
import { brands, categories, products, reviews } from "./data";

import "./styles-v2.css";
import "./styles-v3.css";
import "./styles-v4.css";
import "./styles-v5.css";
import "./styles-v6.css";
import "./styles-v7.css";

function App() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");

  const [liked, setLiked] = usePersistentState("yc-liked", []);
  const [cart, setCart] = usePersistentState("yc-cart", []);
  const [user, setUser] = usePersistentState("yc-user", null);

  const [compare, setCompare] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSeed, setAiSeed] = useState(null);

  const [checkoutPricing, setCheckoutPricing] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
    coupon: null,
  });

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let result = products.filter((product) => {
      const categoryMatch =
        category === "All" || product.category === category;

      const queryMatch =
        !normalizedQuery ||
        `${product.name} ${product.subtitle} ${product.category} ${product.brand}`
          .toLowerCase()
          .includes(normalizedQuery);

      const brandMatch = brand === "All" || product.brand === brand;
      const priceMatch = Number(product.price) <= maxPrice;

      const stockMatch =
        !inStockOnly ||
        product.stock === "In Stock" ||
        product.stock === "Build to Order";

      return (
        categoryMatch &&
        queryMatch &&
        brandMatch &&
        priceMatch &&
        stockMatch
      );
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, query, brand, maxPrice, inStockOnly, sort]);

  const relatedProducts = useMemo(() => {
    if (!productDetails) return [];

    const sameCategory = products.filter(
      (item) =>
        item.id !== productDetails.id &&
        item.category === productDetails.category
    );

    const fallback = products.filter(
      (item) =>
        item.id !== productDetails.id &&
        !sameCategory.some((same) => same.id === item.id)
    );

    return [...sameCategory, ...fallback].slice(0, 3);
  }, [products, productDetails]);

  const wishlistProducts = useMemo(
    () => products.filter((product) => liked.includes(product.id)),
    [products, liked]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToCart = (product) => {
    if (product.stock === "Out of Stock") return;

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });

    setCartOpen(true);
  };

  const increaseCartItem = (id) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseCartItem = (id) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeCartItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const toggleCompare = (product) => {
    setCompare((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }

      if (current.length >= 3) return current;
      return [...current, product];
    });
  };

  const resetFilters = () => {
    setBrand("All");
    setMaxPrice(150000);
    setInStockOnly(false);
    setCategory("All");
    setQuery("");
    setSort("featured");
  };

  const openCheckout = (pricing) => {
    setCheckoutPricing(pricing);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className="topbar">
        <span>
          <Sparkles size={15} />
          Premium refurbished tech. Smarter price.
        </span>
        <a href="tel:+919669888886">Call: +91 96698 88886</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Yashika Computers home">
          <span className="brand-mark">YC</span>
          <span className="brand-copy">
            <strong>YASHIKA</strong>
            <small>COMPUTERS</small>
          </span>
        </a>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#pc-builder" onClick={() => setMenuOpen(false)}>PC Finder</a>
          <a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <button
            className="nav-ai-button"
            onClick={() => {
              setMenuOpen(false);
              setAiOpen(true);
            }}
          >
            <Sparkles size={14} />
            Ask AI
          </button>
        </nav>

        <div className="header-actions">
          <a
            className="icon-button desktop-only"
            href="https://www.instagram.com/computer_by_yashika/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={19} />
          </a>

          <button
            className="icon-button v4-count-button"
            onClick={() => setWishlistOpen(true)}
            aria-label="Open wishlist"
          >
            <Heart size={19} />
            {liked.length > 0 && <span>{liked.length}</span>}
          </button>

          <button
            className="icon-button v4-account-button"
            onClick={() => setAuthOpen(true)}
            aria-label="Customer account"
          >
            <UserRound size={19} />
          </button>

          <button
            className="icon-button cart-button"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>

          <button
            className="icon-button menu-button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {user && (
        <div className="welcome-strip">
          <span>
            Welcome back, <strong>{user.name}</strong>
          </span>
          <button onClick={() => setAuthOpen(true)}>Edit profile</button>
        </div>
      )}

      <main id="top">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <BadgeCheck size={17} />
                Indore's premium computer destination
              </div>

              <h1>
                Big performance.
                <span>Smarter prices.</span>
              </h1>

              <p className="hero-lead">
                Refurbished business laptops, MacBooks, custom desktops,
                gaming PCs, GPUs and computer components — curated for people
                who want more performance for every rupee.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#shop">
                  Explore deals <ArrowRight size={18} />
                </a>
                <a className="btn btn-secondary" href="#pc-builder">
                  Find my PC
                </a>
              </div>

              <div className="trust-row">
                <div><strong>4.8★</strong><span>Google rating</span></div>
                <div><strong>93+</strong><span>Google reviews</span></div>
                <div><strong>Indore</strong><span>Local store support</span></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-glow"></div>

              <div className="showcase-card showcase-main">
                <span className="mini-label">FEATURED SETUP</span>
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1500&q=88"
                  alt="Premium desktop computer setup"
                />
                <div className="showcase-caption">
                  <div>
                    <small>Build your machine</small>
                    <strong>Custom PC Studio</strong>
                  </div>
                  <span className="circle-arrow">
                    <ArrowRight size={19} />
                  </span>
                </div>
              </div>

              <div className="floating-card floating-top">
                <ShieldCheck size={22} />
                <div><strong>Quality checked</strong><small>Before dispatch</small></div>
              </div>

              <div className="floating-card floating-bottom">
                <Zap size={22} />
                <div><strong>Upgrade ready</strong><small>RAM · SSD · GPU</small></div>
              </div>
            </div>
          </div>
        </section>

        <OfferTicker />

        <section className="service-strip">
          <div><ShieldCheck /><span><strong>Tested devices</strong><small>Buy with confidence</small></span></div>
          <div><CircleDollarSign /><span><strong>Value pricing</strong><small>Premium for less</small></span></div>
          <div><Wrench /><span><strong>Upgrade support</strong><small>Build it your way</small></span></div>
          <div><Headphones /><span><strong>Real store support</strong><small>Indore team</small></span></div>
        </section>

        <section className="section" id="shop">
          <div className="section-head shop-head">
            <div>
              <span className="eyebrow">CURATED INVENTORY</span>
              <h2>Find your next machine</h2>
            </div>

            <label className="search-box">
              <Search size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search laptop, MacBook, GPU..."
              />
            </label>
          </div>

          <div className="shop-toolbar">
            <div className="category-tabs" aria-label="Product categories">
              {categories.map((item) => (
                <button
                  key={item}
                  className={item === category ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <select
              className="sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="catalog-layout">
            <ProductFilters
              brand={brand}
              setBrand={setBrand}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              brands={brands}
              onReset={resetFilters}
            />

            <div>
              <div className="catalog-meta">
                <span>
                  {`${filteredProducts.length} products found`}
                </span>
                <small>Updated catalog · Contact store for final availability</small>
              </div>

              <div className="product-grid product-grid-v3">
                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      liked={liked.includes(product.id)}
                      compared={compare.some((item) => item.id === product.id)}
                      compareDisabled={compare.length >= 3}
                      onLike={toggleLike}
                      onAdd={addToCart}
                      onQuickView={setProductDetails}
                      onDetails={setProductDetails}
                      onCompare={toggleCompare}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <Search size={28} />
                    <h3>No matching product</h3>
                    <p>Try another search, budget or brand.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <SmartBuild />

        <section className="dark-section" id="why-us">
          <div className="section">
            <div className="section-head">
              <div>
                <span className="eyebrow">MORE THAN A COMPUTER SHOP</span>
                <h2>Built around what you actually need</h2>
              </div>
              <p>
                Choose a ready machine or build one around your work, gaming,
                editing, study or business needs.
              </p>
            </div>

            <div className="benefit-grid">
              <article className="benefit-card benefit-wide">
                <div className="benefit-icon"><Laptop /></div>
                <span>01</span>
                <h3>Premium refurbished laptops</h3>
                <p>
                  Business-class Dell, HP, Lenovo and Apple machines at a
                  fraction of new-device pricing.
                </p>
                <a href="#shop">Browse laptops <ChevronRight size={17} /></a>
              </article>

              <article className="benefit-card">
                <div className="benefit-icon"><Cpu /></div>
                <span>02</span>
                <h3>Custom PC builds</h3>
                <p>
                  Configure CPU, RAM, SSD, graphics and cabinet around your
                  performance target and budget.
                </p>
              </article>

              <article className="benefit-card">
                <div className="benefit-icon"><MonitorUp /></div>
                <span>03</span>
                <h3>Gaming & creator upgrades</h3>
                <p>
                  GPUs, storage and performance upgrades for gaming, editing
                  and professional workloads.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section review-section" id="reviews">
          <div className="section-head">
            <div>
              <span className="eyebrow">CUSTOMER LOVE</span>
              <h2>Trusted by local buyers</h2>
            </div>

            <div className="rating-pill">
              <Star size={18} fill="currentColor" />
              <strong>4.8</strong>
              <span>93 Google reviews</span>
            </div>
          </div>

          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="stars">★★★★★</div>
                <p>“{review.text}”</p>
                <div className="review-author">
                  <span>{review.name.charAt(0)}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>Google customer review</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FAQ />

        <section className="section">
          <div className="cta-panel">
            <div>
              <span className="eyebrow">NOT SURE WHAT TO BUY?</span>
              <h2>Tell us your budget. We’ll help shortlist the right PC.</h2>
            </div>

            <a
              className="btn btn-light"
              href={`https://wa.me/919669888886?text=${encodeURIComponent(
                "Hello Yashika Computers, my budget is ₹____ and I need a computer for ____."
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Get recommendation <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section contact-grid">
            <div>
              <span className="eyebrow">VISIT YASHIKA COMPUTERS</span>
              <h2>Tech you can see, test and trust.</h2>
              <p>13/1, Siyaganj, Indore, Madhya Pradesh 452007</p>
            </div>

            <div className="contact-cards">
              <a href="tel:+919669888886">
                <Phone />
                <span><small>Call us</small><strong>+91 96698 88886</strong></span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Yashika+Computers+13%2F1+Siyaganj+Indore"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin />
                <span><small>Store</small><strong>Get directions</strong></span>
              </a>

              <a
                href="https://www.instagram.com/computer_by_yashika/"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram />
                <span><small>Instagram</small><strong>@computer_by_yashika</strong></span>
              </a>

              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                <Youtube />
                <span><small>YouTube</small><strong>Watch latest deals</strong></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">YC</span>
            <span className="brand-copy">
              <strong>YASHIKA</strong>
              <small>COMPUTERS</small>
            </span>
          </a>

          <p>
            Premium refurbished tech · Custom PCs · Gaming · Components
            <br />
            <span className="v6-footer-mode">Indore · Support available on call & WhatsApp</span>
          </p>

        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onIncrease={increaseCartItem}
        onDecrease={decreaseCartItem}
        onRemove={removeCartItem}
        onCheckout={openCheckout}
      />

      <WishlistDrawer
        open={wishlistOpen}
        products={wishlistProducts}
        onClose={() => setWishlistOpen(false)}
        onRemove={toggleLike}
        onAdd={addToCart}
        onDetails={setProductDetails}
      />

      <AuthModal
        open={authOpen}
        user={user}
        onSave={setUser}
        onLogout={() => setUser(null)}
        onClose={() => setAuthOpen(false)}
      />

      <CheckoutPanel
        open={checkoutOpen}
        cart={cart}
        pricing={checkoutPricing}
        user={user}
        onClose={() => setCheckoutOpen(false)}
        onCreateOrder={async () => ({ ok: true })}
        onOrderSuccess={() => setCart([])}
        onOpenAccount={() => {
          setCheckoutOpen(false);
          setAuthOpen(true);
        }}
      />

      <ProductDetails
        product={productDetails}
        related={relatedProducts}
        liked={productDetails ? liked.includes(productDetails.id) : false}
        onLike={toggleLike}
        onAdd={addToCart}
        onClose={() => setProductDetails(null)}
        onOpenRelated={setProductDetails}
        onAskAI={(product) => {
          setAiSeed({
            productId: product.id,
            message: `${product.name} मेरे लिए कैसा रहेगा? इसके pros, limitations और किस use के लिए best है बताओ।`,
          });
          setAiOpen(true);
        }}
      />

      <CompareBar
        products={compare}
        onRemove={(id) =>
          setCompare((current) => current.filter((item) => item.id !== id))
        }
        onClear={() => setCompare([])}
      />

      <AIChat
        open={aiOpen}
        onOpen={() => setAiOpen(true)}
        onClose={() => setAiOpen(false)}
        seed={aiSeed}
        onSeedConsumed={() => setAiSeed(null)}
      />

      <FloatingActions />
    </>
  );
}

export default App;
