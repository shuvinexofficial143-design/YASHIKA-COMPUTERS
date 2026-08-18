import { MessageCircle, Phone } from "lucide-react";

export default function FloatingActions() {
  const whatsapp = encodeURIComponent(
    "Hello Yashika Computers, I visited your website and need help choosing a product."
  );

  return (
    <div className="floating-actions">
      <a
        href={`https://wa.me/919669888886?text=${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={21} />
        <span>WhatsApp</span>
      </a>
      <a href="tel:+919669888886" aria-label="Call Yashika Computers">
        <Phone size={20} />
      </a>
    </div>
  );
}
