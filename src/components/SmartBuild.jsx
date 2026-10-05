import { useMemo, useState } from "react";
import {
  ArrowRight,
  Gamepad2,
  GraduationCap,
  MonitorPlay,
  Sparkles,
} from "lucide-react";

const useCases = [
  {
    id: "study",
    label: "Study / Office",
    icon: GraduationCap,
    terms: ["office", "study", "business", "billing", "coding"],
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: Gamepad2,
    terms: ["gaming", "rtx", "gtx", "graphics", "rendering"],
  },
  {
    id: "creator",
    label: "Editing / Creator",
    icon: MonitorPlay,
    terms: ["editing", "creative", "creator", "rendering", "32gb", "macbook"],
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function searchable(product) {
  return [
    product.name,
    product.subtitle,
    product.category,
    product.brand,
    ...Object.values(product.specs || {}),
  ]
    .join(" ")
    .toLowerCase();
}

export default function SmartBuild({ products = [], onDetails }) {
  const [budget, setBudget] = useState(45000);
  const [useCase, setUseCase] = useState("gaming");

  const matches = useMemo(() => {
    const current = useCases.find((item) => item.id === useCase) || useCases[0];

    const systemCategories = [
      "Refurbished Laptop",
      "MacBook",
      "Desktop",
    ];

    return products
      .filter(
        (product) =>
          product.stock !== "Out of Stock" &&
          systemCategories.includes(product.category)
      )
      .map((product) => {
        const text = searchable(product);
        let score = Number(product.rating || 0) * 2;

        for (const term of current.terms) {
          if (text.includes(term)) score += 7;
        }

        if (product.price <= budget) {
          score += 18;
          score += Math.max(
            0,
            7 - (Math.abs(budget - product.price) / Math.max(budget, 1)) * 7
          );
        } else {
          score -= Math.min(28, ((product.price - budget) / budget) * 35);
        }

        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.product);
  }, [products, budget, useCase]);

  const primary = matches[0];

  const message = encodeURIComponent(
    `Hello Yashika Computers, my budget is ₹${budget.toLocaleString(
      "en-IN"
    )}. I need a computer for ${useCase}. I shortlisted ${matches
      .map((item) => item.name)
      .join(" and ")}. Please help me choose the best option.`
  );

  return (
    <section className="section smart-build-section" id="pc-builder">
      <div className="smart-build-card">
        <div className="smart-build-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            SMART PC FINDER
          </span>
          <h2>Set your budget. Get matching products instantly.</h2>
          <p>
            Choose your main use and budget. The finder scans complete systems
            in the current catalogue and surfaces the strongest matches.
          </p>

          {primary && (
            <div className="finder-confidence">
              <span>TOP MATCH</span>
              <strong>{primary.name}</strong>
              <small>
                {primary.subtitle} · {money(primary.price)}
              </small>
            </div>
          )}
        </div>

        <div className="smart-build-panel">
          <div className="use-case-grid">
            {useCases.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={useCase === id ? "active" : ""}
                onClick={() => setUseCase(id)}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>

          <div className="budget-control">
            <div>
              <span>Your budget</span>
              <strong>₹{budget.toLocaleString("en-IN")}</strong>
            </div>
            <input
              aria-label="Budget"
              type="range"
              min="15000"
              max="150000"
              step="5000"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
            <div className="budget-scale">
              <span>₹15K</span>
              <span>₹1.5L</span>
            </div>
          </div>

          <div className="finder-results">
            <div className="finder-results-head">
              <small>BEST MATCHES</small>
              <span>{matches.length} shortlisted</span>
            </div>

            {matches.map((product, index) => (
              <button
                className="finder-result"
                key={product.id}
                onClick={() => onDetails?.(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span>
                  <small>{index === 0 ? "BEST MATCH" : "ALTERNATIVE"}</small>
                  <strong>{product.name}</strong>
                  <em>{product.subtitle}</em>
                </span>
                <b>{money(product.price)}</b>
              </button>
            ))}
          </div>

          <a
            className="btn btn-primary btn-wide"
            href={`https://wa.me/919669888886?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            Discuss these options
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
