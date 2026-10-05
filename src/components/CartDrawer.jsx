import { useMemo, useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartDrawer({
  open,
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon === "YC500") return Math.min(500, subtotal);
    if (coupon === "YASHIKA5") return Math.min(Math.round(subtotal * 0.05), 1500);
    return 0;
  }, [coupon, subtotal]);

  if (!open) return null;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (code === "YC500" || code === "YASHIKA5") {
      setCoupon(code);
      setCouponMessage(`Coupon ${code} applied`);
    } else {
      setCoupon(null);
      setCouponMessage("This coupon code is not valid.");
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="drawer-backdrop v4-drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="cart-drawer v4-cart-drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <small>SHOPPING / ENQUIRY CART</small>
            <h3>{cart.reduce((sum, item) => sum + item.qty, 0)} items</h3>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="v4-cart-products">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={32} />
              <strong>Your cart is empty</strong>
              <p>Add a product to start an enquiry.</p>
            </div>
          ) : (
            cart.map((item) => (
              <article className="v4-cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="v4-cart-copy">
                  <strong>{item.name}</strong>
                  <small>{money(item.price)} each</small>

                  <div className="qty-control">
                    <button
                      onClick={() => onDecrease(item.id)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => onIncrease(item.id)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="v4-cart-price">
                  <strong>{money(item.price * item.qty)}</strong>
                  <button
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="coupon-box">
              <div className="coupon-input">
                <Tag size={16} />
                <input
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Coupon code"
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {couponMessage && <small>{couponMessage}</small>}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div>
                <span>Offer discount</span>
                <strong>-{money(discount)}</strong>
              </div>
              <div className="cart-total-row">
                <span>Estimated total</span>
                <strong>{money(total)}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-wide"
              onClick={() =>
                onCheckout({
                  subtotal,
                  discount,
                  total,
                  coupon,
                })
              }
            >
              Continue to checkout
              <ArrowRight size={18} />
            </button>

            <small className="cart-disclaimer">
              Online payment is not collected here. Final pricing, delivery,
              warranty and stock are confirmed by the store.
            </small>
          </>
        )}
      </aside>
    </div>
  );
}
