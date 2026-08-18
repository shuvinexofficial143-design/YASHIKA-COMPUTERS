import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  CloudOff,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Pencil,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import AdminStats from "./AdminStats";
import AdminOrders from "./AdminOrders";
import {
  getAdminSession,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
} from "../lib/supabase";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminDashboard({
  open,
  products,
  orders,
  dataMode = "local",
  onClose,
  onNewProduct,
  onEditProduct,
  onDeleteProduct,
  onResetCatalog,
  onOrderStatusChange,
  onDeleteOrder,
  onRefreshProducts,
  onRefreshOrders,
}) {
  const [tab, setTab] = useState("products");
  const [query, setQuery] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);

  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return products;

    return products.filter((product) =>
      `${product.name} ${product.brand} ${product.category} ${product.stock}`
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  useEffect(() => {
    if (!open || !isSupabaseConfigured) return;

    let cancelled = false;

    (async () => {
      setCheckingSession(true);
      const session = await getAdminSession();

      if (!cancelled) {
        setUnlocked(Boolean(session.isAdmin));
        setCheckingSession(false);

        if (session.isAdmin) {
          onRefreshProducts?.();
          onRefreshOrders?.();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, onRefreshOrders, onRefreshProducts]);

  if (!open) return null;

  const unlock = async (event) => {
    event.preventDefault();
    setLoginError("");

    if (!isSupabaseConfigured) {
      if (pin === "2026") {
        setUnlocked(true);
      } else {
        setLoginError("Wrong local demo PIN. Use 2026.");
      }
      return;
    }

    try {
      setCheckingSession(true);
      await signInAdmin(email.trim(), password);
      setUnlocked(true);
      await onRefreshProducts?.();
      await onRefreshOrders?.();
    } catch (error) {
      setLoginError(error?.message || "Admin login failed.");
    } finally {
      setCheckingSession(false);
    }
  };

  const exitAdmin = async () => {
    if (isSupabaseConfigured) {
      await signOutAdmin();
    }

    setUnlocked(false);
    setPassword("");
    onClose();
  };

  if (!unlocked) {
    return (
      <div className="v5-admin-backdrop" onMouseDown={onClose}>
        <section
          className="admin-lock admin-lock-v6"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="admin-lock-close" onClick={onClose}>
            <X size={19} />
          </button>

          <div className="admin-lock-icon">
            {isSupabaseConfigured ? (
              <ShieldCheck size={27} />
            ) : (
              <LayoutDashboard size={27} />
            )}
          </div>

          <div className="admin-mode-pill">
            {isSupabaseConfigured ? (
              <>
                <Cloud size={14} />
                Supabase cloud mode
              </>
            ) : (
              <>
                <CloudOff size={14} />
                Local fallback mode
              </>
            )}
          </div>

          <span className="eyebrow">
            {isSupabaseConfigured ? "SECURE ADMIN LOGIN" : "LOCAL ADMIN DEMO"}
          </span>

          <h2>Admin access</h2>

          <p>
            {isSupabaseConfigured
              ? "Sign in with the Supabase Auth account whose profiles.role is set to admin."
              : "Supabase is not configured yet, so the original browser-local demo PIN remains available."}
          </p>

          <form onSubmit={unlock} className="admin-login-v6">
            {isSupabaseConfigured ? (
              <>
                <input
                  required
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Admin email"
                />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                />
              </>
            ) : (
              <input
                autoFocus
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Demo PIN"
              />
            )}

            <button className="btn btn-primary" type="submit" disabled={checkingSession}>
              {checkingSession
                ? "Checking..."
                : isSupabaseConfigured
                ? "Sign in securely"
                : "Open dashboard"}
            </button>
          </form>

          {loginError && <small>{loginError}</small>}

          {!isSupabaseConfigured && (
            <div className="demo-pin-note">Demo PIN: 2026</div>
          )}

          {isSupabaseConfigured && (
            <div className="v6-security-note">
              Browser gets only the Supabase anon key. Admin permissions are
              enforced by database RLS policies.
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="v5-admin-backdrop admin-full-backdrop">
      <section className="admin-dashboard">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span>YC</span>
            <div>
              <strong>Yashika</strong>
              <small>
                {dataMode === "cloud" ? "Cloud admin" : "Local admin"}
              </small>
            </div>
          </div>

          <nav>
            <button
              className={tab === "products" ? "active" : ""}
              onClick={() => setTab("products")}
            >
              <LayoutDashboard size={17} />
              Products
            </button>

            <button
              className={tab === "orders" ? "active" : ""}
              onClick={() => {
                setTab("orders");
                onRefreshOrders?.();
              }}
            >
              <ShoppingCart size={17} />
              Enquiries
              {orders.length > 0 && <span>{orders.length}</span>}
            </button>
          </nav>

          <button className="admin-exit" onClick={exitAdmin}>
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        <main className="admin-main">
          <header className="admin-main-head">
            <div>
              <div className="admin-cloud-status">
                {dataMode === "cloud" ? (
                  <>
                    <Cloud size={14} />
                    Live Supabase database
                  </>
                ) : (
                  <>
                    <CloudOff size={14} />
                    Browser localStorage
                  </>
                )}
              </div>

              <span className="eyebrow">STORE CONTROL CENTER</span>
              <h2>
                {tab === "products" ? "Catalog management" : "Enquiry orders"}
              </h2>
            </div>

            <button className="admin-main-close" onClick={onClose}>
              <X size={19} />
            </button>
          </header>

          <AdminStats products={products} orders={orders} />

          {tab === "products" ? (
            <>
              <div className="admin-toolbar">
                <label>
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search admin catalog..."
                  />
                </label>

                <div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      if (dataMode === "cloud") {
                        onRefreshProducts?.();
                      } else if (
                        window.confirm(
                          "Reset local catalog changes back to original demo products?"
                        )
                      ) {
                        onResetCatalog();
                      }
                    }}
                  >
                    <RefreshCcw size={16} />
                    {dataMode === "cloud" ? "Refresh" : "Reset demo"}
                  </button>

                  <button className="btn btn-primary" onClick={onNewProduct}>
                    <PackagePlus size={17} />
                    Add product
                  </button>
                </div>
              </div>

              <div className="admin-product-table">
                <div className="admin-table-head">
                  <span>Product</span>
                  <span>Category</span>
                  <span>Stock</span>
                  <span>Price</span>
                  <span>Actions</span>
                </div>

                {filteredProducts.map((product) => (
                  <article key={product.id}>
                    <div className="admin-product-cell">
                      <img src={product.image} alt={product.name} />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.brand}</small>
                      </span>
                    </div>

                    <span>{product.category}</span>

                    <span className="admin-stock">
                      <i
                        className={
                          product.stock === "Out of Stock"
                            ? "out"
                            : product.stock === "Low Stock"
                            ? "low"
                            : ""
                        }
                      />
                      {product.stock}
                    </span>

                    <strong>{money(product.price)}</strong>

                    <div className="admin-row-actions">
                      <button onClick={() => onEditProduct(product)}>
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${product.name} from the catalog?`
                            )
                          ) {
                            onDeleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <AdminOrders
              orders={orders}
              onStatusChange={onOrderStatusChange}
              onDelete={onDeleteOrder}
            />
          )}
        </main>
      </section>
    </div>
  );
}
