import React, { useState, useEffect } from "react";

/**
 * [UPGRADED] - Wallet.jsx
 * - This component is now wrapped in the global .page-wrapper
 * to fit perfectly into the main App.jsx layout.
 * - All component-specific styles are kept.
 * - All redundant CSS (like :root, @import) has been removed
 * as it is now provided by GlobalStyles in App.jsx.
 * - All of your static, frontend-only logic (simulateConnect,
 * activity feed, etc.) is 100% preserved.
 */

// --- SVG Icons ---

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"></path>
    <path d="M4 6v12h16v-4a2 2 0 0 0-2-2h-8a2 2 0 0 1-2-2v-4H4z"></path>
    <path d="M18 12a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"></path>
  </svg>
);

const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconSpinner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vc-spinner">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// Generates a simple, static SVG grid to look like a QR code
const FakeQR = () => {
  const size = 18;
  const pixels = Array(size * size).fill(0).map(() => (Math.random() > 0.5 ? 1 : 0));
  return (
    <svg viewBox="0 0 22 22" style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "4px", padding: "10px", boxSizing: "border-box" }}>
      {pixels.map((p, i) => (
        p ? <rect key={i} x={Math.floor(i / size)} y={i % size} width="1" height="1" fill="#111827" /> : null
      ))}
    </svg>
  );
};


// --- Main Component ---

const SHORT = (addr = "") => {
  if (!addr) return "—";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
};

export default function Wallet() {
  // wallet state
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [chainName, setChainName] = useState("—");
  const [actionMessage, setActionMessage] = useState(false); // For copy, etc.
  const [isSigning, setIsSigning] = useState(false);
  const [activityFeed, setActivityFeed] = useState([]);

  // --- "Live" Activity Feed Simulation ---
  useEffect(() => {
    let interval;
    if (connected) {
      // Start with one activity
      setActivityFeed([{
        id: Date.now(),
        text: `Connected to ${SHORT(address)}`,
        type: "connect"
      }]);

      interval = setInterval(() => {
        const type = Math.random() > 0.6 ? "tx" : "sign";
        const newItem = {
          id: Date.now(),
          text: type === "tx"
            ? `Received ${(Math.random() * 0.1).toFixed(4)} ETH`
            : `Signed Contract 0x...${Math.random().toString(16).slice(2, 6)}`,
          type: type
        };

        setActivityFeed(prev => [newItem, ...prev.slice(0, 4)]);
      }, 5000); // New activity every 5 seconds

    } else {
      setActivityFeed([]); // Clear on disconnect
    }

    return () => clearInterval(interval); // Cleanup interval
  }, [connected, address]); // Rerun when connection or address changes


  // connect a wallet
  function simulateConnect() {
    const fakeAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setAddress(fakeAddress);
    setConnected(true);
    setActionMessage(false);

    // Animate in the stats
    setBalance("...");
    setChainName("...");
    setTimeout(() => {
      setBalance((Math.random() * 2).toFixed(4) + " ETH");
      setChainName("Ethereum Mainnet");
    }, 600);
  }

  function simulateDisconnect() {
    setConnected(false);
    setAddress("");
    setBalance(null);
    setChainName("—");
  }

  // Use document.execCommand for better iFrame compatibility
  function copyToClipboard(text, message = "Copied ✓") {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Make it invisible
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setActionMessage(message);
      setTimeout(() => setActionMessage(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      setActionMessage("Failed to copy");
      setTimeout(() => setActionMessage(false), 2000);
    }

    document.body.removeChild(textArea);
  }

  function copyAddress() {
    if (address) {
      copyToClipboard(address, "Address Copied ✓");
    }
  }

  function refreshBalance() {
    if (!connected) return;
    setBalance("..."); // Set to loading
    setTimeout(() => {
      const newBalance = (Math.random() * 3).toFixed(4) + " ETH";
      setBalance(newBalance);
      setActionMessage("Balance Refreshed ✓");
      setTimeout(() => setActionMessage(false), 2000);
    }, 600); // Simulate fetch time
  }

  function simulateSign() {
    if (!connected || isSigning) {
      if (!connected) {
        setActionMessage("Connect first!");
        setTimeout(() => setActionMessage(false), 2000);
      }
      return;
    }

    setIsSigning(true);
    setActionMessage(false);

    setTimeout(() => {
      setIsSigning(false);
      setActionMessage("Message Signed (UI) ✓");
      setTimeout(() => setActionMessage(false), 2000);

      // Add to activity feed
      const newItem = {
        id: Date.now(),
        text: `Signed Message 0x...${Math.random().toString(16).slice(2, 6)}`,
        type: "sign"
      };
      setActivityFeed(prev => [newItem, ...prev.slice(0, 4)]);

    }, 1500); // Simulate signing time
  }

  // Component-specific styles
  const embeddedCSS = `
    /* * [UPGRADED] Component-Specific Styles
     * All global styles (:root, fonts, body, etc.) are
     * now inherited from GlobalStyles in App.jsx.
     */

    /* Main Card */
    .vc-wallet-card {
      width: 100%;
      /* Use global .glowing-card styles */
      /* max-width: 980px;
      border-radius: var(--radius-lg);
      padding: 0;
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid var(--color-border);
      box-shadow: 0 28px 64px var(--color-shadow), 0 0 0 1px rgba(67, 97, 255, 0.05);
      z-index: 1;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden; */
      animation: vc-appear .4s ease-out;
    }

    .vc-card-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .vc-header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .vc-header-brand .vc-title {
      font-weight: 800;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--color-text-primary);
    }
    .vc-header-brand .vc-sub {
      color: var(--color-text-secondary);
      font-size: 1rem;
      line-height: 1;
      margin-top: 4px;
    }

    .vc-status-display {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-radius: var(--radius-md);
      background: var(--color-idle-bg);
      border: 1px solid var(--color-border);
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      transition: var(--transition-slow);
    }

    .vc-status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-idle);
      box-shadow: 0 0 8px 0 var(--color-idle-glow);
      transition: var(--transition-slow);
    }

    .vc-status-display.connected {
      background: var(--color-success-bg);
      border-color: var(--color-success);
      color: var(--color-success-text);
    }

    .vc-status-display.connected .vc-status-indicator {
      background: var(--color-success);
      box-shadow: 0 0 10px 2px var(--color-success-glow);
      animation: vc-pulse-dot 1.5s infinite ease-in-out;
    }

    @keyframes vc-pulse-dot {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }

    .vc-card-body {
      padding: 2rem;
    }

    .vc-card-footer {
      padding: 1rem 2rem;
      text-align: center;
      color: var(--color-text-tertiary);
      font-size: 0.875rem;
      border-top: 1px solid var(--color-border);
      background: rgba(0,0,0,0.1);
    }

    @keyframes vc-appear {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Main Grid Layout */
    .vc-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }
    @media (max-width: 900px) {
      .vc-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
    @media (max-width: 600px) {
      .vc-card-body { padding: 1.5rem; }
      .vc-card-header { padding: 1rem 1.5rem; flex-direction: column; align-items: flex-start; }
      .vc-header-brand .vc-title { font-size: 1.25rem; }
      .vc-header-brand .vc-sub { font-size: 0.875rem; }
    }

    /* Blocks & Sections */
    .vc-block {
      /* Use global .glowing-card styles, but with less padding */
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      transition: var(--transition-slow);
    }
    .vc-block:hover {
      border-color: var(--color-border-heavy);
    }

    .vc-block + .vc-block {
      margin-top: 1.5rem;
    }
    .vc-block-title {
      font-weight: 700;
      font-size: 1.125rem;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Address Display */
    .vc-addr-display {
      width: 100%;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: rgba(0,0,0,0.2);
      color: var(--color-text-secondary);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) inset;
      line-height: 1.5;
      word-break: break-all;
    }
    .vc-addr-display.connected {
      color: var(--color-text-primary);
      border-color: var(--color-brand-blue);
      box-shadow: 0 0 0 3px var(--color-brand-glow-blue);
    }

    /* Actions */
    .vc-actions {
      display: flex;
      gap: 10px;
      margin-top: 1rem;
      flex-wrap: wrap;
      position: relative;
    }

    .vc-btn {
      /* Use global .glowing-btn styles */
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.95rem;
      gap: 8px;
    }

    .vc-btn.primary {
      /* Uses global .glowing-btn */
    }

    .vc-btn.danger {
      /* Uses global .glowing-btn */
      background: var(--color-error);
      box-shadow: 0 4px 12px var(--color-error-glow);
    }
    .vc-btn.danger::before {
      background: linear-gradient(120deg, var(--color-error), #F87171);
    }
    .vc-btn.danger::after {
      background: linear-gradient(120deg, var(--color-error), #F87171);
      filter: blur(20px);
    }
    .vc-btn.danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px var(--color-error-glow);
    }

    .vc-btn.secondary {
      /* Uses global .glowing-btn.secondary */
    }

    .vc-action-note {
      color: var(--color-success-text);
      font-weight: 700;
      font-size: 0.875rem;
      opacity: 0;
      transform: translateY(4px);
      transition: var(--transition-slow);
      position: absolute;
      right: 0;
      bottom: -24px;
    }
    .vc-action-note.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Info Stats */
    .vc-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--color-border);
      font-size: 0.95rem;
    }
    .vc-info-row:last-child {
      border-bottom: none;
    }
    .vc-info-row .label {
      color: var(--color-text-secondary);
    }
    .vc-info-row .value {
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      transition: var(--transition-slow);
      opacity: 1;
    }
    .vc-info-row .value.loading {
      opacity: 0.4;
    }
    .vc-info-row .value.connected {
      color: var(--color-success-text);
    }
    .vc-info-row .value.disconnected {
      color: var(--color-error-text);
    }

    /* Hint Text */
    .vc-hint {
      font-size: 0.875rem;
      color: var(--color-text-tertiary);
      margin-top: 1rem;
      line-height: 1.6;
    }

    /* --- Right Column: QR & Details --- */

    .vc-qr-block {
      background: rgba(255,255,255,0.05);
      border-radius: var(--radius-md);
      padding: 1rem;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-border);
    }
    .vc-qr-block.connected {
      border-color: var(--color-brand-blue);
      box-shadow: 0 0 0 3px var(--color-brand-glow-blue);
    }

    .vc-qr-inner {
      width: 170px;
      height: 170px;
      position: relative;
    }

    .vc-qr-text {
      font-weight: 800;
      color: var(--color-text-secondary);
      z-index: 2;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(17, 24, 39, 0.8);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      backdrop-filter: blur(5px);
      text-align: center;
      font-size: 0.9rem;
    }

    .vc-qr-scanner {
      display: none; /* Hidden by default */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--color-brand-cyan);
      box-shadow: 0 0 15px 2px var(--color-brand-glow-cyan);
      z-index: 3;
      animation: vc-qr-scan 2.5s infinite ease-out;
    }

    /* Show scanner line only when connected */
    .vc-qr-block.connected .vc-qr-scanner {
      display: block;
    }
    .vc-qr-block.connected .vc-qr-text {
      display: none; /* Hide text when connected */
    }
    .vc-qr-block:not(.connected) .vc-qr-inner {
      display: none; /* Hide QR when not connected */
    }

    @keyframes vc-qr-scan {
      0% { top: 0; }
      50% { top: 100%; }
      100% { top: 0; }
    }

    /* NEW: Activity Feed */
    .vc-activity-feed {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 200px;
      overflow-y: auto;
      padding-right: 10px; /* for scrollbar */
    }

    /* Custom scrollbar for feed */
    .vc-activity-feed::-webkit-scrollbar {
      width: 6px;
    }
    .vc-activity-feed::-webkit-scrollbar-track {
      background: var(--color-bg-medium);
      border-radius: 10px;
    }
    .vc-activity-feed::-webkit-scrollbar-thumb {
      background-color: var(--color-text-muted);
      border-radius: 10px;
    }

    .vc-activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      animation: vc-fade-in-item 0.5s ease-out;
    }

    @keyframes vc-fade-in-item {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .vc-activity-item .icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .vc-activity-item .icon.connect {
      background: var(--color-success-bg);
      color: var(--color-success);
    }
    .vc-activity-item .icon.tx {
      background: var(--color-brand-glow-blue);
      color: var(--color-brand-blue);
    }
    .vc-activity-item .icon.sign {
      background: var(--color-idle-bg);
      color: var(--color-idle);
    }

    .vc-activity-item .text {
      color: var(--color-text-secondary);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 0.85rem;
    }

    /* Spinner animation */
    .vc-spinner {
      animation: vc-spin 1.2s linear infinite;
    }
    @keyframes vc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  `;

  return (
    <div className="page-wrapper">
      <style>{embeddedCSS}</style>
      <div className="glowing-card vc-wallet-card" role="region" aria-label="Wallet panel">

        <div className="vc-card-header">
          <div className="vc-header-brand">
            <IconWallet />
            <div>
              <div className="vc-title">VeriChain Wallet</div>
              <div className="vc-sub">Connect your wallet to manage assets</div>
            </div>
          </div>

          <div className={`vc-status-display ${connected ? "connected" : ""}`} aria-live="polite">
            <div className="vc-status-indicator" />
            <div>{connected ? "Connected" : "Not Connected"}</div>
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

            {/* --- Left Column: Connection & Actions --- */}
            <div>
              <div className="vc-block">
                <div className="vc-block-title">Wallet Connection</div>
                <div className={`vc-addr-display ${connected ? "connected" : ""}`} title={address}>
                  {connected ? address : "—"}
                </div>

                <div className="vc-actions">
                  {connected ? (
                    <button className="glowing-btn danger vc-btn" onClick={simulateDisconnect}>
                      Disconnect
                    </button>
                  ) : (
                    <button className="glowing-btn primary vc-btn" onClick={simulateConnect}>
                      Connect Wallet
                    </button>
                  )}
                  <button className="glowing-btn secondary vc-btn" onClick={copyAddress} disabled={!connected}>
                    <IconCopy />
                  </button>
                  <button className="glowing-btn secondary vc-btn" onClick={refreshBalance} disabled={!connected || balance === '...'}>
                    <IconRefresh />
                  </button>
                  <div style={{ marginLeft: "auto", position: "relative" }}>
                    <div className={`vc-action-note ${actionMessage ? "show" : ""}`}>{actionMessage}</div>
                  </div>
                </div>

                <div className="vc-hint">
                  Wallet connection is managed by the application. Ensure you are connected to the correct network.
                </div>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Wallet Actions</div>
                <button
                  className="glowing-btn secondary vc-btn"
                  onClick={simulateSign}
                  disabled={isSigning || !connected}
                >
                  {isSigning ? <IconSpinner /> : <IconEdit />}
                  {isSigning ? "Signing..." : "Sign Message"}
                </button>
                <div className="vc-hint">
                  Perform wallet-based actions to prove ownership.
                </div>
              </div>
            </div>

            {/* --- Right Column: QR & Details --- */}
            <div>
              <div className={`vc-qr-block ${connected ? "connected" : ""}`} role="img" aria-label="Wallet QR code">
                <div className="vc-qr-text">
                  NOT CONNECTED
                </div>
                <div className="vc-qr-inner">
                  <div className="vc-qr-scanner"></div>
                  <FakeQR />
                </div>
              </div>

              <div className="vc-block" style={{marginTop: "1.5rem"}}>
                <div className="vc-block-title">Connection Details</div>
                <div className="vc-info-grid">
                  <div className="vc-info-row">
                    <span className="label">Chain</span>
                    <span className={`value ${chainName === '...' ? 'loading' : ''}`}>{chainName}</span>
                  </div>
                  <div className="vc-info-row">
                    <span className="label">Balance</span>
                    <span className={`value ${balance === '...' ? 'loading' : ''}`}>{balance ?? "—"}</span>
                  </div>
                    <div className="vc-info-row">
                    <span className="label">Status</span>
                    <span className={`value ${connected ? "connected" : "disconnected"}`}>
                      {connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- NEW: Live Activity Feed --- */}
          {connected && (
            <div className="vc-block" style={{marginTop: "1.5rem"}}>
              <div className="vc-block-title"><IconClock /> Recent Activity</div>
              <div className="vc-activity-feed">
                {activityFeed.length > 0 ? (
                  activityFeed.map(item => (
                    <div key={item.id} className="vc-activity-item">
                      <div className={`icon ${item.type}`}>
                        {item.type === 'connect' && '✓'}
                        {item.type === 'tx' && 'Ξ'}
                        {item.type === 'sign' && <IconEdit />}
                      </div>
                      <div className="text">{item.text}</div>
                    </div>
                  ))
                ) : (
                  <div style={{color: "var(--color-text-tertiary)", fontSize: "0.9rem"}}>No recent activity.</div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="vc-card-footer">
          VeriChain — Secure Wallet Interface
        </div>
      </div>
    </div>
  );
}
