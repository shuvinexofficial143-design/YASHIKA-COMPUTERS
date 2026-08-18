import { GitCompareArrows, X } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CompareBar({ products, onRemove, onClear }) {
  if (!products.length) return null;

  return (
    <aside className="compare-dock">
      <div className="compare-dock-head">
        <div>
          <GitCompareArrows size={18} />
          <span>
            <strong>Compare products</strong>
            <small>{products.length}/3 selected</small>
          </span>
        </div>
        <button onClick={onClear}>Clear</button>
      </div>

      <div className="compare-list">
        {products.map((product) => (
          <article key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <strong>{product.name}</strong>
              <small>{money(product.price)}</small>
            </div>
            <button
              className="compare-remove"
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.name}`}
            >
              <X size={15} />
            </button>
          </article>
        ))}
      </div>
    </aside>
  );
}
