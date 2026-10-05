import { useMemo, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  PackageCheck,
  X,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPanel({
  open,
  cart,
  pricing,
  user,
  onClose,
  onOpenAccount,
  onOrderSuccess,
}) {
  const [pincode, setPincode] = useState("");
  const [pinStatus, setPinStatus] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  if (!open) return null;

  const checkPincode = () => {
    if (/^\d{6}$/.test(pincode)) {
      setPinStatus("valid");
    } else {
      setPinStatus("invalid");
    }
  };

  const confirmOrder = () => {
    setSubmitError("");

    if (!cart.length) {
      setSubmitError("Your cart is empty.");
      return;
    }

    if (!user?.name?.trim() || !user?.phone?.trim()) {
      setSubmitError("Please add your name and phone number before continuing.");
      return;
    }

    const phoneDigits = user.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      setSubmitError("Please enter a valid phone number before continuing.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setPinStatus("invalid");
      setSubmitError("Please enter a valid 6-digit delivery pincode.");
      return;
    }

    const requestId = `YC${Date.now().toString().slice(-8)}`;

    const lines = cart
      .map(
        (item) =>
          `• ${item.name} x${item.qty} — ${money(item.price * item.qty)}`
      )
      .join("\n");

    const customer = `${user.name} | ${user.phone}${
      user.email ? ` | ${user.email}` : ""
    }`;

    const message = encodeURIComponent(
      `Hello Yashika Computers, I want to confirm this order request.

Request ID: ${requestId}
Customer: ${customer}
Pincode: ${pincode}

Items:
${lines}

Subtotal: ${money(pricing?.subtotal || 0)}
Discount: ${money(pricing?.discount || 0)}
Estimated total: ${money(pricing?.total || 0)}

Please confirm exact stock, condition, warranty, delivery and final payable amount.`
    );

    window.open(`https://wa.me/919669888886?text=${message}`, "_blank");
    onOrderSuccess?.();
    onClose();
  };

  return (
    <div className="v4-backdrop" onMouseDown={onClose}>
      <section
        className="checkout-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="v4-close" onClick={onClose} aria-label="Close checkout">
          <X size={19} />
        </button>

        <div className="checkout-heading">
          <span className="eyebrow">CHECKOUT</span>
          <h2>Review your order request</h2>
          <p>
            Check your products and contact details, then continue with
            Yashika Computers for final confirmation.
          </p>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            <article className="checkout-card">
              <div className="checkout-card-title">
                <PackageCheck size={18} />
                <span>
                  <strong>{itemCount} item{itemCount === 1 ? "" : "s"}</strong>
                  <small>Order summary</small>
                </span>
              </div>

              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <span>
                      <strong>{item.name}</strong>
                      <small>Qty {item.qty}</small>
                    </span>
                    <strong>{money(item.price * item.qty)}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="checkout-card">
              <div className="checkout-card-title">
                <MapPin size={18} />
                <span>
                  <strong>Delivery pincode</strong>
                  <small>Preliminary format check</small>
                </span>
              </div>

              <div className="pincode-row">
                <input
                  inputMode="numeric"
                  maxLength="6"
                  value={pincode}
                  onChange={(event) =>
                    setPincode(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit pincode"
                />
                <button onClick={checkPincode}>Check</button>
              </div>

              {pinStatus === "valid" && (
                <div className="pin-result success">
                  <CheckCircle2 size={16} />
                  Pincode format is valid. Delivery serviceability still needs
                  store confirmation.
                </div>
              )}

              {pinStatus === "invalid" && (
                <div className="pin-result error">
                  Please enter a valid 6-digit Indian pincode.
                </div>
              )}
            </article>

            <article className="checkout-card customer-card">
              <div>
                <strong>Customer details</strong>
                {user ? (
                  <p>
                    {user.name}<br />
                    {user.phone}
                    {user.email ? <><br />{user.email}</> : null}
                  </p>
                ) : (
                  <p>No customer profile saved yet.</p>
                )}
              </div>

              <button onClick={onOpenAccount}>
                {user ? "Edit profile" : "Add details"}
              </button>
            </article>
          </div>

          <aside className="checkout-total">
            <span className="eyebrow">ORDER TOTAL</span>

            <div>
              <span>Subtotal</span>
              <strong>{money(pricing?.subtotal || 0)}</strong>
            </div>
            <div>
              <span>Discount</span>
              <strong>-{money(pricing?.discount || 0)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>Confirm with store</strong>
            </div>
            <div className="checkout-grand-total">
              <span>Estimated total</span>
              <strong>{money(pricing?.total || 0)}</strong>
            </div>

            {submitError && (
              <div className="pin-result error">{submitError}</div>
            )}

            <button
              className="btn btn-primary btn-wide"
              onClick={confirmOrder}
            >
              <MessageCircle size={18} />
              Continue on WhatsApp
            </button>

            <p>
              Final stock, delivery, warranty and payable amount are confirmed
              by the store before purchase.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
