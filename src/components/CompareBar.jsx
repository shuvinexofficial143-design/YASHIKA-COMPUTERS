import React, { useMemo, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CompareBar({ products, onRemove, onClear }) {
  const [open, setOpen] = useState(false);

  const specKeys = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) => Object.keys(product.specs || {}))
        )
      ),
    [products]
  );

  if (!products.length) return null;

  return (
    <>
      <aside className="compare-dock">
        <div className="compare-dock-head">
          <div>
            <GitCompareArrows size={18} />
            <span>
              <strong>Compare products</strong>
              <small>{products.length}/3 selected</small>
            </span>
          </div>

          <div className="compare-dock-actions">
            <button
              className="compare-open"
              onClick={() => setOpen(true)}
              disabled={products.length < 2}
            >
              {products.length < 2 ? "Select 2 products" : "Compare now"}
            </button>
            <button onClick={onClear}>Clear</button>
          </div>
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

      {open && (
        <div className="compare-modal-backdrop" onMouseDown={() => setOpen(false)}>
          <section
            className="compare-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Product comparison"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="compare-modal-head">
              <div>
                <small>PRODUCT COMPARISON</small>
                <h2>Compare your shortlist</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close comparison">
                <X size={20} />
              </button>
            </header>

            <div className="compare-table-wrap">
              <div
                className="compare-table"
                style={{
                  gridTemplateColumns: `140px repeat(${products.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="compare-label compare-top-label">Product</div>
                {products.map((product) => (
                  <div className="compare-product-head" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <strong>{product.name}</strong>
                    <small>{product.subtitle}</small>
                  </div>
                ))}

                <div className="compare-label">Price</div>
                {products.map((product) => (
                  <div className="compare-value compare-price" key={`price-${product.id}`}>
                    {money(product.price)}
                  </div>
                ))}

                <div className="compare-label">Condition</div>
                {products.map((product) => (
                  <div className="compare-value" key={`condition-${product.id}`}>
                    {product.condition || "—"}
                  </div>
                ))}

                <div className="compare-label">Stock</div>
                {products.map((product) => (
                  <div className="compare-value" key={`stock-${product.id}`}>
                    {product.stock || "—"}
                  </div>
                ))}

                <div className="compare-label">Warranty</div>
                {products.map((product) => (
                  <div className="compare-value" key={`warranty-${product.id}`}>
                    {product.warranty || "—"}
                  </div>
                ))}

                <div className="compare-label">Rating</div>
                {products.map((product) => (
                  <div className="compare-value" key={`rating-${product.id}`}>
                    {product.rating ? `${product.rating}/5` : "—"}
                  </div>
                ))}

                {specKeys.map((key) => (
                  <React.Fragment key={key}>
                    <div className="compare-label">{key}</div>
                    {products.map((product) => (
                      <div
                        className="compare-value"
                        key={`${key}-${product.id}`}
                      >
                        {product.specs?.[key] || "—"}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
