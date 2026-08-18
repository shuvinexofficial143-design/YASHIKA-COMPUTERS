import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Are refurbished laptops checked before sale?",
    a: "The store website can present testing and condition details for each device. For a final purchase, confirm the exact unit condition, battery status, warranty and accessories with the store.",
  },
  {
    q: "Can I upgrade RAM or SSD before buying?",
    a: "Yes, many laptops and desktops can be configured or upgraded. Compatibility varies by model, so the final upgrade should be confirmed for the selected device.",
  },
  {
    q: "Can Yashika Computers build a custom gaming PC?",
    a: "Yes. The website can collect your budget, target games or software, preferred parts and monitor resolution, then send the requirement directly to the store.",
  },
  {
    q: "Is delivery outside Indore possible?",
    a: "You can ask the store for current delivery coverage, packing method, payment terms and warranty handling before placing an order.",
  },
  {
    q: "Can I enquire on WhatsApp instead of online checkout?",
    a: "Yes. This version uses an enquiry-first flow so customers can shortlist products and contact the store directly on WhatsApp.",
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
          Clear answers reduce hesitation and make it easier for customers to
          contact the store with the right information.
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
