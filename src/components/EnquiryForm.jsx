import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function EnquiryForm({ productName = "a product" }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    need: productName,
  });
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const message = encodeURIComponent(
      `Hello Yashika Computers,
Name: ${form.name}
Phone: ${form.phone}
Requirement: ${form.need}`
    );
    window.open(`https://wa.me/919669888886?text=${message}`, "_blank");
    setSent(true);
  };

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="enquiry-form-head">
        <div>
          <small>QUICK ASSISTANCE</small>
          <strong>Ask about this product</strong>
        </div>
        {sent && <CheckCircle2 size={20} />}
      </div>

      <div className="enquiry-grid">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          minLength="10"
          inputMode="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <textarea
        rows="3"
        value={form.need}
        onChange={(e) => setForm({ ...form, need: e.target.value })}
        placeholder="What do you need?"
      />

      <button className="btn btn-primary btn-wide" type="submit">
        Send on WhatsApp
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
