import React, { useState, useEffect } from "react";

/**
 * [UPDATED] - Visually enhanced Verify UI for VeriChain frontend.
 * - Modern, secure "blockchain digilocker" aesthetic.
 * - Dark mode with a new color palette, animations, and SVG icons.
 * - Verifies a 64-hex-string (SHA-256) hash.
 * - All styles are embedded to keep it a single, self-contained file.
 */

// --- SVG Icons ---
// I've added these as components to make the JSX cleaner.

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vc-status-icon">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAlertTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vc-status-icon">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vc-status-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const IconSpinner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vc-status-icon vc-spinner">
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

const IconPaste = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconClear = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Main Component ---

export default function Verify() {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | valid | invalid
  const [copied, setCopied] = useState(false);

  // Note: The original 'pulsing' state wasn't used,
  // so I've added a CSS-based pulse for the 'valid' state instead.

  function isProbablySha256(h) {
    // basic check: 64 hex chars
    return /^[0-9a-fA-F]{64}$/.test(h.trim());
  }

  async function doVerify() {
    if (!hash.trim()) {
      setStatus("invalid"); // Treat empty as invalid
      return;
    }
    setStatus("checking");
    // simulate backend response time
    await new Promise((r) => setTimeout(r, 1200));
    if (isProbablySha256(hash)) {
      setStatus("valid");
    } else {
      setStatus("invalid");
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setHash(text);

      // Automatically verify after pasting
      if (!text.trim()) {
        setStatus("invalid"); // Set to invalid if pasted text is empty
        return;
      }

      setStatus("checking");
      await new Promise((r) => setTimeout(r, 1200)); // simulate backend response time
      if (isProbablySha256(text)) {
        setStatus("valid");
        } else {
          setStatus("invalid");
        }
    } catch {
      // ignore clipboard read errors
      console.error("Failed to read from clipboard.");
    }
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
      setCopied(message); // Set specific copied message
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      setCopied("Failed to copy");
      setTimeout(() => setCopied(false), 2000);
    }

    document.body.removeChild(textArea);
  }

  function copyResult() {
    let text;
    if (status === "valid") text = `VeriChain: AUTHENTIC — ${hash}`;
    else if (status === "invalid") text = `VeriChain: NOT FOUND — ${hash}`;
    else text = `VeriChain: ${status}`;

    copyToClipboard(text, "Result copied ✓");
  }

  function copyHash() {
    if (hash) {
      copyToClipboard(hash, "Hash copied ✓");
    }
  }

  function clearAll() {
    setHash("");
    setStatus("idle");
  }

  const embeddedCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    :root {
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

      --color-bg-deep: #0D1127;
      --color-bg-main: #111827; /* Tailwind gray-900 */
      --color-bg-card: rgba(31, 41, 55, 0.5); /* Tailwind gray-800 */
      --color-border: rgba(255, 255, 255, 0.08);
      --color-shadow: rgba(0, 0, 0, 0.3);

      --color-text-primary: #F3F4F6; /* Tailwind gray-100 */
      --color-text-secondary: #9CA3AF; /* Tailwind gray-400 */
      --color-text-tertiary: #6B7280; /* Tailwind gray-500 */

      --color-brand: #4F46E5; /* Tailwind indigo-600 */
      --color-brand-hover: #6366F1; /* Tailwind indigo-500 */
      --color-brand-glow: rgba(79, 70, 229, 0.5);

      --color-success: #10B981; /* Tailwind emerald-500 */
      --color-success-bg: rgba(16, 185, 129, 0.1);
      --color-success-glow: rgba(16, 185, 129, 0.4);
      --color-success-text: #A7F3D0;

      --color-error: #EF4444; /* Tailwind red-500 */
      --color-error-bg: rgba(239, 68, 68, 0.1);
      --color-error-glow: rgba(239, 68, 68, 0.4);
      --color-error-text: #FECACA;

      --color-idle: var(--color-text-tertiary);
      --color-idle-bg: rgba(107, 114, 128, 0.1);
      --color-idle-glow: rgba(107, 114, 128, 0.2);

      --color-checking: #F59E0B; /* Tailwind amber-500 */
      --color-checking-bg: rgba(245, 158, 11, 0.1);
      --color-checking-glow: rgba(245, 158, 11, 0.4);
      --color-checking-text: #FDE68A;

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;

      --transition-fast: all 0.15s ease-out;
      --transition-slow: all 0.3s ease-out;
    }

    /* General Wrapper */
    .vc-verify-wrapper {
      padding: 3rem 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      min-height: 100vh;
      width: 100%;
      font-family: var(--font-main);
      background: linear-gradient(170deg, var(--color-bg-deep) 0%, #080a1a 100%);
      color: var(--color-text-primary);
      position: relative;
      overflow: hidden;
    }

    /* Background Aurora Effect */
    .vc-verify-wrapper::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 800px;
      height: 800px;
      background-image: radial-gradient(circle, var(--color-brand-glow) 0%, transparent 60%);
      transform: translate(-50%, -50%);
      opacity: 0.3;
      filter: blur(100px);
      animation: vc-aurora 15s infinite ease-in-out;
      z-index: 0;
    }

    /* Main Card */
    .vc-verify-card {
      width: 100%;
      max-width: 980px;
      border-radius: var(--radius-lg);
      padding: 0;
      background: rgba(17, 24, 39, 0.6); /* Tailwind gray-900 */
      border: 1px solid var(--color-border);
      box-shadow: 0 28px 64px var(--color-shadow), 0 0 0 1px rgba(67, 97, 255, 0.05);
      animation: vc-appear .4s ease-out;
      z-index: 1;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden; /* To contain header/footer */
    }

    .vc-card-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .vc-card-header .vc-title {
      font-weight: 800;
      font-size: 1.5rem;
      line-height: 1;
    }
    .vc-card-header .vc-sub {
      color: var(--color-text-secondary);
      font-size: 1rem;
      line-height: 1;
      margin-top: 4px;
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

    @keyframes vc-aurora {
      0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.2; }
      50% { transform: translate(-45%, -55%) scale(1.2) rotate(180deg); opacity: 0.4; }
      100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.2; }
    }

    /* Main Grid Layout */
    .vc-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
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
      .vc-card-header { padding: 1rem 1.5rem; }
      .vc-card-header .vc-title { font-size: 1.25rem; }
      .vc-card-header .vc-sub { font-size: 0.875rem; }
    }

    /* Blocks & Sections */
    .vc-block {
      padding: 1.5rem;
      border-radius: var(--radius-md);
      background: rgba(0,0,0,0.15);
      border: 1px solid var(--color-border);
      transition: var(--transition-slow);
    }
    .vc-block + .vc-block {
      margin-top: 1.5rem;
    }
    .vc-block-title {
      font-weight: 700;
      font-size: 1.125rem;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
    }

    /* Input & Actions */
    .vc-input-label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .vc-input {
      width: 100%;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: rgba(0,0,0,0.2);
      color: var(--color-text-primary);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 1rem;
      transition: var(--transition-fast);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) inset;
    }
    .vc-input:focus {
      outline: none;
      border-color: var(--color-brand);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
    }

    .vc-actions {
      display: flex;
      gap: 10px;
      margin-top: 1rem;
      flex-wrap: wrap;
      position: relative;
    }

    .vc-btn {
      padding: 10px 16px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.95rem;
      font-family: var(--font-main);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: var(--transition-fast);
    }
    .vc-btn.primary {
      background: var(--color-brand);
      color: #fff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    }
    .vc-btn.primary:hover {
      background: var(--color-brand-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
    }
    .vc-btn.primary[disabled] {
      background: var(--color-text-tertiary);
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .vc-btn.secondary {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      box-shadow: none;
    }
    .vc-btn.secondary:hover {
      background: rgba(255,255,255,0.1);
      color: var(--color-text-primary);
      border-color: rgba(255,255,255,0.15);
      transform: translateY(-2px);
    }

    .vc-copy-note {
      color: var(--color-success);
      font-weight: 700;
      font-size: 0.875rem;
      opacity: 0;
      transform: translateY(4px);
      transition: var(--transition-slow);
      position: absolute;
      right: 0;
      bottom: -24px;
    }
    .vc-copy-note.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Verification Log */
    .vc-log-entry {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
    .vc-log-entry .status-valid { color: var(--color-success-text); font-weight: 600; }
    .vc-log-entry .status-invalid { color: var(--color-error-text); font-weight: 600; }
    .vc-log-entry .status-checking { color: var(--color-checking-text); font-weight: 600; }
    .vc-log-entry .log-hash { color: var(--color-text-tertiary); word-break: break-all; }

    /* --- Right Column: Status & QR --- */

    /* Status Panel */
    .vc-status-panel {
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 200px;
      border: 1px solid var(--color-border);
      background: var(--color-idle-bg);
      box-shadow: 0 0 0 3px var(--color-idle-glow) inset;
      transition: var(--transition-slow);
    }

    .vc-status-icon {
      width: 48px;
      height: 48px;
      opacity: 0.8;
      transition: var(--transition-slow);
    }

    .vc-spinner {
      animation: vc-spin 1.2s linear infinite;
    }
    @keyframes vc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .vc-status-title {
      font-size: 1.75rem;
      font-weight: 800;
      margin-top: 1rem;
      transition: var(--transition-slow);
    }
    .vc-status-hash {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      word-break: break-all;
      margin-top: 0.5rem;
      line-height: 1.5;
      max-height: 60px;
      overflow-y: auto;
    }

    /* Status Panel States */
    .vc-status-panel.idle {
      background: var(--color-idle-bg);
      border-color: var(--color-border);
      box-shadow: 0 0 0 0 var(--color-idle-glow) inset;
    }
    .vc-status-panel.idle .vc-status-icon { color: var(--color-idle); }
    .vc-status-panel.idle .vc-status-title { color: var(--color-text-secondary); }

    .vc-status-panel.checking {
      background: var(--color-checking-bg);
      border-color: var(--color-checking);
      box-shadow: 0 0 0 2px var(--color-checking-glow) inset;
    }
    .vc-status-panel.checking .vc-status-icon { color: var(--color-checking); }
    .vc-status-panel.checking .vc-status-title { color: var(--color-checking-text); }

    .vc-status-panel.valid {
      background: var(--color-success-bg);
      border-color: var(--color-success);
      box-shadow: 0 0 0 2px var(--color-success-glow) inset, 0 8px 30px -10px var(--color-success-glow);
      animation: vc-pulse-glow 1.5s infinite ease-in-out;
    }
    .vc-status-panel.valid .vc-status-icon { color: var(--color-success); }
    .vc-status-panel.valid .vc-status-title { color: var(--color-success); }

    .vc-status-panel.invalid {
      background: var(--color-error-bg);
      border-color: var(--color-error);
      box-shadow: 0 0 0 2px var(--color-error-glow) inset;
    }
    .vc-status-panel.invalid .vc-status-icon { color: var(--color-error); }
    .vc-status-panel.invalid .vc-status-title { color: var(--color-error); }

    @keyframes vc-pulse-glow {
      0% { box-shadow: 0 0 0 2px var(--color-success-glow) inset, 0 8px 30px -10px var(--color-success-glow); }
      50% { box-shadow: 0 0 0 4px var(--color-success-glow) inset, 0 8px 40px -8px var(--color-success-glow); }
      100% { box-shadow: 0 0 0 2px var(--color-success-glow) inset, 0 8px 30px -10px var(--color-success-glow); }
    }

    /* Status Actions */
    .vc-status-actions {
      display: flex;
      gap: 10px;
      margin-top: 1.5rem;
      width: 100%;
    }
    .vc-status-actions .vc-btn {
      flex: 1;
    }

    /* Simulated QR Code */
    .vc-qr-block {
      background: #fff;
      border-radius: var(--radius-md);
      padding: 1rem;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      border: 4px solid var(--color-border);
    }
    .vc-qr-text {
      font-weight: 800;
      color: #000;
      z-index: 2;
      background: rgba(255,255,255,0.8);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      backdrop-filter: blur(5px);
    }
    .vc-qr-scanner {
      display: none; /* Hidden by default */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--color-success);
      box-shadow: 0 0 15px 2px var(--color-success);
      z-index: 3;
      animation: vc-qr-scan 2.5s infinite ease-out;
    }

    /* Show scanner line only when valid */
    .vc-status-panel.valid + .vc-block .vc-qr-scanner {
      display: block;
    }
    .vc-status-panel.valid + .vc-block .vc-qr-block {
      border-color: var(--color-success);
    }

    .vc-status-panel.invalid + .vc-block .vc-qr-block {
      border-color: var(--color-error);
    }

    @keyframes vc-qr-scan {
      0% { top: 0; }
      50% { top: 100%; }
      100% { top: 0; }
    }

  `;

  const getStatusContent = () => {
    switch (status) {
      case "valid":
        return {
          icon: <IconCheckCircle />,
          title: "Authentic",
          className: "valid"
        };
      case "invalid":
        return {
          icon: <IconAlertTriangle />,
          title: "Not Found",
          className: "invalid"
        };
      case "checking":
        return {
          icon: <IconSpinner />,
          title: "Verifying...",
          className: "checking"
        };
      default: // idle
        return {
          icon: <IconInfo />,
          title: "Awaiting Input",
          className: "idle"
        };
    }
  };

  const { icon, title, className } = getStatusContent();

  return (
    <div className="vc-verify-wrapper">
      <style>{embeddedCSS}</style>

      <div className="vc-verify-card" role="region" aria-label="Verify document hash">

        <div className="vc-card-header">
          <IconShield />
          <div>
            <div className="vc-title">VeriChain DigiLocker</div>
            <div className="vc-sub">Verify Document Authenticity</div>
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

            {/* --- Left Column: Input & Log --- */}
            <div>
              <div className="vc-block">
                <label className="vc-input-label" htmlFor="hash-input">SHA-256 Hash</label>
                <input
                  id="hash-input"
                  className="vc-input"
                  placeholder="Paste a 64-character hash to verify..."
                  value={hash}
                  onChange={(e) => setHash(e.g.target.value)}
                  aria-label="Hash input"
                />

                <div className="vc-actions">
                  <button
                    className="vc-btn primary"
                    onClick={doVerify}
                    disabled={status === "checking"}
                    aria-busy={status === "checking"}
                  >
                    {status === "checking" ? "Checking..." : "Verify"}
                  </button>
                  <button className="vc-btn secondary" onClick={pasteFromClipboard} title="Paste from clipboard">
                    <IconPaste />
                  </button>
                  <button className="vc-btn secondary" onClick={clearAll} title="Clear input">
                    <IconClear />
                  </button>
                  <div style={{ marginLeft: "auto", position: "relative" }}>
                    <div className={`vc-copy-note ${copied ? "show" : ""}`}>{copied}</div>
                  </div>
                </div>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Verification Log</div>
                <div className="vc-log-entry">
                  {status === "idle" && <span style={{ color: "var(--color-text-tertiary)"}}>Awaiting hash input...</span>}
                  {status === "checking" && (
                    <>
                      <span className="status-checking">[CHECKING]</span> Verifying hash:
                      <div className="log-hash">{hash}</div>
                    </>
                  )}
                  {status === "valid" && (
                    <>
                      <span className="status-valid">[AUTHENTIC]</span> Hash verified.
                      <div className="log-hash">{hash}</div>
                    </>
                  )}
                  {status === "invalid" && (
                    <>
                      <span className="status-invalid">[NOT FOUND]</span> Hash is invalid or not found.
                      <div className="log-hash">{hash || "(No hash provided)"}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* --- Right Column: Status & Proof --- */}
            <div>
              <div className={`vc-status-panel ${className}`}>
                {icon}
                <div className="vc-status-title">{title}</div>
                <div className="vc-status-hash">
                  {hash ? hash : "No hash provided"}
                </div>
                <div className="vc-status-actions">
                  <button className="vc-btn secondary" onClick={copyHash} disabled={!hash}>
                    <IconCopy /> Copy Hash
                  </button>
                  <button className="vc-btn secondary" onClick={copyResult} disabled={status === 'idle' || status === 'checking'}>
                    <IconCopy /> Copy Result
                  </button>
                </div>
              </div>

              <div className="vc-block" style={{marginTop: "1.5rem"}}>
                <div className="vc-block-title">Digital Proof</div>
                <div className="vc-qr-block">
                  <div className="vc-qr-scanner"></div>
                  <div className="vc-qr-text">
                    {status === 'valid' && "PROOF: AUTHENTIC"}
                    {status === 'invalid' && "PROOF: NOT FOUND"}
                    {status === 'checking' && "GENERATING..."}
                    {status === 'idle' && "AWAITING HASH"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="vc-card-footer">
          VeriChain — Secure Verification Interface
        </div>
      </div>
    </div>
  );
}
