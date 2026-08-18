import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

export default function EmiCalculator({ price }) {
  const [months, setMonths] = useState(6);

  const emi = useMemo(() => Math.ceil(price / months), [price, months]);

  return (
    <div className="emi-box">
      <div className="emi-title">
        <Calculator size={17} />
        <span>Simple EMI estimate</span>
      </div>

      <div className="emi-row">
        {[3, 6, 9, 12].map((item) => (
          <button
            key={item}
            className={months === item ? "active" : ""}
            onClick={() => setMonths(item)}
          >
            {item}m
          </button>
        ))}
      </div>

      <div className="emi-result">
        <small>Approx. monthly amount</small>
        <strong>₹{emi.toLocaleString("en-IN")}/month</strong>
      </div>

      <p>
        Illustration only. Actual EMI depends on payment provider, card/bank,
        interest, fees and eligibility.
      </p>
    </div>
  );
}
