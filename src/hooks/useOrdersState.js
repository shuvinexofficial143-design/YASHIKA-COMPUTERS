import { useCallback, useEffect, useState } from "react";
import usePersistentState from "./usePersistentState";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function fromRow(row) {
  return {
    id: row.display_id,
    dbId: row.id,
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString("en-IN")
      : "",
    status: row.status || "New",
    customer: row.customer || null,
    pincode: row.pincode || "",
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    coupon: row.coupon || null,
  };
}

export default function useOrdersState() {
  const [localOrders, setLocalOrders] = usePersistentState(
    "yc-admin-orders",
    []
  );

  const [cloudOrders, setCloudOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const orders = isSupabaseConfigured ? cloudOrders : localOrders;

  const loadOrders = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // For non-admin/anonymous users RLS intentionally returns no readable orders.
      setCloudOrders([]);
      setLoading(false);
      return;
    }

    setCloudOrders((data || []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    loadOrders();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      setTimeout(loadOrders, 0);
    });

    return () => subscription.unsubscribe();
  }, [loadOrders]);

  const createOrder = async (order) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalOrders((current) => [order, ...current]);
      return { ok: true };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      display_id: order.id,
      user_id: user?.id || null,
      customer: order.customer || null,
      pincode: order.pincode || null,
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      total: Number(order.total || 0),
      coupon: order.coupon || null,
      status: order.status || "New",
    };

    const { error } = await supabase.from("orders").insert(payload);

    if (error) {
      console.error("Order save failed:", error);
      return { ok: false, error };
    }

    await loadOrders();
    return { ok: true };
  };

  const updateOrderStatus = async (displayId, status) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalOrders((current) =>
        current.map((order) =>
          order.id === displayId ? { ...order, status } : order
        )
      );
      return { ok: true };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("display_id", displayId);

    if (error) {
      alert(`Order update failed: ${error.message}`);
      return { ok: false, error };
    }

    await loadOrders();
    return { ok: true };
  };

  const deleteOrder = async (displayId) => {
    if (!isSupabaseConfigured || !supabase) {
      setLocalOrders((current) =>
        current.filter((order) => order.id !== displayId)
      );
      return { ok: true };
    }

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("display_id", displayId);

    if (error) {
      alert(`Order delete failed: ${error.message}`);
      return { ok: false, error };
    }

    await loadOrders();
    return { ok: true };
  };

  return {
    orders,
    loading,
    mode: isSupabaseConfigured ? "cloud" : "local",
    createOrder,
    updateOrderStatus,
    deleteOrder,
    refreshOrders: loadOrders,
  };
}
