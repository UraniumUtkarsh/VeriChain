// frontend/src/components/Dashboard/DocItem.jsx
import React from "react";

export default function DocItem({ doc, onRevoke }) {
  const name = doc.name || doc.fileName || "Unnamed document";
  const fullHash = doc.hash || doc.data || "";
  const shortHash = fullHash ? `${fullHash.slice(0, 12)}${fullHash.length > 12 ? "…" : ""}` : "—";
  const tx = doc.tx_hash || doc.txHash || "";

  function handleRevoke() {
    if (!onRevoke) return;
    const ok = window.confirm(`Revoke "${name}"?\nThis will mark the document as revoked on-chain (if backend supports it).`);
    if (ok) onRevoke(doc);
  }

  return (
    <div className="doc-item card" role="group" aria-label={`Document ${name}`}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="doc-name" title={name} style={{ fontWeight: 700 }}>{name}</div>
        <div className="doc-hash meta" style={{ marginTop: 6 }}>
          <strong>Hash:</strong> <span className="code" style={{ marginLeft: 6 }}>{shortHash}</span>
        </div>
        {tx && (
          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            tx: <a href={`https://etherscan.io/tx/${tx}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>{tx.slice(0,10)}…</a>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {fullHash ? (
          <a
            className="btn"
            href={`https://etherscan.io/search?q=${encodeURIComponent(fullHash)}`}
            target="_blank"
            rel="noreferrer"
            title="Search hash (Etherscan)"
          >
            View
          </a>
        ) : null}

        {onRevoke ? (
          <button
            className="btn warn"
            onClick={handleRevoke}
            title="Revoke this document"
            aria-label={`Revoke ${name}`}
          >
            Revoke
          </button>
        ) : null}
      </div>
    </div>
  );
}
