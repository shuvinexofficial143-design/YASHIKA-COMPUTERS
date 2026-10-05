import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { askYashikaAI } from "../lib/ai";

const welcomeMessage = {
  role: "assistant",
  content:
    "नमस्ते 👋 मैं Yashika AI हूँ। अपना budget और computer का use बताइए—जैसे coding, gaming, office या video editing—मैं store catalog में से सही options suggest करूँगा।",
};

const suggestions = [
  "₹30,000 में coding laptop बताओ",
  "Gaming PC के लिए क्या लूँ?",
  "MacBook और Windows laptop compare करो",
  "Office के लिए best value PC?",
];

export default function AIChat({
  open,
  onOpen,
  onClose,
  seed = null,
  onSeedConsumed,
}) {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!seed) return;

    setActiveProductId(seed.productId ?? null);

    if (seed.message) {
      setInput(seed.message);
    }

    onSeedConsumed?.();
  }, [seed, onSeedConsumed]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (text = input) => {
    const clean = String(text || "").trim();
    if (!clean || loading) return;

    const nextUser = {
      role: "user",
      content: clean,
    };

    const previousHistory = messages
      .filter((item) => item.role === "user" || item.role === "assistant")
      .slice(-8);

    setMessages((current) => [...current, nextUser]);
    setInput("");
    setLoading(true);

    try {
      const data = await askYashikaAI({
        message: clean,
        history: previousHistory,
        productId: activeProductId,
      });

      if (activeProductId != null) {
        setActiveProductId(null);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error?.message ||
            "अभी AI से connection नहीं हो पाया। थोड़ी देर बाद फिर try करें।",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button className="ai-launcher" onClick={onOpen}>
        <span className="ai-launcher-glow" />
        <Bot size={21} />
        <span>
          <strong>Ask Yashika AI</strong>
          <small>Find your perfect PC</small>
        </span>
        <Sparkles size={16} />
      </button>
    );
  }

  return (
    <section className="ai-chat" aria-label="Yashika AI assistant">
      <header className="ai-chat-head">
        <div className="ai-avatar">
          <Bot size={21} />
          <span />
        </div>

        <div>
          <strong>Yashika AI</strong>
          <small>Personal shopping assistant</small>
        </div>

        <button onClick={onClose} aria-label="Minimize AI chat">
          <ChevronDown size={19} />
        </button>

        <button onClick={onClose} aria-label="Close AI chat">
          <X size={18} />
        </button>
      </header>

      <div className="ai-chat-body">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`ai-message ${message.role} ${
              message.error ? "error" : ""
            }`}
          >
            {message.role === "assistant" && (
              <div className="ai-mini-avatar">
                <Bot size={14} />
              </div>
            )}

            <div>
              {message.content.split("\n").map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < message.content.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </article>
        ))}

        {loading && (
          <article className="ai-message assistant">
            <div className="ai-mini-avatar">
              <Bot size={14} />
            </div>
            <div className="ai-typing">
              <span />
              <span />
              <span />
            </div>
          </article>
        )}

        {messages.length <= 2 && (
          <div className="ai-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => send(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <footer className="ai-chat-footer">
        <div className="ai-input-row">
          <textarea
            rows="1"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Budget और requirement लिखें..."
          />

          <button
            className="ai-send"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            aria-label="Send to Yashika AI"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="ai-footer-meta">
          <span>
            AI answers से पहले final stock/warranty store से confirm करें।
          </span>

          <button
            onClick={() => {
              setMessages([welcomeMessage]);
              setActiveProductId(null);
            }}
            title="Clear chat"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </footer>
    </section>
  );
}
