import { products } from "../data";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return String(value || "").toLowerCase().replace(/,/g, "").replace(/\s+/g, " ").trim();
}

function parseBudget(message) {
  const text = normalize(message);
  const budgetCue =
    text.includes("budget") ||
    text.includes("under") ||
    text.includes("तक") ||
    text.includes("₹") ||
    text.includes("rs") ||
    text.includes("inr");

  if (!budgetCue) return null;

  const match = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(k|हजार|l|lac|lakh|लाख)?/i);
  if (!match) return null;

  let value = Number(match[1]);
  const suffix = (match[2] || "").toLowerCase();

  if (suffix === "k" || suffix === "हजार") value *= 1000;
  if (["l", "lac", "lakh", "लाख"].includes(suffix)) value *= 100000;

  return value >= 1000 ? value : null;
}

function getIntent(message) {
  const text = normalize(message);

  if (/gaming|game|गेम|fps|rtx|gtx/.test(text)) return "gaming";
  if (/edit|editing|video|premiere|after effects|creator|render|एडिट/.test(text)) return "creator";
  if (/coding|code|developer|programming|development|कोड/.test(text)) return "coding";
  if (/office|study|student|business|billing|school|ऑफिस|स्टडी/.test(text)) return "office";
  if (/mac|macbook|apple|macos/.test(text)) return "mac";
  if (/upgrade|component|processor|gpu|graphics|ram|ssd/.test(text)) return "upgrade";

  return "general";
}

function productText(product) {
  return normalize(
    [
      product.name,
      product.subtitle,
      product.category,
      product.brand,
      product.condition,
      product.stock,
      ...Object.values(product.specs || {}),
    ].join(" ")
  );
}

function scoreProduct(product, intent, budget, query) {
  const text = productText(product);
  let score = Number(product.rating || 0) * 2;
  const completeSystem = [
    "Refurbished Laptop",
    "MacBook",
    "Desktop",
  ].includes(product.category);

  if (intent === "upgrade") {
    score += completeSystem ? -8 : 16;
  } else if (["gaming", "creator", "coding", "office", "mac"].includes(intent)) {
    score += completeSystem ? 14 : -28;
  }

  const intentTerms = {
    gaming: ["gaming", "rtx", "gtx", "graphics", "1440p", "1080p", "rendering"],
    creator: ["editing", "creative", "creator", "rendering", "32gb", "macbook pro"],
    coding: ["coding", "development", "business", "16gb", "32gb", "windows 11 pro"],
    office: ["office", "business", "study", "billing", "mini pc"],
    mac: ["macbook", "apple", "macos"],
    upgrade: ["upgrade", "components", "processor", "gpu", "graphics"],
    general: [],
  };

  for (const term of intentTerms[intent] || []) {
    if (text.includes(term)) score += 6;
  }

  if (budget) {
    if (product.price <= budget) {
      score += 18;
      score += Math.max(0, 8 - Math.abs(budget - product.price) / Math.max(budget, 1) * 8);
    } else {
      score -= Math.min(24, ((product.price - budget) / budget) * 30);
    }
  }

  const usefulWords = normalize(query)
    .split(" ")
    .filter((word) => word.length >= 4 && !["budget", "best", "laptop", "computer", "बताओ", "chahiye"].includes(word));

  for (const word of usefulWords) {
    if (text.includes(word)) score += 2;
  }

  if (product.stock === "Out of Stock") score -= 100;

  return score;
}

function rankedProducts(message) {
  const budget = parseBudget(message);
  const intent = getIntent(message);

  return products
    .map((product) => ({
      product,
      score: scoreProduct(product, intent, budget, message),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

function findMentionedProducts(message) {
  const text = normalize(message);

  return products.filter((product) => {
    const name = normalize(product.name);
    const importantTokens = name.split(" ").filter((token) => token.length >= 3);
    const hits = importantTokens.filter((token) => text.includes(token)).length;

    return text.includes(name) || hits >= Math.min(2, importantTokens.length);
  });
}

function recommendationReason(product, intent) {
  const use = product.specs?.Use || "";
  const memory = product.specs?.Memory || "";
  const storage = product.specs?.Storage || "";

  if (intent === "gaming") {
    return product.specs?.GPU
      ? `${product.specs.GPU} और ${memory || "dedicated graphics"} की वजह से gaming-focused option है`
      : "gaming के लिए यह general-purpose machine है; dedicated GPU requirement confirm करें";
  }

  if (intent === "creator") {
    return `${memory || "usable memory"} + ${storage || "SSD storage"} और ${use || "creative workload support"} इसे creator work के लिए strong बनाते हैं`;
  }

  if (intent === "coding") {
    return `${memory || "adequate RAM"}, ${storage || "SSD"} और ${use || "business-class configuration"} coding के लिए balanced हैं`;
  }

  if (intent === "office") {
    return `${use || "office-focused configuration"} और value pricing इसे daily work के लिए practical बनाते हैं`;
  }

  if (intent === "mac") {
    return "Apple ecosystem, macOS और creative/development workflow के लिए premium option है";
  }

  return `${product.subtitle} इसकी main strength है`;
}

function productDetailAnswer(product, message) {
  const intent = getIntent(message);
  const reason = recommendationReason(product, intent);
  const specs = Object.entries(product.specs || {})
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" · ");

  return [
    `${product.name} — ${money(product.price)}`,
    `• क्यों अच्छा है: ${reason}।`,
    `• मुख्य specs: ${specs || product.subtitle}।`,
    `• Condition: ${product.condition} · Stock: ${product.stock}।`,
    `• Warranty: ${product.warranty}।`,
    "• Limitation: exact unit condition, battery/accessories और final warranty खरीदने से पहले store से confirm करें।",
  ].join("\n");
}

function compareAnswer(message) {
  let matches = findMentionedProducts(message);

  if (matches.length < 2) {
    const ranked = rankedProducts(message);
    matches = ranked.slice(0, 2);
  } else {
    matches = matches.slice(0, 2);
  }

  const [a, b] = matches;
  if (!a || !b) return null;

  const cheaper = a.price <= b.price ? a : b;
  return [
    `${a.name} vs ${b.name}`,
    `• ${a.name}: ${money(a.price)} · ${a.subtitle}`,
    `• ${b.name}: ${money(b.price)} · ${b.subtitle}`,
    `• Budget winner: ${cheaper.name}`,
    `• ${a.name}: ${a.condition} · ${a.warranty}`,
    `• ${b.name}: ${b.condition} · ${b.warranty}`,
    `• ${a.name} best use: ${a.specs?.Use || "general use"}`,
    `• ${b.name} best use: ${b.specs?.Use || "general use"}`,
    "Final pick आपके software, upgrade need और exact unit condition पर depend करेगा।",
  ].join("\n");
}

export async function askYashikaAI({
  message,
  history = [],
  productId = null,
}) {
  const clean = String(message || "").trim();

  if (!clean) {
    throw new Error("अपना budget या requirement लिखें।");
  }

  await wait(650);

  const currentProduct =
    productId != null
      ? products.find((product) => String(product.id) === String(productId))
      : null;

  if (currentProduct) {
    return {
      answer: productDetailAnswer(currentProduct, clean),
      mode: "catalog-assistant",
    };
  }

  const text = normalize(clean);

  if (/compare|comparison|vs|versus|तुलना|कम्पेयर/.test(text)) {
    const answer = compareAnswer(clean);
    if (answer) {
      return { answer, mode: "catalog-assistant" };
    }
  }

  const budget = parseBudget(clean);
  const intent = getIntent(clean);
  const ranked = rankedProducts(clean);

  let shortlist = ranked.filter((product) =>
    budget ? product.price <= budget : true
  );

  if (!shortlist.length) shortlist = ranked;
  shortlist = shortlist.slice(0, 3);

  if (!shortlist.length) {
    return {
      answer:
        "अभी catalog में आपकी requirement का exact match नहीं दिख रहा। Budget और use थोड़ा detail में बताइए।",
      mode: "catalog-assistant",
    };
  }

  const heading = budget
    ? `${money(budget)} तक ${intent === "general" ? "best options" : intent + " के लिए best options"}:`
    : `${intent === "general" ? "मेरी shortlist" : intent + " के लिए मेरी shortlist"}:`;

  const lines = shortlist.map(
    (product, index) =>
      `${index + 1}. ${product.name} — ${money(product.price)}\n   ${recommendationReason(product, intent)}।`
  );

  const best = shortlist[0];

  return {
    answer: [
      heading,
      ...lines,
      `मेरी पहली पसंद: ${best.name}।`,
      "चाहें तो मैं इन options का direct comparison भी बता सकता हूँ।",
    ].join("\n"),
    mode: "catalog-assistant",
    historyUsed: Math.min(Array.isArray(history) ? history.length : 0, 8),
  };
}
