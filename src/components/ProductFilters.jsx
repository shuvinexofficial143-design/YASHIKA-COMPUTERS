import { SlidersHorizontal, X } from "lucide-react";

export default function ProductFilters({
  brand,
  setBrand,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  brands,
  onReset,
}) {
  return (
    <aside className="filter-panel">
      <div className="filter-title">
        <span>
          <SlidersHorizontal size={18} />
          Filters
        </span>
        <button onClick={onReset} aria-label="Reset filters">
          <X size={14} />
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label>Brand</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {brands.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <div className="filter-price-label">
          <label>Maximum price</label>
          <strong>₹{Number(maxPrice).toLocaleString("en-IN")}</strong>
        </div>
        <input
          type="range"
          min="5000"
          max="150000"
          step="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <div className="filter-scale">
          <span>₹5K</span>
          <span>₹1.5L</span>
        </div>
      </div>

      <label className="stock-toggle">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
        <span>Show available stock only</span>
      </label>
    </aside>
  );
}
