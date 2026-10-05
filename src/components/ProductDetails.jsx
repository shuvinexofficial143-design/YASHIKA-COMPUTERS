import React from "react";
import {
  BadgeCheck,
  Bot,
  Heart,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import EmiCalculator from "./EmiCalculator";
import EnquiryForm from "./EnquiryForm";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetails({
  product,
  related = [],
  liked,
  onLike,
  onAdd,
  onClose,
  onOpenRelated,
  onAskAI,
}) {
  if (!product) return null;

  const hasDiscount =
    Number(product.oldPrice) > Number(product.price) && Number(product.oldPrice) > 0;

  const discount = hasDiscount
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100
      )
    : 0;

  return (
    <div className="details-backdrop" onMouseDown={onClose}>
      <section
        className="product-details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="details-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="details-top">
          <div className="details-gallery">
            <div className="details-image">
              <img
                src={product.image}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                }}
              />
              {hasDiscount && (
                <span className="details-discount">Save {discount}%</span>
              )}
            </div>

            <div className="details-trust">
              <span><PackageCheck size={16} /> Quality checked</span>
              <span><ShieldCheck size={16} /> Warranty info available</span>
              <span><BadgeCheck size={16} /> Store support</span>
            </div>
          </div>

          <div className="details-summary">
            <span className="eyebrow">{product.category}</span>
            <h2>{product.name}</h2>
            <p className="details-subtitle">{product.subtitle}</p>

            <div className="details-rating">
              <Star size={17} fill="currentColor" />
              <strong>{product.rating}</strong>
              <span>Product rating</span>
            </div>

            <div className="details-price">
              <strong>{money(product.price)}</strong>
              {hasDiscount && <del>{money(product.oldPrice)}</del>}
              {hasDiscount && <span>Save {discount}%</span>}
            </div>

            <div className="details-chips">
              <span
                className={
                  product.stock === "Low Stock"
                    ? "warning"
                    : product.stock === "Out of Stock"
                    ? "danger"
                    : ""
                }
              >
                {product.stock}
              </span>
              <span>{product.condition}</span>
              <span>{product.warranty}</span>
            </div>

            <div className="details-actions">
              <button
                className="btn btn-primary"
                onClick={() => onAdd(product)}
                disabled={product.stock === "Out of Stock"}
              >
                <ShoppingBag size={18} />
                {product.stock === "Out of Stock"
                  ? "Currently unavailable"
                  : "Add to enquiry cart"}
              </button>

              <button
                className={`btn btn-ghost ${liked ? "liked-btn" : ""}`}
                onClick={() => onLike(product.id)}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                {liked ? "Saved" : "Wishlist"}
              </button>
            </div>

            <button
              className="details-ai-button"
              onClick={() => {
                onClose();
                onAskAI?.(product);
              }}
            >
              <span className="details-ai-icon">
                <Bot size={18} />
              </span>

              <span>
                <strong>Ask Yashika AI about this product</strong>
                <small>
                  Gaming, coding, upgrades, value और comparison पूछें
                </small>
              </span>

              <Sparkles size={16} />
            </button>

            <div className="spec-table">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <EmiCalculator price={product.price} />
          </div>
        </div>

        <div className="details-bottom">
          <EnquiryForm productName={product.name} />

          <div className="related-block">
            <div className="related-head">
              <small>YOU MAY ALSO LIKE</small>
              <strong>Related products</strong>
            </div>

            <div className="related-grid">
              {related.map((item) => (
                <button key={item.id} onClick={() => onOpenRelated(item)}>
                  <img src={item.image} alt={item.name} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{money(item.price)}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="details-note">
          *Product condition, exact configuration, stock and warranty can vary by
          unit. Confirm final details with Yashika Computers before payment.
        </p>
      </section>
    </div>
  );
}
