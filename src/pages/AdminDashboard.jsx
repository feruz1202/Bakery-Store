// src/pages/AdminDashboard.jsx
// Route: /admin  — add to your router:
//   <Route path="/admin" element={<AdminDashboard />} />
//
// Reads from: /api/admin/* (your Express backend)
// Env var needed in frontend: VITE_API_URL=https://your-railway-backend.up.railway.app

import { useState, useEffect, useCallback } from "react";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import API_URL from "../config"

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ─── Config ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Design tokens (matching Farine & Co.) ───────────────────────────────────
const C = {
    cream: "#FAF7F2", blush: "#F0E8D8", gold: "#C9A96E", goldDark: "#A8833F",
    charcoal: "#1C1C1C", muted: "#6B6560", border: "#E8DDD0", white: "#FFFFFF",
    success: "#7A8C6E", danger: "#C0392B", brown: "#3b2314",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const initials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const STATUS_COLORS = {
    delivered: { bg: "#EAF3DE", color: "#27500A" },
    confirmed: { bg: "#E6F1FB", color: "#0C447C" },
    processing: { bg: "#FFF3CD", color: "#856404" },
    pending: { bg: "#F0E8D8", color: "#A8833F" },
    cancelled: { bg: "#FCEBEB", color: "#791F1F" },
};

const STATUSES = ["pending", "confirmed", "preparing", "delivered", "cancelled"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const [analytics, setAnalytics] = useState(null)

useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => setAnalytics(data))
}, [])

function Badge({ status }) {
    const s = STATUS_COLORS[status] || { bg: C.blush, color: C.muted };
    return (
        <span style={{
            background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 20, textTransform: "capitalize",
        }}>{status}</span>
    );
}

function StatCard({ label, value, sub, accent }) {
    return (
        <div style={{
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "16px 18px", borderTop: `3px solid ${accent || C.gold}`,
        }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.charcoal, lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>{sub}</div>}
        </div>
    );
}

function SectionHead({ children }) {
    return (
        <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
            color: C.charcoal, borderBottom: `2px solid ${C.gold}`,
            paddingBottom: 8, marginBottom: 20,
        }}>{children}</div>
    );
}

function Spinner() {
    return <div style={{ textAlign: "center", padding: "3rem", color: C.muted, fontFamily: "Inter, sans-serif" }}>Loading…</div>;
}

function useApi(token) {
    const get = useCallback(async (path) => {
        const res = await fetch(`${API}/api/admin${path}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }, [token]);

    const patch = useCallback(async (path, body) => {
        const res = await fetch(`${API}/api/admin${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }, [token]);

    return { get, patch };
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            sessionStorage.setItem("fc_admin_token", data.token);
            onLogin(data.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inp = {
        width: "100%", padding: "10px 13px", borderRadius: 8,
        border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif",
        fontSize: 13, color: C.charcoal, background: C.cream,
        outline: "none", marginBottom: 14, boxSizing: "border-box",
    };

    return (
        <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "36px 32px", width: 380, maxWidth: "90vw" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.charcoal, textAlign: "center" }}>Farine & Co.</div>
                <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginBottom: 28 }}>Admin Dashboard</div>

                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 5 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
                    <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 5 }}>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inp} placeholder="••••••••" />
                    {error && <div style={{ fontSize: 12, color: C.danger, marginBottom: 10 }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: 12, borderRadius: 8, background: C.gold, border: "none",
                        color: C.white, fontSize: 14, fontFamily: "'Playfair Display', serif",
                        fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}


// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderModal({ order, token, onClose, onStatusChange }) {
    const { patch } = useApi(token);
    const [status, setStatus] = useState(order.status);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleStatusSave = async () => {
        setSaving(true);
        try {
            const updated = await patch(`/orders/${order._id}/status`, { status });
            onStatusChange(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            alert("Failed to update status: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const overlay = {
        position: "fixed", inset: 0, background: "rgba(28,28,28,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
    };

    const box = {
        background: C.white, borderRadius: 16, width: "100%", maxWidth: 580,
        maxHeight: "90vh", overflowY: "auto", fontFamily: "Inter, sans-serif",
    };

    const row = (label, value) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ fontSize: 13, color: C.charcoal, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
        </div>
    );

    const user = order.user || {};
    const items = order.items || order.orderItems || [];

    return (
        <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={box}>
                {/* Header */}
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.charcoal }}>
                            Order {order._id?.toString().slice(-6).toUpperCase() || "—"}
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, lineHeight: 1 }}>×</button>
                </div>

                <div style={{ padding: "20px 24px" }}>
                    {/* Customer info */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontWeight: 600 }}>Customer</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: C.cream, borderRadius: 10, border: `1px solid ${C.border}` }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: "50%", background: C.blush,
                                border: `2px solid ${C.gold}`, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "'Playfair Display', serif",
                                fontSize: 15, fontWeight: 700, color: C.goldDark, flexShrink: 0,
                            }}>{initials(user.name)}</div>
                            <div>
                                <div style={{ fontWeight: 600, color: C.charcoal, fontSize: 14 }}>{user.name || "—"}</div>
                                <div style={{ fontSize: 12, color: C.muted }}>{user.email || "—"}</div>
                                {user.phone && <div style={{ fontSize: 12, color: C.muted }}>📞 {user.phone}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Order items */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontWeight: 600 }}>Items Ordered</div>
                        {items.length > 0 ? (
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                                {items.map((item, i) => {
                                    const p = item.product || item;
                                    return (
                                        <div key={i} style={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            padding: "10px 14px", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
                                            background: i % 2 === 0 ? C.white : "#FDFAF6",
                                        }}>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{p.name || "Product"}</div>
                                                <div style={{ fontSize: 11, color: C.muted }}>Qty: {item.quantity || 1}</div>
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>
                                                {fmt((p.price || item.price || 0) * (item.quantity || 1))}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: C.cream, borderTop: `1px solid ${C.border}` }}>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: C.charcoal }}>Total</span>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: C.gold, fontSize: 18 }}>
                                        {fmt(
                                            order.totalPrice ||
                                            (order.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                                        )}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: C.muted, padding: "12px 0" }}>No item details available.</div>
                        )}
                    </div>

                    {/* Shipping address if available */}
                    {order.shippingAddress && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontWeight: 600 }}>Delivery Address</div>
                            <div style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.7, padding: "12px 14px", background: C.cream, borderRadius: 8, border: `1px solid ${C.border}` }}>
                                {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(", ")}
                            </div>
                        </div>
                    )}

                    {/* Notes if any */}
                    {order.notes && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Customer Note</div>
                            <div style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.6, padding: "10px 14px", background: "#FFFDF7", border: `1px solid ${C.border}`, borderRadius: 8 }}>
                                {order.notes}
                            </div>
                        </div>
                    )}

                    {/* Status editor */}
                    <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px" }}>
                        <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontWeight: 600 }}>Update Order Status</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            {STATUSES.map(s => (
                                <button key={s} onClick={() => setStatus(s)} style={{
                                    padding: "7px 14px", borderRadius: 20, border: `1px solid ${status === s ? C.gold : C.border}`,
                                    background: status === s ? C.gold : C.white, color: status === s ? C.white : C.muted,
                                    fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer",
                                    textTransform: "capitalize", fontWeight: status === s ? 600 : 400,
                                }}>{s}</button>
                            ))}
                        </div>
                        <button onClick={handleStatusSave} disabled={saving || status === order.status} style={{
                            padding: "9px 22px", borderRadius: 8, background: saved ? C.success : C.gold,
                            border: "none", color: C.white, fontFamily: "'Playfair Display', serif",
                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                            opacity: (saving || status === order.status) ? 0.6 : 1,
                        }}>
                            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Status"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Overview Section ─────────────────────────────────────────────────────────
function Overview({ token }) {
    const { get } = useApi(token);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        get("/stats").then(setStats).catch(console.error);
    }, [get]);

    if (!stats) return <Spinner />;

    // Build monthly arrays (fill missing months with 0)
    const revenueByMonth = Array(12).fill(0);
    const ordersByMonth = Array(12).fill(0);
    (stats.monthlyRevenue || []).forEach(m => { revenueByMonth[m._id - 1] = m.total; });
    (stats.ordersPerMonth || []).forEach(m => { ordersByMonth[m._id - 1] = m.count; });

    const chartBase = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
    };

    const xTick = { grid: { display: false }, ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: C.muted } };
    const yTick = { grid: { color: "#F0E8D8" }, ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: C.muted } };

    return (
        <div>
            <SectionHead>Overview</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
                <StatCard label="Total revenue" value={`$${Math.round(stats.totalRevenue).toLocaleString()}`} accent={C.gold} />
                <StatCard label="Orders" value={stats.totalOrders} accent="#7A8C6E" />
                <StatCard label="Products" value={stats.totalProducts} sub={`${stats.totalUnits} units · ${stats.outOfStock} out of stock`} accent="#4A6FA5" />
                <StatCard label="Customers" value={stats.totalUsers} accent="#A8833F" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Monthly Revenue</div>
                    <div style={{ height: 200 }}>
                        <Bar
                            data={{ labels: MONTHS, datasets: [{ data: revenueByMonth, backgroundColor: "#C9A96E", borderRadius: 5, hoverBackgroundColor: "#A8833F" }] }}
                            options={{ ...chartBase, scales: { x: xTick, y: { ...yTick, ticks: { ...yTick.ticks, callback: v => `$${v}` } } } }}
                        />
                    </div>
                </div>

                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Sales by Category</div>
                    <div style={{ height: 150 }}>
                        <Doughnut
                            data={{ labels: ["Pastries", "Bread", "Cakes", "Cookies", "Drinks"], datasets: [{ data: [38, 22, 18, 14, 8], backgroundColor: ["#C9A96E", "#A8833F", "#7A8C6E", "#4A6FA5", "#D4A5A5"], borderWidth: 0 }] }}
                            options={{ ...chartBase, cutout: "65%" }}
                        />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {[["Pastries", "#C9A96E", 38], ["Bread", "#A8833F", 22], ["Cakes", "#7A8C6E", 18], ["Cookies", "#4A6FA5", 14], ["Drinks", "#D4A5A5", 8]].map(([l, c, v]) => (
                            <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
                                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l} {v}%
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Orders Per Month</div>
                <div style={{ height: 180 }}>
                    <Line
                        data={{ labels: MONTHS, datasets: [{ data: ordersByMonth, borderColor: "#C9A96E", backgroundColor: "rgba(201,169,110,0.07)", pointBackgroundColor: "#C9A96E", pointRadius: 4, tension: 0.4, fill: true }] }}
                        options={{ ...chartBase, scales: { x: xTick, y: yTick } }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Orders Section ───────────────────────────────────────────────────────────
function Orders({ token }) {
    const { get } = useApi(token);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== "all") params.set("status", filter);
            if (search) params.set("search", search);
            const data = await get(`/orders?${params}`);
            setOrders(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [get, filter, search]);

    useEffect(() => { load(); }, [load]);

    const handleStatusChange = (updated) => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status: updated.status } : o));
        if (selected?._id === updated._id) setSelected({ ...selected, status: updated.status });
    };

    const tbl = { fontFamily: "Inter, sans-serif", fontSize: 13 };
    const th = { padding: "10px 14px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}`, background: C.cream };

    return (
        <div>
            <SectionHead>Orders</SectionHead>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by customer name or order ID…"
                    style={{ flex: 1, minWidth: 200, padding: "8px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none", background: C.white }}
                />
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
                {["all", ...STATUSES].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === s ? C.gold : C.border}`,
                        background: filter === s ? C.gold : C.white, color: filter === s ? C.white : C.muted,
                        fontSize: 12, fontFamily: "Inter, sans-serif", cursor: "pointer", textTransform: "capitalize",
                    }}>{s}</button>
                ))}
            </div>

            {loading ? <Spinner /> : (
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", ...tbl }}>
                            <thead>
                                <tr>
                                    <th style={th}>Order ID</th>
                                    <th style={th}>Customer</th>
                                    <th style={th}>Total</th>
                                    <th style={th}>Status</th>
                                    <th style={th}>Date</th>
                                    <th style={th}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: C.muted }}>No orders found.</td></tr>
                                ) : orders.map((o, i) => (
                                    <tr key={o._id} style={{ background: i % 2 === 0 ? C.white : "#FDFAF6", borderBottom: `1px solid ${C.border}` }}>
                                        <td style={{ padding: "11px 14px", fontWeight: 600, color: C.gold }}>
                                            #{o._id?.toString().slice(-6).toUpperCase()}
                                        </td>
                                        <td style={{ padding: "11px 14px", color: C.charcoal }}>
                                            <div style={{ fontWeight: 500 }}>{o.user?.name || o.shippingAddress?.name || "—"}</div>
                                            <div style={{ fontSize: 11, color: C.muted }}>{o.user?.email || "—"}</div>
                                        </td>
                                        <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: C.charcoal }}>
                                            {fmt(
                                                o.totalPrice ||
                                                (o.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                                            )}
                                        </td>
                                        <td style={{ padding: "11px 14px" }}><Badge status={o.status} /></td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <div style={{ fontSize: 12, color: C.charcoal }}>
                                                {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </div>
                                            <div style={{ fontSize: 11, color: C.muted }}>
                                                {new Date(o.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <button onClick={async () => {
                                                try {
                                                    const full = await get(`/orders/${o._id}`)
                                                    setSelected(full)
                                                } catch (err) {
                                                    alert("Could not load order detail: " + err.message)
                                                }
                                            }} style={{
                                                padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.border}`,
                                                background: C.white, color: C.charcoal, fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif",
                                            }}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selected && (
                <OrderModal
                    order={selected}
                    token={token}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

// ─── Products Section ─────────────────────────────────────────────────────────
function Products({ token }) {
    const { get } = useApi(token);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            get(`/products?search=${search}`).then(setProducts).catch(console.error).finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(t);
    }, [get, search]);

    const low = products.filter(p => (p.stock || 0) <= 10);
    const best = products.reduce((a, b) => ((a.sold || 0) > (b.sold || 0) ? a : b), {});
    const total = products.reduce((s, p) => s + (p.stock || 0), 0);

    const th = { padding: "10px 14px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}`, background: C.cream };

    return (
        <div>
            <SectionHead>Products</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
                <StatCard label="Total products" value={products.length} accent={C.gold} />
                <StatCard label="Total stock" value={total} sub="units across all" accent="#7A8C6E" />
                <StatCard label="Low stock" value={low.length} sub={low.map(p => p.name).join(", ") || "None"} accent="#C0392B" />
                <StatCard label="Best seller" value={best.name || "—"} sub={best.sold ? `${best.sold} sold` : ""} accent="#A8833F" />
            </div>

            {/* Stock bar chart */}
            {products.length > 0 && (
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Stock Levels</div>
                    <div style={{ height: products.length * 40 + 60 }}>
                        <Bar
                            data={{
                                labels: products.map(p => p.name),
                                datasets: [{ data: products.map(p => p.stock || 0), backgroundColor: products.map(p => (p.stock || 0) <= 10 ? "#F09595" : "#C9A96E"), borderRadius: 4 }]
                            }}
                            options={{
                                indexAxis: "y", responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { color: "#F0E8D8" }, ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: C.muted } },
                                    y: { grid: { display: false }, ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: C.charcoal } },
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                style={{ width: "100%", padding: "8px 13px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none", background: C.white, marginBottom: 14, boxSizing: "border-box" }}
            />

            {loading ? <Spinner /> : (
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
                            <thead>
                                <tr>
                                    <th style={th}>Name</th>
                                    <th style={th}>Category</th>
                                    <th style={th}>Price</th>
                                    <th style={th}>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => (
                                    <tr key={p._id} style={{ background: i % 2 === 0 ? C.white : "#FDFAF6", borderBottom: `1px solid ${C.border}` }}>
                                        <td style={{ padding: "11px 14px", fontWeight: 600, color: C.charcoal }}>
                                            {p.image && <img src={p.image} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover", marginRight: 8, verticalAlign: "middle" }} />}
                                            {p.name}
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <span style={{ background: C.blush, color: C.goldDark, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{p.category}</span>
                                        </td>
                                        <td style={{ padding: "11px 14px", fontWeight: 600 }}>{fmt(p.price)}</td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <span style={{ fontWeight: 600, color: (p.stock || 0) <= 10 ? C.danger : C.success }}>{p.stock ?? "—"}</span>
                                            {(p.stock || 0) <= 10 && <span style={{ fontSize: 10, color: C.danger, marginLeft: 6 }}>Low</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Customers Section ────────────────────────────────────────────────────────
function Customers({ token }) {
    const { get } = useApi(token);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get("/users").then(setUsers).catch(console.error).finally(() => setLoading(false));
    }, [get]);

    const totalSpent = users.reduce((s, u) => s + (u.totalSpent || 0), 0);
    const avgOrder = users.length ? (totalSpent / users.reduce((s, u) => s + u.orderCount, 0) || 0) : 0;

    return (
        <div>
            <SectionHead>Customers</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
                <StatCard label="Total customers" value={users.length} accent={C.gold} />
                <StatCard label="Total orders" value={users.reduce((s, u) => s + u.orderCount, 0)} accent="#7A8C6E" />
                <StatCard label="Avg order value" value={fmt(avgOrder)} accent="#4A6FA5" />
                <StatCard label="Total revenue" value={`$${Math.round(totalSpent).toLocaleString()}`} accent="#A8833F" />
            </div>

            {loading ? <Spinner /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 14 }}>
                    {users.map(u => (
                        <div key={u._id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: "50%", background: C.blush,
                                border: `2px solid ${C.gold}`, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "'Playfair Display', serif",
                                fontSize: 14, fontWeight: 700, color: C.goldDark, flexShrink: 0,
                            }}>{initials(u.name)}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, color: C.charcoal, fontSize: 13 }}>{u.name}</div>
                                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{u.email}{u.phone ? ` · ${u.phone}` : ""}</div>
                                <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
                                    <span>Orders: <strong style={{ color: C.charcoal }}>{u.orderCount}</strong></span>
                                    <span>Spent: <strong style={{ color: C.gold }}>{fmt(u.totalSpent)}</strong></span>
                                    <span>Since: <strong style={{ color: C.charcoal }}>{u.joined ? new Date(u.joined).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—"}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Staff Section (static — add your real staff or extend later) ─────────────
function Staff({ token }) {
    const { get } = useApi(token)
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null) // null = adding new, object = editing existing
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [formError, setFormError] = useState("")

    const emptyForm = { firstName: "", lastName: "", role: "", shift: "", phone: "", status: "active" }
    const [form, setForm] = useState(emptyForm)

    const loadStaff = useCallback(async () => {
        setLoading(true)
        try {
            const data = await get("/staff")
            setStaff(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [get])

    useEffect(() => { loadStaff() }, [loadStaff])

    const openAdd = () => {
        setEditing(null)
        setForm(emptyForm)
        setFormError("")
        setShowForm(true)
    }

    const openEdit = (member) => {
        setEditing(member)
        setForm({
            firstName: member.firstName,
            lastName: member.lastName,
            role: member.role,
            shift: member.shift,
            phone: member.phone,
            status: member.status,
        })
        setFormError("")
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.firstName || !form.lastName || !form.role || !form.shift || !form.phone) {
            setFormError("All fields are required.")
            return
        }
        setSaving(true)
        setFormError("")
        try {
            const url = editing ? `${API_URL}/api/admin/staff/${editing._id}` : `${API_URL}/api/admin/staff`
            const method = editing ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            await loadStaff()
            setShowForm(false)
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this staff member?")) return
        setDeleting(id)
        try {
            await fetch(`${API_URL}/api/admin/staff/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            setStaff(prev => prev.filter(s => s._id !== id))
        } catch (err) {
            alert("Failed to delete: " + err.message)
        } finally {
            setDeleting(null)
        }
    }

    const inp = {
        width: "100%", padding: "9px 12px", borderRadius: 8,
        border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif",
        fontSize: 13, color: C.charcoal, background: C.cream,
        outline: "none", boxSizing: "border-box", marginBottom: 10,
    }

    return (
        <div>
            <SectionHead>Staff</SectionHead>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
                <StatCard label="Total staff" value={staff.length} accent={C.gold} />
                <StatCard label="On shift today" value={staff.filter(s => s.status === "active").length} accent="#7A8C6E" />
                <StatCard label="Off today" value={staff.filter(s => s.status === "off").length} accent={C.muted} />
                <StatCard label="Roles" value={[...new Set(staff.map(s => s.role))].length} accent="#A8833F" />
            </div>

            <button
                onClick={openAdd}
                style={{
                    marginBottom: 20, padding: "9px 20px", borderRadius: 8,
                    background: C.brown, border: "none", color: C.white,
                    fontFamily: "'Playfair Display', serif", fontSize: 14,
                    fontWeight: 700, cursor: "pointer",
                }}
            >+ Add Staff Member</button>

            {/* Add/Edit form */}
            {showForm && (
                <div style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: "20px 24px", marginBottom: 24,
                    borderTop: `3px solid ${C.gold}`,
                }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>
                        {editing ? "Edit Staff Member" : "Add New Staff Member"}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>First Name</label>
                            <input style={inp} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Céline" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Last Name</label>
                            <input style={inp} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Moreau" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Role</label>
                            <input style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Head Baker" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Shift</label>
                            <input style={inp} value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))} placeholder="05:00 – 13:00" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Phone</label>
                            <input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Status</label>
                            <select
                                style={{ ...inp, marginBottom: 0 }}
                                value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                            >
                                <option value="active">Active</option>
                                <option value="off">Off</option>
                            </select>
                        </div>
                    </div>

                    {formError && <div style={{ fontSize: 12, color: C.danger, marginTop: 8 }}>{formError}</div>}

                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button
                            onClick={handleSave} disabled={saving}
                            style={{
                                padding: "9px 22px", borderRadius: 8, background: C.brown,
                                border: "none", color: C.white, fontFamily: "'Playfair Display', serif",
                                fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1,
                            }}
                        >{saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}</button>
                        <button
                            onClick={() => setShowForm(false)}
                            style={{
                                padding: "9px 22px", borderRadius: 8, background: C.white,
                                border: `1px solid ${C.border}`, color: C.muted,
                                fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer",
                            }}
                        >Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <Spinner /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 14 }}>
                    {staff.length === 0 && (
                        <div style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>No staff members yet. Click "Add Staff Member" to get started.</div>
                    )}
                    {staff.map((s) => {
                        const on = s.status === "active"
                        return (
                            <div key={s._id} style={{
                                background: C.white, border: `1px solid ${C.border}`,
                                borderRadius: 12, padding: "14px 16px",
                                display: "flex", gap: 12, alignItems: "flex-start",
                                borderLeft: `4px solid ${on ? C.success : C.border}`,
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: on ? "#EAF3DE" : C.blush,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "'Playfair Display', serif", fontSize: 13,
                                    fontWeight: 700, color: on ? "#27500A" : C.muted, flexShrink: 0,
                                }}>
                                    {`${s.firstName[0]}${s.lastName[0]}`}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{s.firstName} {s.lastName}</div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                                            textTransform: "uppercase",
                                            background: on ? "#EAF3DE" : C.blush,
                                            color: on ? "#27500A" : C.muted,
                                        }}>{s.status}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: C.gold, fontWeight: 500, marginBottom: 4 }}>{s.role}</div>
                                    <div style={{ fontSize: 11, color: C.muted }}>⏰ {s.shift}</div>
                                    <div style={{ fontSize: 11, color: C.muted }}>📞 {s.phone}</div>
                                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                        <button
                                            onClick={() => openEdit(s)}
                                            style={{
                                                padding: "4px 12px", borderRadius: 6, fontSize: 11,
                                                border: `1px solid ${C.border}`, background: C.white,
                                                color: C.charcoal, cursor: "pointer", fontFamily: "Inter, sans-serif",
                                            }}
                                        >Edit</button>
                                        <button
                                            onClick={() => handleDelete(s._id)}
                                            disabled={deleting === s._id}
                                            style={{
                                                padding: "4px 12px", borderRadius: 6, fontSize: 11,
                                                border: `1px solid #FCEBEB`, background: "#FCEBEB",
                                                color: C.danger, cursor: "pointer", fontFamily: "Inter, sans-serif",
                                                opacity: deleting === s._id ? 0.5 : 1,
                                            }}
                                        >{deleting === s._id ? "…" : "Remove"}</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ─── Main Dashboard Shell ─────────────────────────────────────────────────────
const NAV = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "orders", label: "Orders", icon: "📦" },
    { key: "products", label: "Products", icon: "🥐" },
    { key: "customers", label: "Customers", icon: "👥" },
    { key: "staff", label: "Staff", icon: "👨‍🍳" },
];

export default function AdminDashboard() {
    const [token, setToken] = useState(() => sessionStorage.getItem("fc_admin_token") || null);
    const [section, setSection] = useState("overview");

    const handleLogin = (t) => setToken(t);
    const handleLogout = () => {
        sessionStorage.removeItem("fc_admin_token");
        setToken(null);
    };

    if (!token) return <LoginScreen onLogin={handleLogin} />;

    return (
        <>
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Orders</p>
                        <p className="font-[Playfair_Display] text-[36px] font-bold text-[#3b2314]">
                            {analytics.total.orders}
                        </p>
                        <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                            +{analytics.today.orders} today
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Customers</p>
                        <p className="font-[Playfair_Display] text-[36px] font-bold text-[#3b2314]">
                            {analytics.total.customers}
                        </p>
                        <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                            +{analytics.today.customers} today
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Sales</p>
                        <p className="font-[Playfair_Display] text-[36px] font-bold text-[#3b2314]">
                            £{analytics.total.sales.toFixed(2)}
                        </p>
                        <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                            +£{analytics.today.sales.toFixed(2)} today
                        </span>
                    </div>

                </div>
            )}

            
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
            <div style={{ display: "flex", minHeight: "100vh", background: C.cream }}>

                {/* Sidebar */}
                <aside style={{ width: 210, background: C.charcoal, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
                    <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", color: C.gold, fontSize: 17, fontWeight: 700 }}>Farine & Co.</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Admin Panel</div>
                    </div>
                    <nav style={{ flex: 1, padding: "10px 8px" }}>
                        {NAV.map(item => (
                            <button key={item.key} onClick={() => setSection(item.key)} style={{
                                display: "flex", alignItems: "center", gap: 10, width: "100%",
                                padding: "9px 12px", borderRadius: 8, border: "none",
                                background: section === item.key ? "rgba(201,169,110,0.12)" : "transparent",
                                color: section === item.key ? C.gold : "rgba(255,255,255,0.45)",
                                fontSize: 13, fontFamily: "Inter, sans-serif",
                                fontWeight: section === item.key ? 600 : 400,
                                cursor: "pointer", marginBottom: 2, textAlign: "left",
                                borderLeft: `3px solid ${section === item.key ? C.gold : "transparent"}`,
                            }}>
                                <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
                            </button>
                        ))}
                    </nav>
                    <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <button onClick={handleLogout} style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%",
                            padding: "8px 12px", borderRadius: 8, border: "none",
                            background: "transparent", color: "rgba(255,255,255,0.3)",
                            fontSize: 12, fontFamily: "Inter, sans-serif", cursor: "pointer",
                        }}>🚪 Sign out</button>
                    </div>
                </aside>

                {/* Main content */}
                <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.charcoal }}>
                                {NAV.find(n => n.key === section)?.label}
                            </div>
                            <div style={{ fontSize: 12, color: C.muted }}>
                                {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 12px 5px 5px" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: C.white }}>A</div>
                            <span style={{ fontSize: 12, color: C.charcoal, fontWeight: 500 }}>Admin</span>
                        </div>
                    </div>

                    {section === "overview" && <Overview token={token} />}
                    {section === "orders" && <Orders token={token} />}
                    {section === "products" && <Products token={token} />}
                    {section === "customers" && <Customers token={token} />}
                    {section === "staff" && <Staff token={token} />}
                </main>
            </div>
        </>
    );
}
