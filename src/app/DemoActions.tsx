"use client";

import { useEffect, useState } from "react";

const replies = [
  "Yes, it is available. Please send your full address, phone number, and preferred payment method so we can confirm the order.",
  "Great choice. We can deliver tomorrow. The total will be confirmed after delivery fee. Please confirm your exact location.",
  "Thank you. I reserved the item for you for 2 hours. Please send phone number and address to complete the order."
];

function pickReply() {
  return replies[Math.floor(Math.random() * replies.length)];
}

export default function DemoActions() {
  const [toast, setToast] = useState("");
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function show(message: string) {
      setToast(message);
      window.setTimeout(() => setToast(""), 2200);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;
      if (!button) return;
      if (button.closest(".nav")) return;

      const label = button.textContent?.trim().toLowerCase() || "";
      if (label.includes("suggest reply")) {
        const text = pickReply();
        setReply(text);
        setOpen(true);
        show("Suggested reply generated");
      } else if (label.includes("assign to maya")) {
        button.textContent = "Assigned to Maya";
        show("Conversation assigned to Maya");
      } else if (label.includes("mark waiting customer")) {
        button.textContent = "Waiting customer";
        show("Status changed to waiting customer");
      } else if (label.includes("copy supplier")) {
        show("Supplier message copied");
      } else if (label.includes("export")) {
        show("Export started");
      } else if (label.includes("create order")) {
        show("Order created from Instagram DM");
      } else if (label.includes("process dms")) {
        show("Opening inbox workflow");
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function copyReply() {
    try {
      await navigator.clipboard?.writeText(reply);
      setToast("Reply copied to clipboard");
      window.setTimeout(() => setToast(""), 2200);
    } catch {
      setToast("Reply ready to copy");
      window.setTimeout(() => setToast(""), 2200);
    }
  }

  return (
    <>
      {toast && <div className="demo-toast">{toast}</div>}
      {open && (
        <aside className="demo-panel" aria-label="Suggested reply panel">
          <div className="split space">
            <b>AI suggested reply</b>
            <button className="mini-btn" onClick={() => setOpen(false)}>Close</button>
          </div>
          <p>{reply}</p>
          <div className="split">
            <button className="btn" onClick={copyReply}>Copy reply</button>
            <button className="btn secondary" onClick={() => setReply(pickReply())}>Regenerate</button>
          </div>
          <p className="small">Demo only: no Instagram message is sent.</p>
        </aside>
      )}
    </>
  );
}
