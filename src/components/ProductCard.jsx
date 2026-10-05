import { Eye, GitCompareArrows, Heart, ShoppingBag } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({
  product,
  liked,
  compared,
  compareDisabled,
  onLike,
  onAdd,
  onQuickView,
  onCompare,
  onDetails,
}) {
  const hasDiscount =
    Number(product.oldPrice) > Number(product.price) && Number(product.oldPrice) > 0;

  const discount = hasDiscount
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100
      )
    : 0;

  const preferredSpecKeys = [
    "Processor",
    "GPU",
    "Memory",
    "Storage",
    "Display",
    "Use",
  ];

  const quickSpecs = preferredSpecKeys
    .filter((key) => product.specs?.[key])
    .slice(0, 3)
    .map((key) => product.specs[key]);

  return (
    <article className="product-card">
      <div className="product-media product-media-button">
        <button
          className="product-image-click"
          onClick={() => onDetails(product)}
          aria-label={`Open ${product.name} details`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.opacity = "0";
            }}
          />
        </button>

        <div className="product-badges">
          <span className="badge badge-accent">{product.badge}</span>
          {hasDiscount && <span className="badge">Save {discount}%</span>}
        </div>

        <button
          className={`icon-button wishlist ${liked ? "active" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onLike(product.id)}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-body">
        <p className="product-category">{product.category}</p>

        <button
          className="product-title-button"
          onClick={() => onDetails(product)}
        >
          <h3>{product.name}</h3>
        </button>

        <p className="product-subtitle">{product.subtitle}</p>

        {quickSpecs.length > 0 && (
          <div className="product-quick-specs">
            {quickSpecs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
        )}

        <div className="stock-line">
          <span
            className={
              product.stock === "Low Stock"
                ? "low"
                : product.stock === "Out of Stock"
                ? "out"
                : ""
            }
          >
            {product.stock}
          </span>
          <small>{product.warranty}</small>
        </div>

        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {hasDiscount && <del>{money(product.oldPrice)}</del>}
        </div>

        <button
          className={`compare-toggle ${compared ? "active" : ""}`}
          disabled={compareDisabled && !compared}
          onClick={() => onCompare(product)}
        >
          <GitCompareArrows size={15} />
          {compared ? "Added to compare" : "Compare"}
        </button>

        <div className="product-actions">
          <button
            className="btn btn-card"
            onClick={() => onAdd(product)}
            disabled={product.stock === "Out of Stock"}
          >
            <ShoppingBag size={17} />
            {product.stock === "Out of Stock" ? "Out of stock" : "Add"}
          </button>
          <button
            className="btn btn-ghost btn-card"
            onClick={() => onDetails(product)}
          >
            <Eye size={17} />
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
