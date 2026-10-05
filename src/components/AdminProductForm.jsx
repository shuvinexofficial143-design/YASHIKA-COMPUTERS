import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";

const emptyForm = {
  name: "",
  subtitle: "",
  category: "Refurbished Laptop",
  brand: "",
  price: "",
  oldPrice: "",
  badge: "New",
  stock: "In Stock",
  condition: "Refurbished",
  warranty: "Ask store*",
  rating: "4.5",
  image:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85",
  processor: "",
  memory: "",
  storage: "",
  display: "",
  use: "",
};

export default function AdminProductForm({
  open,
  product,
  onClose,
  onCreate,
  onUpdate,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm({
        name: product.name || "",
        subtitle: product.subtitle || "",
        category: product.category || "Refurbished Laptop",
        brand: product.brand || "",
        price: String(product.price ?? ""),
        oldPrice: String(product.oldPrice ?? ""),
        badge: product.badge || "Deal",
        stock: product.stock || "In Stock",
        condition: product.condition || "Refurbished",
        warranty: product.warranty || "Ask store*",
        rating: String(product.rating ?? "4.5"),
        image: product.image || emptyForm.image,
        processor: product.specs?.Processor || product.specs?.GPU || "",
        memory: product.specs?.Memory || "",
        storage: product.specs?.Storage || "",
        display: product.specs?.Display || "",
        use: product.specs?.Use || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, product]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();

    const specs = product?.specs ? { ...product.specs } : {};

    const primarySpecKey =
      product?.specs?.GPU && !product?.specs?.Processor ? "GPU" : "Processor";

    const applySpec = (key, value, fallback) => {
      const clean = value.trim();

      if (clean) {
        specs[key] = clean;
      } else if (!product && fallback) {
        specs[key] = fallback;
      }
    };

    applySpec(primarySpecKey, form.processor, "Confirm with store");
    applySpec("Memory", form.memory, "Confirm with store");
    applySpec("Storage", form.storage, "Confirm with store");
    applySpec("Display", form.display, "Confirm with store");
    applySpec("Use", form.use, "General");

    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      brand: form.brand.trim() || "Custom",
      price: Number(form.price),
      oldPrice: Number(form.oldPrice || form.price),
      badge: form.badge.trim() || "Deal",
      stock: form.stock,
      condition: form.condition,
      warranty: form.warranty.trim() || "Ask store*",
      rating: Number(form.rating || 4.5),
      image: form.image.trim() || emptyForm.image,
      specs,
    };

    if (product) {
      onUpdate(product.id, payload);
    } else {
      onCreate(payload);
    }

    onClose();
  };

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="v5-admin-backdrop" onMouseDown={onClose}>
      <section
        className="admin-product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product ? "Edit product" : "Add product"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-product-form-head">
          <div>
            <span className="eyebrow">
              {product ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </span>
            <h2>{product ? product.name : "Add catalog item"}</h2>
          </div>

          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form className="admin-product-form" onSubmit={submit}>
          <div className="admin-form-grid">
            <label>
              Product name
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </label>

            <label>
              Brand
              <input
                required
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
              />
            </label>

            <label className="admin-span-2">
              Short description
              <input
                required
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option>Refurbished Laptop</option>
                <option>MacBook</option>
                <option>Desktop</option>
                <option>Gaming</option>
                <option>Components</option>
              </select>
            </label>

            <label>
              Badge
              <input
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
              />
            </label>

            <label>
              Selling price
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </label>

            <label>
              MRP / old price
              <input
                type="number"
                min="0"
                value={form.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
              />
            </label>

            <label>
              Stock
              <select
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              >
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
                <option>Build to Order</option>
              </select>
            </label>

            <label>
              Condition
              <select
                value={form.condition}
                onChange={(e) => set("condition", e.target.value)}
              >
                <option>Refurbished</option>
                <option>Pre-owned</option>
                <option>Custom Build</option>
                <option>New</option>
              </select>
            </label>

            <label>
              Warranty
              <input
                value={form.warranty}
                onChange={(e) => set("warranty", e.target.value)}
              />
            </label>

            <label>
              Rating
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </label>

            <label className="admin-span-2">
              Product image URL
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </label>

            <label>
              Processor / GPU
              <input
                value={form.processor}
                onChange={(e) => set("processor", e.target.value)}
              />
            </label>

            <label>
              Memory
              <input
                value={form.memory}
                onChange={(e) => set("memory", e.target.value)}
              />
            </label>

            <label>
              Storage
              <input
                value={form.storage}
                onChange={(e) => set("storage", e.target.value)}
              />
            </label>

            <label>
              Display
              <input
                value={form.display}
                onChange={(e) => set("display", e.target.value)}
              />
            </label>

            <label className="admin-span-2">
              Best use
              <input
                value={form.use}
                onChange={(e) => set("use", e.target.value)}
              />
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? <Save size={17} /> : <Plus size={17} />}
              {product ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
