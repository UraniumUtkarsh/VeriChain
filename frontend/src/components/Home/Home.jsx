// src/components/Home/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container grid-2" style={{ alignItems: "center", paddingTop: "3.2rem" }}>
      <div>
        <h1 style={{ marginTop: 0 }}>VeriChain DigiLocker</h1>
        <p className="meta" style={{ maxWidth: 650 }}>
          Securely store document hashes on the blockchain. Verify authenticity, revoke documents,
          and optionally attach IPFS CIDs. Wallet-based multi-user flow (MetaMask).
        </p>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <Link className="btn primary" to="/upload">Upload Document</Link>
          <Link className="btn ghost" to="/verify">Verify Hash</Link>
          <Link className="btn linkish" to="/dashboard">Your Dashboard</Link>
        </div>

        <ul style={{ marginTop: "1.2rem" }}>
          <li>✅ Multi-user (MetaMask)</li>
          <li>✅ Store file hash & ownership</li>
          <li>✅ Retrieve documents per wallet</li>
          <li>✅ Optional IPFS storage via CID</li>
        </ul>
      </div>

      <aside>
        <div className="card" style={{ maxWidth: 420 }}>
          <h3 style={{ margin: 0 }}>Quick Info</h3>
          <div className="meta mt-1">
            <div><strong>Wallet:</strong> Connect to view docs</div>
            <div><strong>Upload:</strong> Click Upload to compute SHA-256</div>
            <div><strong>Verify:</strong> Paste hash to verify authenticity</div>
          </div>
          <div className="meta mt-2">Ready to connect your backend & smart contract</div>
        </div>
      </aside>
    </div>
  );
}
