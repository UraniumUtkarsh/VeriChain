// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/*
  VeriChain Dashboard - Single-file component
  - Paste into src/components/Dashboard/Dashboard.jsx
  - Uses VITE_API_BASE_URL from .env.local or falls back to http://127.0.0.1:5000
*/

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | fetching | ready | error
  const [message, setMessage] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [themeAccent, setThemeAccent] = useState("#646cff"); // small interactive color picker

  useEffect(() => {
    // try to auto-detect MetaMask
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
    }
  }, []);

  useEffect(() => {
    // small UX: clear message after a while
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 4200);
    return () => clearTimeout(t);
  }, [message]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask not found. Install MetaMask and try again.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      setMessage("Wallet connected");
    } catch (err) {
      setMessage("Wallet connect cancelled");
    }
  };

  const fetchDocuments = async () => {
    if (!wallet) {
      setMessage("Enter or connect your wallet address first.");
      return;
    }
    setStatus("fetching");
    setMessage("Fetching documents…");
    try {
      // backend expects { wallet: userWallet } per spec screenshots
      const res = await axios.post(`${API_BASE}/retrieve`, { wallet });
      // backend may return { stored_data: "..." } or an array; normalize:
      let payload = res.data;
      let items = [];
      if (Array.isArray(payload)) items = payload;
      else if (payload?.documents) items = payload.documents;
      else if (payload?.stored_data) {
        // older single-value API; wrap
        items = [{ name: "retrieved-data", hash: payload.stored_data }];
      } else if (payload?.data) {
        items = [{ name: "data", hash: payload.data }];
      } else {
        // if it's an object keyed by hashes: attempt to flatten
        if (typeof payload === "object") {
          items = Object.entries(payload).map(([k, v]) => (v && typeof v === "object" ? v : { hash: v ?? k, name: k }));
        }
      }

      // basic normalization
      items = items.map((it) => ({
        name: it.name || it.fileName || it.file || "Unnamed",
        hash: it.hash || it.data || it.tx_hash || it.stored_data || it,
        tx_hash: it.tx_hash || it.tx || null,
        revoked: !!it.revoked,
      }));

      setDocs(items);
      setStatus("ready");
      setMessage(items.length ? `Loaded ${items.length} document(s)` : "No documents found");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to fetch documents (backend unreachable or error).");
      setDocs([]);
    }
  };

  const revokeDoc = async (doc) => {
    if (!wallet) {
      setMessage("Connect wallet before revoking.");
      return;
    }
    if (!doc?.hash) {
      setMessage("Invalid document selected.");
      return;
    }
    if (!confirm(`Revoke document "${doc.name}"?\nThis marks the file as revoked on the chain/backend.`)) return;

    setRevoking(true);
    setMessage("Sending revoke request…");
    try {
      const res = await axios.post(`${API_BASE}/revoke`, { wallet, hash: doc.hash });
      setMessage(res?.data?.message || "Revoke request submitted");
      // optimistic UI update: mark revoked
      setDocs((prev) => prev.map((d) => (d.hash === doc.hash ? { ...d, revoked: true } : d)));
    } catch (err) {
      console.error(err);
      setMessage("Failed to revoke document.");
    } finally {
      setRevoking(false);
    }
  };

  // mini UI helpers
  const short = (s = "", n = 12) => (s ? `${s.slice(0, n)}${s.length > n ? "…" : ""}` : "—");

  return (
    <div className="dashboard-root page-container">
      {/* Scoped styles so you don't need to edit index.css */}
      <style>{`
        .dashboard-root { max-width: 1100px; margin: 1.25rem auto; padding: 0 1rem; }
        .panel { padding: 1rem 1.25rem; border-radius: 12px; background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005)); border:1px solid rgba(255,255,255,0.03); box-shadow: 0 14px 36px rgba(2,6,23,0.45); }
        .hdr { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:0.75rem; }
        .hdr-left h3 { margin:0; font-size:1.15rem; font-weight:800; color:var(--text); }
        .hdr-left p { margin:0; color:var(--muted); font-size:0.92rem; }
        .controls { display:flex; gap:8px; align-items:center; }
        .input-wallet { padding:0.55rem 0.8rem; background:transparent; border-radius:8px; border:1px solid rgba(255,255,255,0.03); color:var(--text); min-width:360px; }
        .btn { padding:0.55rem 0.9rem; border-radius:8px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:var(--text); font-weight:700; cursor:pointer; transition: all 180ms ease; }
        .btn.primary { background: linear-gradient(90deg, ${themeAccent}, #535bf2); color:#fff; border:none; box-shadow: 0 6px 20px rgba(83,91,242,0.18); }
        .btn.ghost { background: rgba(255,255,255,0.01); }
        .btn:active { transform: translateY(1px); }
        .meta { color: var(--muted); font-size:0.92rem; }

        .doc-list { margin-top:1rem; display:grid; gap:10px; }
        .doc { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 12px; border-radius:10px; background: linear-gradient(180deg, rgba(255,255,255,0.006), rgba(255,255,255,0.002)); border:1px solid rgba(255,255,255,0.02); }
        .doc-left { display:flex; gap:12px; align-items:center; min-width:0; }
        .doc-icon { width:48px; height:48px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#fff; box-shadow: 0 6px 18px rgba(2,6,23,0.45); }
        .doc-info { min-width:0; overflow:hidden; }
        .doc-name { font-weight:800; font-size:0.98rem; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .doc-meta { color:var(--muted); font-size:0.85rem; margin-top:4px; }

        .doc-actions { display:flex; gap:8px; align-items:center; }
        .small { font-size:0.85rem; padding:0.4rem 0.6rem; border-radius:8px; }

        /* animated status badge */
        .status-pill { padding:5px 8px; border-radius:999px; font-weight:700; font-size:0.82rem; }
        .ok { background: rgba(46,204,113,0.06); color:#2fe08a; border:1px solid rgba(46,204,113,0.05); }
        .revoked { background: rgba(255,82,82,0.06); color:#ff6b6b; border:1px solid rgba(255,82,82,0.06); }

        /* skeleton loader */
        .skeleton { height:12px; background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border-radius:6px; width:220px; animation: shimmer 1200ms linear infinite; }
        @keyframes shimmer { 0% { background-position: -200px 0 } 100% { background-position: 360px 0 } }

        /* responsive */
        @media (max-width: 880px) {
          .input-wallet { min-width: 180px; width:100%; }
          .hdr { flex-direction: column; align-items:flex-start; gap:10px; }
        }
      `}</style>

      <div className="panel">
        <div className="hdr">
          <div className="hdr-left">
            <h3>Quick Info</h3>
            <p className="meta">This is your dashboard. Connect MetaMask and enter your wallet address to fetch documents stored for your wallet.</p>
          </div>

          <div className="controls">
            <input
              placeholder="0x... (wallet address)"
              className="input-wallet"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              aria-label="wallet-input"
              title="Paste wallet address or use MetaMask connect"
            />

            <button className="btn ghost small" onClick={connectWallet} title="Connect MetaMask">
              Connect MetaMask
            </button>

            <button
              className={`btn primary small`}
              onClick={fetchDocuments}
              title="Fetch documents for wallet"
              disabled={status === "fetching"}
            >
              {status === "fetching" ? "Fetching…" : "Fetch Documents"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Your Documents</div>

          {/* message */}
          {message && <div style={{ marginBottom: 8, color: status === "error" ? "#ff6b6b" : "var(--muted)", fontWeight: 700 }}>{message}</div>}

          {/* empty state when ready */}
          {status === "ready" && docs.length === 0 && (
            <div className="doc meta">No documents found (or backend returned nothing).</div>
          )}

          {/* skeleton while fetching */}
          {status === "fetching" && (
            <div className="doc-list">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="doc" key={i}>
                  <div className="doc-left">
                    <div className="doc-icon" style={{ background: "linear-gradient(135deg,#2b2f3b,#1b2430)" }}>F</div>
                    <div className="doc-info">
                      <div className="skeleton" />
                      <div style={{ height: 8, marginTop: 8, width: "50%", background: "rgba(255,255,255,0.02)", borderRadius: 6 }} />
                    </div>
                  </div>
                  <div className="doc-actions">
                    <div className="skeleton" style={{ width: 64, height: 28, borderRadius: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* actual list */}
          {status !== "fetching" && docs.length > 0 && (
            <div className="doc-list" role="list">
              {docs.map((d, idx) => (
                <div className="doc" key={d.hash || idx} role="listitem">
                  <div className="doc-left">
                    <div
                      className="doc-icon"
                      style={{
                        background: `linear-gradient(135deg, ${themeAccent}, #2e3440)`,
                        minWidth: 48,
                      }}
                    >
                      {d.name?.[0]?.toUpperCase() || "D"}
                    </div>

                    <div className="doc-info">
                      <div className="doc-name" title={d.name}>
                        {d.name}
                      </div>
                      <div className="doc-meta">
                        <span style={{ marginRight: 12 }}>Hash: <strong style={{ fontFamily: "monospace" }}>{short(d.hash, 18)}</strong></span>
                        {d.tx_hash && <span>tx: {short(d.tx_hash, 12)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="doc-actions">
                    {d.revoked ? (
                      <div className="status-pill revoked small">Revoked</div>
                    ) : (
                      <div className="status-pill ok small">Active</div>
                    )}

                    <a
                      className="btn ghost small"
                      href={`https://etherscan.io/search?q=${encodeURIComponent(d.hash || "")}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open hash on Etherscan"
                    >
                      View
                    </a>

                    <button
                      className="btn small"
                      onClick={() => revokeDoc(d)}
                      disabled={revoking || d.revoked}
                      title={d.revoked ? "Already revoked" : "Revoke document"}
                    >
                      {revoking ? "Processing…" : d.revoked ? "Revoked" : "Revoke"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* small footer area inside panel for extras */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div className="meta">Backend endpoint: <code style={{ color: "var(--accent)", fontWeight: 700 }}>{API_BASE}/retrieve</code></div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div className="meta" style={{ marginRight: 6 }}>Accent:</div>
              {/* small color swatches to pick accent color (visual polish) */}
              {["#646cff","#10b981","#f59e0b","#ef4444"].map((c) => (
                <button
                  key={c}
                  onClick={() => setThemeAccent(c)}
                  title={`Accent ${c}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    border: themeAccent === c ? `2px solid rgba(255,255,255,0.12)` : "1px solid rgba(255,255,255,0.04)",
                    background: `linear-gradient(180deg, ${c}, rgba(0,0,0,0.18))`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <button
              className="btn ghost small"
              onClick={() => {
                setDocs([]);
                setStatus("idle");
                setMessage("Cleared local list (UI only).");
              }}
            >
              Clear UI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
