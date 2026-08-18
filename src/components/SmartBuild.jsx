import { useMemo, useState } from "react";
import { ArrowRight, Gamepad2, GraduationCap, MonitorPlay, Sparkles } from "lucide-react";

const useCases = [
  { id: "study", label: "Study / Office", icon: GraduationCap },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "creator", label: "Editing / Creator", icon: MonitorPlay },
];

const suggestions = {
  study: {
    low: "Refurbished i5 business laptop + 8GB RAM + SSD",
    mid: "11th Gen i5 laptop + 16GB RAM + 512GB SSD",
    high: "Premium business laptop / MacBook Air class machine",
  },
  gaming: {
    low: "Entry gaming desktop + GTX-class GPU",
    mid: "6-core CPU + 16GB RAM + RTX-class GPU",
    high: "High-refresh gaming build + powerful RTX GPU",
  },
  creator: {
    low: "i5 workstation + 16GB RAM + SSD",
    mid: "i7 / Ryzen 7 + 32GB RAM + dedicated GPU",
    high: "Creator workstation / MacBook Pro class machine",
  },
};

function budgetBand(value) {
  if (value < 30000) return "low";
  if (value < 65000) return "mid";
  return "high";
}

export default function SmartBuild() {
  const [budget, setBudget] = useState(45000);
  const [useCase, setUseCase] = useState("gaming");

  const recommendation = useMemo(
    () => suggestions[useCase][budgetBand(budget)],
    [budget, useCase]
  );

  const message = encodeURIComponent(
    `Hello Yashika Computers, my budget is ₹${budget.toLocaleString(
      "en-IN"
    )}. I need a computer for ${useCase}. Please suggest the best options.`
  );

  return (
    <section className="section smart-build-section" id="pc-builder">
      <div className="smart-build-card">
        <div className="smart-build-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            SMART BUYING ASSISTANT
          </span>
          <h2>Tell us your budget. Get a smarter starting point.</h2>
          <p>
            Choose what you need the computer for and set your approximate
            budget. We’ll generate a simple recommendation you can send to the store.
          </p>
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

          <div className="recommendation-box">
            <small>RECOMMENDED STARTING POINT</small>
            <strong>{recommendation}</strong>
            <p>
              Final configuration depends on current stock, exact software/games
              and upgrade requirements.
            </p>
          </div>

          <a
            className="btn btn-primary btn-wide"
            href={`https://wa.me/919669888886?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            Ask Yashika Computers
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
