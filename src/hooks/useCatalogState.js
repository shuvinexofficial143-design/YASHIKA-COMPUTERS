import { useCallback, useEffect, useMemo, useState } from "react";
import usePersistentState from "./usePersistentState";
import { products as seedProducts } from "../data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || "",
    category: row.category,
    brand: row.brand || "Custom",
    price: Number(row.price || 0),
    oldPrice: Number(row.old_price || 0),
    badge: row.badge || "Deal",
    stock: row.stock || "In Stock",
    condition: row.condition || "Refurbished",
    warranty: row.warranty || "Ask store*",
    rating: Number(row.rating || 4.5),
    image: row.image || "",
    specs: row.specs || {},
  };
}

function toRow(product) {
  return {
    name: product.name,
    subtitle: product.subtitle || "",
    category: product.category,
    brand: product.brand || "Custom",
    price: Number(product.price || 0),
    old_price: Number(product.oldPrice || product.price || 0),
    badge: product.badge || "Deal",
    stock: product.stock || "In Stock",
    condition: product.condition || "Refurbished",
    warranty: product.warranty || "Ask store*",
    rating: Number(product.rating || 4.5),
    image: product.image || "",
    specs: product.specs || {},
    is_active: true,
  };
}

export default function useCatalogState() {
  const [localProducts, setLocalProducts] = usePersistentState(
    "yc-admin-products",
    seedProducts
  );

  const [cloudProducts, setCloudProducts] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const products = isSupabaseConfigured ? cloudProducts : localProducts;

  const loadProducts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (queryError) {
      console.error("Supabase products load failed:", queryError);
      setError(queryError);
      setLoading(false);
      return;
    }

    setCloudProducts((data || []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (product) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalProducts((current) => {
        const nextId =
          current.length > 0
            ? Math.max(...current.map((item) => Number(item.id) || 0)) + 1
            : 1;

        return [{ ...product, id: nextId }, ...current];
      });
      return { ok: true };
    }

    const { error: insertError } = await supabase
      .from("products")
      .insert(toRow(product));

    if (insertError) {
      alert(`Product add failed: ${insertError.message}`);
      return { ok: false, error: insertError };
    }

    await loadProducts();
    return { ok: true };
  };

  const updateProduct = async (id, patch) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalProducts((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        )
      );
      return { ok: true };
    }

    const { error: updateError } = await supabase
      .from("products")
      .update(toRow(patch))
      .eq("id", id);

    if (updateError) {
      alert(`Product update failed: ${updateError.message}`);
      return { ok: false, error: updateError };
    }

    await loadProducts();
    return { ok: true };
  };

  const deleteProduct = async (id) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalProducts((current) =>
        current.filter((item) => item.id !== id)
      );
      return { ok: true };
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert(`Product delete failed: ${deleteError.message}`);
      return { ok: false, error: deleteError };
    }

    await loadProducts();
    return { ok: true };
  };

  const resetCatalog = async () => {
    if (isSupabaseConfigured) {
      alert(
        "Cloud catalog reset is intentionally disabled. Use Supabase SQL/Admin tools for destructive resets."
      );
      return;
    }

    setLocalProducts(seedProducts);
  };

  const brands = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((item) => item.brand).filter(Boolean))
      ).sort(),
    ],
    [products]
  );

  return {
    products,
    brands,
    loading,
    error,
    mode: isSupabaseConfigured ? "cloud" : "local",
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    refreshProducts: loadProducts,
  };
}
