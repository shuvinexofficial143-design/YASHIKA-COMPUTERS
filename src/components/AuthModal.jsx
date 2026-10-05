import { useState } from "react";
import { CheckCircle2, LogOut, UserRound, X } from "lucide-react";

export default function AuthModal({ open, user, onSave, onLogout, onClose }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    });
    onClose();
  };

  return (
    <div className="v4-backdrop" onMouseDown={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Customer account"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="v4-close" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <div className="auth-icon">
          <UserRound size={27} />
        </div>

        <span className="eyebrow">CUSTOMER DETAILS</span>
        <h2>{user ? "Your saved details" : "Save your details"}</h2>
        <p className="auth-intro">
          Save your contact details on this device to make future enquiries
          faster.
        </p>

        {user && (
          <div className="signed-in-pill">
            <CheckCircle2 size={16} />
            Details saved for {user.name}
          </div>
        )}

        <form onSubmit={submit} className="auth-form">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Your name"
            />
          </label>

          <label>
            Phone
            <input
              required
              inputMode="tel"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="10-digit phone number"
            />
          </label>

          <label>
            Email <small>(optional)</small>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="name@example.com"
            />
          </label>

          <button className="btn btn-primary btn-wide" type="submit">
            Save profile
          </button>
        </form>

        {user && (
          <button
            className="logout-button"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <LogOut size={16} />
            Remove saved profile
          </button>
        )}

        <small className="auth-note">
          Your saved details stay in this browser and are used to prefill
          enquiries.
        </small>
      </section>
    </div>
  );
}
