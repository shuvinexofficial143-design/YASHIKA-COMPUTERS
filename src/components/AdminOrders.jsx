import { CheckCircle2, Clock3, Trash2 } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminOrders({
  orders,
  onStatusChange,
  onDelete,
}) {
  if (!orders.length) {
    return (
      <div className="admin-empty">
        <Clock3 size={30} />
        <strong>No enquiry orders yet</strong>
        <p>
          Orders created from the website checkout will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {orders.map((order) => (
        <article key={order.id}>
          <div className="admin-order-top">
            <div>
              <strong>#{order.id}</strong>
              <small>{order.createdAt}</small>
            </div>

            <select
              value={order.status}
              onChange={(event) =>
                onStatusChange(order.id, event.target.value)
              }
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="admin-order-customer">
            <span>
              <small>Customer</small>
              <strong>{order.customer?.name || "Guest"}</strong>
              <p>{order.customer?.phone || "No phone saved"}</p>
            </span>

            <span>
              <small>Pincode</small>
              <strong>{order.pincode || "—"}</strong>
            </span>

            <span>
              <small>Estimated total</small>
              <strong>{money(order.total || 0)}</strong>
            </span>
          </div>

          <div className="admin-order-items">
            {order.items.map((item) => (
              <span key={`${order.id}-${item.id}`}>
                {item.name} × {item.qty}
              </span>
            ))}
          </div>

          <div className="admin-order-bottom">
            <span>
              <CheckCircle2 size={15} />
              {order.status}
            </span>

            <button
              onClick={() => onDelete(order.id)}
              aria-label={`Delete order ${order.id}`}
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
