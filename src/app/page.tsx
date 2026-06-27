"use client";

import { useMemo, useState } from "react";

type View = "dashboard" | "inbox" | "orders" | "customers" | "products" | "suppliers" | "delivery" | "finance" | "automation" | "settings";
type Order = { id:number; orderNo:string; customer:string; user:string; phone:string; address:string; city:string; product:string; qty:number; total:number; cost:number; payment:string; status:string; delivery:string; owner:string; deadline:string; priority:string; notes:string };
type Conversation = { id:number; customer:string; user:string; text:string; unread:boolean; intent:string; status:string; tags:string[] };

const names = ["Salma Ali","Yara Mohamed","Farida Samir","Nadine Adel","Hana Youssef","Dina Fathy","Mariam Nabil","Laila Amin","Jana Tarek","Rana Fouad","Sara Kamal","Nour Emad","Aya Mostafa","Mona Said","Reem Hossam","Mai Gamal","Habiba Sherif","Lina Khaled","Ola Hassan","Nada Ibrahim","Mira Adel","Dalia Omar","Kenzy Wael","Judy Ashraf","Malak Ziad"];
const products = ["Black Crossbody Bag","Summer Linen Dress","Gold Bracelet Set","Gift Box Rose","Oversized Blazer","Silk Scarf","Pearl Hair Clip","Mini Tote Bag","Cotton Lounge Set","Evening Clutch"];
const suppliers = ["Cairo Fashion Supply","Nile Accessories Co.","Alexandria Textile Hub","Istanbul Trend Import","Local Courier Pack"];
const team = ["Nora","Maya","Omar","Lina"];
const statuses = ["New","Needs Info","Confirmed","Awaiting Payment","Paid","Ready for Supplier","Packed","Out for Delivery","Delivered","Returned","Cancelled"];

function initialOrders(): Order[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    orderNo: `LB-2026-${String(i + 1).padStart(4, "0")}`,
    customer: names[i % names.length],
    user: "@" + names[i % names.length].toLowerCase().replaceAll(" ", "."),
    phone: `+20 10${String(1000000 + i * 337).padStart(7, "0")}`,
    address: `${11 + i} Garden Street`,
    city: ["Cairo", "Giza", "Alexandria", "Mansoura", "Berlin"][i % 5],
    product: products[i % products.length],
    qty: 1 + (i % 3),
    total: 45 + (i % 8) * 12,
    cost: 18 + (i % 6) * 5,
    payment: ["paid", "unpaid", "partial", "refunded"][i % 4],
    status: statuses[i % statuses.length],
    delivery: ["Not Started", "Preparing", "With Courier", "Delivered", "Issue"][i % 5],
    owner: team[i % team.length],
    deadline: `2026-07-${String(1 + (i % 20)).padStart(2, "0")}`,
    priority: i % 9 === 0 ? "urgent" : i % 5 === 0 ? "high" : "normal",
    notes: i % 6 === 0 ? "Missing address confirmation" : "Instagram DM order",
  }));
}

function initialConversations(): Conversation[] {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    customer: names[i % names.length],
    user: "@" + names[i % names.length].toLowerCase().replaceAll(" ", "."),
    text: `I want ${products[i % products.length]}, ${1 + (i % 3)} pieces, delivery tomorrow to Garden Street. Phone +20 10${String(2000000 + i * 91).padStart(7, "0")}`,
    unread: i % 3 === 0,
    intent: ["new_order", "price_question", "delivery_question", "return_request"][i % 4],
    status: ["new", "waiting_customer", "order_created", "paid", "issue"][i % 5],
    tags: i % 6 === 0 ? ["urgent", "needs phone"] : ["instagram"],
  }));
}

function badge(x: string) {
  const c = x.includes("paid") || x === "Delivered" || x === "Paid" || x === "Confirmed" ? "ok" : x.includes("urgent") || x.includes("Needs") || x.includes("Issue") || x.includes("unpaid") || x.includes("Awaiting") ? "warn" : x.includes("Cancelled") || x.includes("Returned") || x.includes("refunded") ? "bad" : "";
  return <span className={`badge ${c}`}>{x}</span>;
}

function csv(rows: Order[], filename = "luna-boutique-orders.csv") {
  const cols = ["orderNo", "customer", "user", "phone", "address", "city", "product", "qty", "total", "payment", "status", "delivery", "owner", "deadline"];
  const out = [cols.join(","), ...rows.map((r) => cols.map((k) => `"${String(r[k as keyof Order]).replaceAll('"', '""')}"`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([out], { type: "text/csv" }));
  a.download = filename;
  a.click();
}

function extract(text: string) {
  return {
    product: products.find((p) => text.toLowerCase().includes(p.toLowerCase().split(" ")[0])) || "Black Crossbody Bag",
    qty: Number(text.match(/(\d+) piece/)?.[1] || 1),
    phone: text.match(/\+20\s?10\d+/)?.[0] || "missing",
    address: text.includes("Garden") ? "Garden Street" : "missing",
    deadline: text.includes("tomorrow") ? "tomorrow" : "not detected",
    confidence: 88,
  };
}

export default function Page() {
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState("owner");
  const [view, setView] = useState<View>("dashboard");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [q, setQ] = useState("");
  const [conv, setConv] = useState(1);
  const conversations = useMemo(initialConversations, []);
  const current = conversations.find((c) => c.id === conv) || conversations[0];
  const ex = extract(current.text);
  const filtered = orders.filter((o) => (o.orderNo + o.customer + o.user + o.phone + o.status + o.product).toLowerCase().includes(q.toLowerCase()));
  const revenue = orders.filter((o) => o.payment === "paid" || o.payment === "partial").reduce((s, o) => s + o.total, 0);
  const unpaid = orders.filter((o) => o.payment === "unpaid").reduce((s, o) => s + o.total, 0);
  const profit = orders.reduce((s, o) => s + o.total - o.cost * o.qty, 0);
  const nav: View[] = ["dashboard", "inbox", "orders", "customers", "products", "suppliers", "delivery", "finance", "automation", "settings"];

  function createFromDm() {
    const id = orders.length + 1;
    setOrders([{ id, orderNo: `LB-2026-${String(id).padStart(4, "0")}`, customer: current.customer, user: current.user, phone: ex.phone, address: ex.address, city: "Cairo", product: ex.product, qty: ex.qty, total: 69, cost: 24, payment: "unpaid", status: ex.phone === "missing" ? "Needs Info" : "Confirmed", delivery: "Not Started", owner: "Maya", deadline: "2026-07-02", priority: "urgent", notes: "Created from Instagram DM" }, ...orders]);
    setView("orders");
  }

  if (!logged) return <main className="login"><section className="card"><div className="hero"><span className="badge dark">Live demo workspace</span><h1>InstaOps CRM</h1><p>Turn Instagram DMs into clean order cards, supplier lists, shipper exports, finance insights, and customer CRM.</p></div><div style={{height:16}} /><label className="small">Choose demo role</label><select value={role} onChange={(e) => setRole(e.target.value)}><option>owner</option><option>manager</option><option>staff</option></select><p className="small">Demo account: owner@luna.demo / demo123</p><button className="btn" onClick={() => setLogged(true)}>Open Luna Boutique</button></section></main>;

  return <div className="app"><aside className="sidebar"><div className="brand"><div><h1>InstaOps CRM</h1><p>Luna Boutique · {role}</p></div></div><nav className="nav">{nav.map((v) => <button key={v} onClick={() => setView(v)} className={view === v ? "active" : ""}>{v[0].toUpperCase() + v.slice(1)}</button>)}</nav><div className="card" style={{marginTop:22}}><b>Demo storyline</b><p className="small">1. Open Inbox<br/>2. Select a DM<br/>3. Review extraction<br/>4. Create order<br/>5. Export supplier or shipper list</p></div></aside><main className="main"><Hero role={role} /><div className="toolbar"><div className="split"><span className="badge ok">Instagram demo connected</span><span className="badge">40 DMs</span><span className="badge">60 orders</span><span className="badge">5 suppliers</span></div><button className="btn ghost" onClick={() => csv(orders, "luna-boutique-full-export.csv")}>Export full order list</button></div>{view === "dashboard" && <Dashboard orders={orders} revenue={revenue} unpaid={unpaid} profit={profit} setView={setView} />}{view === "inbox" && <Inbox conversations={conversations} current={current} conv={conv} setConv={setConv} ex={ex} createFromDm={createFromDm} />}{view === "orders" && <Orders orders={filtered} allOrders={orders} q={q} setQ={setQ} setOrders={setOrders} />}{view === "customers" && <Customers orders={orders} />}{view === "products" && <Products />}{view === "suppliers" && <Suppliers orders={orders} />}{view === "delivery" && <Delivery orders={orders} />}{view === "finance" && <Finance orders={orders} revenue={revenue} unpaid={unpaid} profit={profit} />}{view === "automation" && <Automation />}{view === "settings" && <Settings />}</main></div>;
}

function Hero({ role }: { role: string }) {
  return <section className="hero"><span className="badge dark">Premium demo · {role} mode</span><h1>Instagram orders, suppliers, delivery and CRM in one dashboard.</h1><p>Luna Boutique is a realistic Instagram shop demo with DMs, extracted order drafts, customer profiles, order operations, supplier handoff, courier export and financial control.</p></section>;
}

function Dashboard({ orders, revenue, unpaid, profit, setView }: { orders: Order[]; revenue: number; unpaid: number; profit: number; setView: (v: View) => void }) {
  const urgent = orders.filter((o) => o.priority !== "normal");
  const needsInfo = orders.filter((o) => o.status === "Needs Info");
  return <div className="grid"><div className="grid cards"><Card t="Revenue" v={`€${revenue}`} s="paid + partial orders" /><Card t="Open DMs" v="13" s="unread customer messages" /><Card t="Unpaid" v={`€${unpaid}`} s="follow-up required" /><Card t="Profit estimate" v={`€${profit}`} s="demo gross margin" /></div><div className="grid two"><section className="card"><div className="split space"><h2>Today command center</h2><button className="btn secondary" onClick={() => setView("inbox")}>Process DMs</button></div><div className="timeline"><Step title="13 new Instagram messages" text="Mostly new orders, price questions and delivery requests." /><Step title={`${needsInfo.length} orders need missing info`} text="Phone number, address, or payment confirmation missing." /><Step title={`${urgent.length} urgent operational tasks`} text="Deadlines, supplier actions and delivery issues require attention." /></div></section><section className="card"><h2>Pipeline health</h2><Health label="DM to order conversion" value={72} /><Health label="Payment collection" value={64} /><Health label="Supplier readiness" value={48} /><Health label="On-time delivery" value={81} /></section></div><section className="card"><div className="split space"><h2>Urgent order queue</h2>{badge("auto-prioritized")}</div><div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th>Owner</th><th>Deadline</th></tr></thead><tbody>{urgent.slice(0, 9).map((o) => <tr key={o.id}><td><b>{o.orderNo}</b></td><td>{o.customer}<br/><span className="small">{o.user}</span></td><td>{o.product} x{o.qty}</td><td>{badge(o.status)}</td><td>{o.owner}</td><td>{o.deadline}</td></tr>)}</tbody></table></div></section></div>;
}

function Card({ t, v, s }: { t: string; v: string | number; s?: string }) { return <section className="card"><h3>{t}</h3><div className="metric">{v}</div>{s && <p className="small">{s}</p>}</section>; }
function Health({ label, value }: { label: string; value: number }) { return <div style={{marginBottom:14}}><div className="split space"><b>{label}</b><span className="small">{value}%</span></div><div className="progress"><span style={{width: `${value}%`}} /></div></div>; }
function Step({ title, text }: { title: string; text: string }) { return <div className="step"><span className="dot"/><div><b>{title}</b><p className="small" style={{marginTop:3}}>{text}</p></div></div>; }

function Inbox({ conversations, current, conv, setConv, ex, createFromDm }: { conversations: Conversation[]; current: Conversation; conv: number; setConv: (n: number) => void; ex: ReturnType<typeof extract>; createFromDm: () => void }) {
  return <div className="conversation"><section className="card list"><div className="split space"><h2>Instagram Inbox</h2>{badge("AI triage")}</div>{conversations.map((c) => <div key={c.id} onClick={() => setConv(c.id)} className={`item ${conv === c.id ? "active" : ""}`}><div className="split space"><b>{c.customer}</b>{c.unread && badge("unread")}</div><p className="small">{c.user} · {c.intent}</p><p>{c.text.slice(0, 84)}...</p><div className="split">{c.tags.map((t) => <span className="badge" key={t}>{t}</span>)}</div></div>)}</section><section className="card"><div className="split space"><div><h2>{current.customer}</h2><p className="small">Instagram conversation · {current.user}</p></div>{badge(current.status)}</div><div className="bubble system">System detected intent: <b>{current.intent}</b>. Suggested next step: confirm availability, address, phone and payment method.</div><div className="bubble">{current.text}</div><div className="bubble me">Thanks! I can confirm availability and delivery fee now. Please confirm the exact address and preferred payment method.</div><div className="split"><button className="btn secondary">Suggest reply</button><button className="btn secondary">Assign to Maya</button><button className="btn ghost">Mark waiting customer</button></div></section><section className="card"><h2>Order extraction</h2>{Object.entries(ex).map(([k, v]) => <p key={k}><b>{k}:</b> {String(v)}</p>)}<Health label="Extraction confidence" value={ex.confidence} /><button className="btn" onClick={createFromDm}>Create order from DM</button><p className="small">Demo parser only. Production should use official Meta Messaging API webhooks and a real extraction model.</p></section></div>;
}

function Orders({ orders, allOrders, q, setQ, setOrders }: { orders: Order[]; allOrders: Order[]; q: string; setQ: (s: string) => void; setOrders: (fn: (all: Order[]) => Order[]) => void }) {
  const selected = orders[0] || allOrders[0];
  return <div className="grid"><section className="card"><div className="split space"><input className="input" placeholder="Search order, customer, phone, product or status" value={q} onChange={(e) => setQ(e.target.value)} style={{maxWidth:520}}/><button className="btn" onClick={() => csv(orders)}>Export filtered CSV</button></div><div className="kanban" style={{marginTop:16}}>{["New", "Needs Info", "Confirmed", "Paid"].map((s) => <div className="lane" key={s}><div className="split space"><b>{s}</b><span className="small">{allOrders.filter((o) => o.status === s).length}</span></div>{allOrders.filter((o) => o.status === s).slice(0, 5).map((o) => <div className="item" key={o.id}><b>{o.orderNo}</b><p>{o.customer}</p><p className="small">{o.product} · €{o.total} · {o.owner}</p></div>)}</div>)}</div></section><div className="grid two"><section className="card"><h2>Order table</h2><div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Payment</th><th>Status</th><th>Owner</th></tr></thead><tbody>{orders.slice(0, 28).map((o) => <tr key={o.id}><td><b>{o.orderNo}</b></td><td>{o.customer}<br/><span className="small">{o.phone}</span></td><td>{o.product} x{o.qty}</td><td>{badge(o.payment)}</td><td><select value={o.status} onChange={(e) => setOrders((all) => all.map((x) => x.id === o.id ? { ...x, status: e.target.value } : x))}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></td><td>{o.owner}</td></tr>)}</tbody></table></div></section><section className="card"><h2>Selected order preview</h2><p className="small">This side panel is what a real detail page will become.</p><h3>{selected.orderNo}</h3><p><b>{selected.customer}</b> · {selected.user}</p><p>{selected.product} x{selected.qty}</p><p>{selected.address}, {selected.city}</p><div className="split">{badge(selected.payment)}{badge(selected.status)}{badge(selected.priority)}</div><div style={{height:14}} /><Health label="Fulfillment progress" value={selected.status === "Delivered" ? 100 : selected.status === "Packed" ? 68 : selected.status === "Confirmed" ? 42 : 24} /><textarea defaultValue={selected.notes} rows={4} /></section></div></div>;
}

function Customers({ orders }: { orders: Order[] }) {
  const rows = names.slice(0, 25).map((n) => ({ n, os: orders.filter((o) => o.customer === n) }));
  return <section className="card"><div className="split space"><h2>Customer CRM</h2>{badge("segmented by value")}</div><div className="grid three">{rows.slice(0, 15).map((r) => <div className="item" key={r.n}><div className="split"><span className="avatar">{r.n.split(" ").map((p) => p[0]).join("")}</span><div><b>{r.n}</b><p className="small">@{r.n.toLowerCase().replaceAll(" ", ".")}</p></div></div><p>{r.os.length} orders · €{r.os.reduce((s, o) => s + o.total, 0)}</p><div className="split">{r.os.length > 3 && badge("VIP")}{r.os.some((o) => o.payment === "unpaid") && badge("late payer")}{badge("instagram")}</div></div>)}</div></section>;
}

function Products() { return <section className="card"><h2>Product catalog</h2><div className="table-wrap"><table className="table"><thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Price</th><th>Supplier</th><th>Stock</th></tr></thead><tbody>{products.map((p, i) => <tr key={p}><td>LB-{String(i + 1).padStart(3, "0")}</td><td><b>{p}</b><br/><span className="small">Variant: {['black','beige','gold','rose','navy'][i % 5]}</span></td><td>{["Bags", "Clothing", "Accessories", "Gift Boxes"][i % 4]}</td><td>€{29 + i * 6}</td><td>{suppliers[i % suppliers.length]}</td><td>{8 + i * 3}</td></tr>)}</tbody></table></div></section>; }

function Suppliers({ orders }: { orders: Order[] }) {
  const ready = orders.filter((o) => ["Ready for Supplier", "Confirmed", "Paid"].includes(o.status)).slice(0, 8);
  const text = ready.map((o) => `${o.orderNo} - ${o.product} x${o.qty} - ${o.customer} - needed ${o.deadline}`).join("\n");
  return <div className="grid two"><section className="card"><h2>Supplier network</h2>{suppliers.map((s, i) => <div className="item" key={s}><b>{s}</b><p className="small">Lead time {2 + i} days · WhatsApp export ready · {i % 2 === 0 ? "fast mover" : "standard"}</p></div>)}</section><section className="card"><h2>Supplier order message</h2><p className="small">Copy-ready summary for supplier handoff.</p><div className="copybox">{text || "No supplier-ready orders."}</div><button className="btn" style={{marginTop:12}} onClick={() => navigator.clipboard?.writeText(text)}>Copy supplier message</button></section></div>;
}

function Delivery({ orders }: { orders: Order[] }) {
  const ship = orders.filter((o) => ["Paid", "Packed", "Out for Delivery", "Confirmed"].includes(o.status)).slice(0, 18);
  return <section className="card"><div className="split space"><h2>Delivery / shipper list</h2><button className="btn" onClick={() => csv(ship, "luna-boutique-shipper-list.csv")}>Export shipper CSV</button></div><div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Address</th><th>COD</th><th>Notes</th></tr></thead><tbody>{ship.map((o) => <tr key={o.id}><td>{o.orderNo}</td><td>{o.customer}</td><td>{o.phone}</td><td>{o.address}, {o.city}</td><td>{o.payment === "unpaid" ? `€${o.total}` : "€0"}</td><td>{o.notes}</td></tr>)}</tbody></table></div></section>;
}

function Finance({ orders, revenue, unpaid, profit }: { orders: Order[]; revenue: number; unpaid: number; profit: number }) {
  return <div className="grid"><div className="grid cards"><Card t="Revenue" v={`€${revenue}`} s="collected and partial" /><Card t="Unpaid" v={`€${unpaid}`} s="collection queue" /><Card t="Gross profit" v={`€${profit}`} s="after product cost" /><Card t="Refunds" v={orders.filter((o) => o.payment === "refunded").length} s="orders returned" /></div><div className="grid two"><section className="card"><h2>Payment breakdown</h2>{["paid", "unpaid", "partial", "refunded"].map((p) => <div key={p} style={{marginBottom:13}}><div className="split space">{badge(p)}<span className="small">{orders.filter((o) => o.payment === p).length} orders</span></div><div className="progress"><span style={{width: `${orders.filter((o) => o.payment === p).length * 4}%`}} /></div></div>)}</section><section className="card"><h2>Finance notes</h2><Step title="Unpaid queue" text="Cash-on-delivery and unpaid Instagram orders need follow-up." /><Step title="COGS visible" text="Each order has demo cost data so gross profit can be estimated." /><Step title="Next upgrade" text="Add real expenses, ad spend, and bank payment reconciliation." /></section></div></div>;
}

function Automation() {
  const rules = ["If message contains price → suggest price reply", "If order has missing phone → mark Needs Info", "If deadline is today → mark urgent", "If customer has 3+ delivered orders → tag VIP", "If unpaid after 24h → create follow-up task", "If Ready for Supplier → include in supplier export", "If unpaid in delivery export → show COD amount", "If return/refund message → tag refund risk"];
  return <section className="card"><div className="split space"><h2>Automation rules</h2>{badge("demo logic")}</div>{rules.map((r, i) => <div className="item" key={r}><div className="split space"><b>{r}</b>{badge(i % 2 === 0 ? "active" : "suggestion")}</div></div>)}</section>;
}

function Settings() { return <section className="card"><h2>Instagram connection demo</h2><p>Production integration must use the official Meta Instagram Messaging API and webhooks. This MVP does not scrape Instagram and does not ask for Instagram passwords.</p><div className="grid three"><div className="item"><b>Meta Page ID</b><p className="small">demo_page_1001</p></div><div className="item"><b>Instagram Business Account</b><p className="small">demo_igba_1001</p></div><div className="item"><b>Status</b><p className="small">demo_connected</p></div></div><div style={{height:14}} /><div className="copybox">GET /api/meta/webhook\nPOST /api/meta/webhook\nPOST /api/instagram/send-message</div></section>; }
