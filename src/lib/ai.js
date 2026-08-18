import { isSupabaseConfigured, supabase } from "./supabase";

export async function askYashikaAI({
  message,
  history = [],
  productId = null,
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Yashika AI needs the Supabase backend to be connected first."
    );
  }

  const { data, error } = await supabase.functions.invoke("yashika-ai", {
    body: {
      message,
      history,
      productId,
    },
  });

  if (error) {
    let messageText = error.message || "AI request failed.";

    try {
      const context = error.context;
      if (context && typeof context.json === "function") {
        const details = await context.json();
        if (details?.error) messageText = details.error;
      }
    } catch {
      // Fall back to the original function error message.
    }

    throw new Error(messageText);
  }

  if (!data?.answer) {
    throw new Error(data?.error || "AI returned no answer.");
  }

  return data;
}
