import {
  Boxes,
  CircleDollarSign,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminStats({ products, orders }) {
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const availableProducts = products.filter(
    (product) =>
      product.stock === "In Stock" || product.stock === "Build to Order"
  ).length;

  const stats = [
    {
      icon: Boxes,
      label: "Products",
      value: products.length,
      sub: `${availableProducts} available`,
    },
    {
      icon: ShoppingCart,
      label: "Enquiries",
      value: orders.length,
      sub: "Saved locally",
    },
    {
      icon: CircleDollarSign,
      label: "Enquiry value",
      value: money(totalOrderValue),
      sub: "Not actual revenue",
    },
    {
      icon: PackageCheck,
      label: "Catalog value",
      value: money(totalInventoryValue),
      sub: "1 unit each",
    },
  ];

  return (
    <div className="admin-stats">
      {stats.map(({ icon: Icon, label, value, sub }) => (
        <article key={label}>
          <div className="admin-stat-icon">
            <Icon size={19} />
          </div>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{sub}</small>
        </article>
      ))}
    </div>
  );
}
