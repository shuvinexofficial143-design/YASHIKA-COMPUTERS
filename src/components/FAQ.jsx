import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Are refurbished laptops checked before sale?",
    a: "Each listing shows the available condition and warranty information. Before purchase, confirm the exact unit condition, battery status, included accessories and final warranty with the store.",
  },
  {
    q: "Can I upgrade RAM or SSD before buying?",
    a: "Yes, many laptops and desktops can be configured or upgraded. Compatibility varies by model, so the final upgrade should be confirmed for the selected device.",
  },
  {
    q: "Can Yashika Computers build a custom gaming PC?",
    a: "Share your budget, target games or software, preferred parts and monitor resolution. The store can then suggest a suitable configuration and available components.",
  },
  {
    q: "Is delivery outside Indore possible?",
    a: "You can ask the store for current delivery coverage, packing method, payment terms and warranty handling before placing an order.",
  },
  {
    q: "Can I enquire on WhatsApp instead of online checkout?",
    a: "Yes. Add products to your cart or shortlist, review the details, and continue directly on WhatsApp for stock and purchase confirmation.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq-section" id="faq">
      <div className="section-head">
        <div>
          <span className="eyebrow">NEED TO KNOW</span>
          <h2>Frequently asked questions</h2>
        </div>
        <p>
          Quick answers about condition, upgrades, delivery and buying support
          before you make a decision.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = index === open;
          return (
            <article className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
              <button onClick={() => setOpen(isOpen ? -1 : index)}>
                <span>{item.q}</span>
                <ChevronDown size={20} />
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
