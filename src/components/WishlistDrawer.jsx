import { ArrowRight, Heart, ShoppingBag, Trash2, X } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function WishlistDrawer({
  open,
  products,
  onClose,
  onRemove,
  onAdd,
  onDetails,
}) {
  if (!open) return null;

  return (
    <div className="drawer-backdrop v4-drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="cart-drawer wishlist-drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <small>SAVED PRODUCTS</small>
            <h3>{products.length} wishlist items</h3>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className="wishlist-items">
          {products.length === 0 ? (
            <div className="cart-empty">
              <Heart size={32} />
              <strong>No saved products yet</strong>
              <p>Tap the heart on any product to save it here.</p>
            </div>
          ) : (
            products.map((product) => (
              <article key={product.id}>
                <button
                  className="wishlist-image"
                  onClick={() => {
                    onDetails(product);
                    onClose();
                  }}
                >
                  <img src={product.image} alt={product.name} />
                </button>

                <div>
                  <strong>{product.name}</strong>
                  <small>{product.subtitle}</small>
                  <span>{money(product.price)}</span>
                </div>

                <div className="wishlist-actions">
                  <button
                    onClick={() => onAdd(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag size={16} />
                  </button>
                  <button
                    onClick={() => onRemove(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {products.length > 0 && (
          <a className="btn btn-ghost btn-wide" href="#shop" onClick={onClose}>
            Continue shopping
            <ArrowRight size={18} />
          </a>
        )}
      </aside>
    </div>
  );
}
