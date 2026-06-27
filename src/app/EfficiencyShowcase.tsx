"use client";

import { useState } from "react";

const problems = [
  { pain: "New orders hidden inside DMs", solution: "Detect order intent and turn the message into an order draft", saved: "45 min" },
  { pain: "Customers forget phone, address or payment", solution: "Highlight missing fields before the team confirms the order", saved: "30 min" },
  { pain: "Owner does not know what is urgent", solution: "Daily command queue for unpaid, missing-info and delivery-risk orders", saved: "25 min" },
  { pain: "Supplier list is prepared manually", solution: "Batch supplier-ready items into one clean copy/export list", saved: "35 min" },
  { pain: "Courier sheet is rewritten every day", solution: "Generate shipper export with COD, phone, address and notes", saved: "40 min" }
];

const workflow = [
  "Scan 40 Instagram DMs",
  "Find 13 real order opportunities",
  "Create 7 clean order drafts",
  "Flag 5 orders with missing info",
  "Prepare supplier and delivery handoff"
];

export default function EfficiencyShowcase() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState("");

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function runWorkflow() {
    setStep((value) => Math.min(value + 1, workflow.length));
    notify("Workflow step completed");
  }

  async function copySummary() {
    const text = "InstaOps CRM daily result: 40 DMs scanned, 13 order opportunities found, 7 order drafts created, 5 missing-info cases flagged, supplier and shipper handoff prepared.";
    try {
      await navigator.clipboard?.writeText(text);
      notify("Owner summary copied");
    } catch {
      notify("Owner summary ready");
    }
  }

  if (!open) {
    return <button className="eff-fab" onClick={() => setOpen(true)}>Efficiency demo</button>;
  }

  return (
    <aside className="eff-panel" aria-label="Business efficiency demo">
      <div className="eff-head">
        <div>
          <span className="eff-kicker">Business outcome demo</span>
          <h2>Show the owner why this saves time every day</h2>
        </div>
        <button className="eff-close" onClick={() => setOpen(false)}>Close</button>
      </div>

      <div className="eff-metrics">
        <div><b>2.5h</b><span>daily admin saved</span></div>
        <div><b>13</b><span>DMs needing action</span></div>
        <div><b>5</b><span>risk items flagged</span></div>
      </div>

      <div className="eff-progress"><span style={{ width: `${(step / workflow.length) * 100}%` }} /></div>
      <p className="eff-small">Morning workflow progress: {step}/{workflow.length}</p>

      <div className="eff-actions">
        <button className="eff-primary" onClick={runWorkflow}>{step >= workflow.length ? "Workflow complete" : "Run next efficiency step"}</button>
        <button className="eff-secondary" onClick={() => { setStep(0); notify("Workflow reset"); }}>Reset</button>
      </div>

      <div className="eff-list">
        {workflow.map((item, index) => (
          <div className={index < step ? "eff-done" : ""} key={item}>
            <span>{index < step ? "Done" : "Next"}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>

      <h3>Daily problems solved</h3>
      <div className="eff-problems">
        {problems.map((item) => (
          <section key={item.pain}>
            <b>{item.pain}</b>
            <p>{item.solution}</p>
            <span>{item.saved} saved</span>
          </section>
        ))}
      </div>

      <button className="eff-copy" onClick={copySummary}>Copy owner summary</button>
      {toast && <div className="eff-toast">{toast}</div>}
    </aside>
  );
}
