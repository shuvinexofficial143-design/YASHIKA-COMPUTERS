import { Check, ShoppingBag, X } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function QuickView({ product, onClose, onAdd }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="quick-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="quick-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="quick-copy">
          <span className="eyebrow">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.subtitle}</p>

          <div className="price-row modal-price">
            <strong>{money(product.price)}</strong>
            <del>{money(product.oldPrice)}</del>
          </div>

          <ul className="feature-list">
            <li><Check size={17} /> Quality checked before dispatch</li>
            <li><Check size={17} /> Store support from Indore</li>
            <li><Check size={17} /> Ask for current warranty & stock</li>
          </ul>

          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              onAdd(product);
              onClose();
            }}
          >
            <ShoppingBag size={18} />
            Add to enquiry cart
          </button>
        </div>
      </section>
    </div>
  );
}
