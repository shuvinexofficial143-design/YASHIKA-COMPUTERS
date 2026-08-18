import { BadgePercent, ShieldCheck, Truck, Wrench } from "lucide-react";

export default function OfferTicker() {
  const items = [
    { icon: <BadgePercent size={16} />, text: "Fresh refurbished deals every week" },
    { icon: <ShieldCheck size={16} />, text: "Quality checked before dispatch" },
    { icon: <Wrench size={16} />, text: "RAM · SSD · GPU upgrades available" },
    { icon: <Truck size={16} />, text: "Ask for delivery across India" },
  ];

  return (
    <section className="v2-ticker" aria-label="Store highlights">
      <div className="v2-ticker-track">
        {[...items, ...items].map((item, index) => (
          <span key={index}>
            {item.icon}
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}
