import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

/**
 * [UPDATED] - Visually enhanced Upload UI for VeriChain frontend.
 * - Matches the modern, secure "blockchain digilocker" aesthetic.
 * - NEW: Features a "live" animated "Hashing Core" visual for computing.
 * - NEW: Modern file dropzone and consolidated, animated action buttons.
 * - All styles are embedded to keep it a single, self-contained file.
 */

// --- SVG Icons ---

const IconUploadCloud = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-success)" }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
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


// --- "Hashing Core" Visual Component ---

const HashingVisual = ({ status }) => (
  <div className={`vc-hashing-core ${status}`}>
    <div className="vc-core-ring vc-ring-1"></div>
    <div className="vc-core-ring vc-ring-2"></div>
    <div className="vc-core-ring vc-ring-3"></div>
    <div className="vc-core-center">
      <div className="vc-core-icon">
        {status === 'idle' && '⚡'}
        {status === 'computing' && <IconSpinner />}
        {status === 'ready' && '✓'}
        {status === 'stored' && '✓'}
        {status === 'error' && '✕'}
      </div>
    </div>
    <div className="vc-core-status-text">
      {status === 'idle' && "IDLE"}
      {status === 'computing' && "COMPUTING"}
      {status === 'ready' && "READY"}
      {status === 'stored' && "STORED"}
      {status === 'error' && "ERROR"}
    </div>
  </div>
);


// --- Main Upload Component ---

/* helper: convert ArrayBuffer -> hex string */
const bufToHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

// robust clipboard writer (navigator.clipboard fallback)
function copyToClipboard(text, callback) {
  if (!text) return;
  try {
    // Use document.execCommand for better iFrame compatibility
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Make it invisible
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');
    document.body.removeChild(textArea);
    callback(true);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    callback(false);
  }
}


export default function Upload() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("idle"); // idle | computing | ready | stored | error
  const [wallet, setWallet] = useState("");
  const [actionMessage, setActionMessage] = useState(false);
  const [isStoring, setIsStoring] = useState(false);

  const fileRef = useRef(null);
  // Vite env variables (import.meta.env) might show warnings in some dev environments.
  // Hardcoding the fallback URL to ensure compatibility.
  const API_BASE = "http://127.0.0.1:5000"; // Or use: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

  // auto-detect MetaMask if available
  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
    }
  }, []);

  // Timer for action messages
  useEffect(() => {
    if (actionMessage) {
      const t = setTimeout(() => setActionMessage(false), 2500);
      return () => clearTimeout(t);
    }
  }, [actionMessage]);


  const onChoose = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setHash("");
      setActionMessage(`File "${f.name}" selected.`);
      setStatus("idle");
    }
  };

  const clearFile = () => {
    setFile(null);
    setHash("");
    setActionMessage("Cleared.");
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
  }

  const computeHash = async () => {
    if (!file) {
      setActionMessage("Select a file first.");
      setStatus("error");
      return;
    }
    setStatus("computing");
    setActionMessage("Computing SHA-256...");
    try {
      const ab = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", ab);
      const hex = bufToHex(digest);

      // Simulate compute time for visual effect
      await new Promise(r => setTimeout(r, 1500));

      setHash(hex);
      setStatus("ready");
      setActionMessage("Hash computed successfully!");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setActionMessage("Failed to compute hash.");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setActionMessage("MetaMask not detected.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      setActionMessage("Wallet connected.");
    } catch (err) {
      setActionMessage("Wallet connection rejected.");
    }
  };

  const handleStore = async () => {
    if (!hash) {
      setActionMessage("Compute the hash before storing.");
      setStatus("error");
      return;
    }
    if (!wallet) {
      setActionMessage("Please connect your wallet first.");
      setStatus("error");
      return;
    }

    setIsStoring(true);
    setActionMessage("Sending to backend...");
    try {
      // This is where your friend's backend is called
      const res = await axios.post(`${API_BASE}/store`, {
        wallet,
        hash,
        name: file?.name || "unnamed",
      });
      setStatus("stored");
      setActionMessage(res?.data?.message || "Stored successfully!");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setActionMessage(err?.response?.data?.error || "Failed to store document.");
    } finally {
      setIsStoring(false);
    }
  };

  const handleCopy = () => {
    if (!hash) {
      setActionMessage("No hash to copy.");
      setStatus("error");
      return;
    }
    copyToClipboard(hash, (ok) => {
      if (ok) {
        setActionMessage("Hash copied to clipboard!");
      } else {
        setActionMessage("Copy failed. Please copy manually.");
      }
    });
  };

  const embeddedCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    :root {
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --color-bg-deep: #0D1127;
      --color-bg-main: #111827;
      --color-bg-card: rgba(31, 41, 55, 0.5);
      --color-border: rgba(255, 255, 255, 0.08);
      --color-shadow: rgba(0, 0, 0, 0.3);
      --color-text-primary: #F3F4F6;
      --color-text-secondary: #9CA3AF;
      --color-text-tertiary: #6B7280;
      --color-brand: #4F46E5;
      --color-brand-hover: #6366F1;
      --color-brand-glow: rgba(79, 70, 229, 0.5);
      --color-success: #10B981;
      --color-success-bg: rgba(16, 185, 129, 0.1);
      --color-success-glow: rgba(16, 185, 129, 0.4);
      --color-success-text: #A7F3D0;
      --color-error: #EF4444;
      --color-error-bg: rgba(239, 68, 68, 0.1);
      --color-error-glow: rgba(239, 68, 68, 0.4);
      --color-error-text: #FECACA;
      --color-idle: var(--color-text-tertiary);
      --color-idle-bg: rgba(107, 114, 128, 0.1);
      --color-idle-glow: rgba(107, 114, 128, 0.2);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --transition-fast: all 0.15s ease-out;
      --transition-slow: all 0.3s ease-out;
    }

    /* General Wrapper */
    .vc-upload-wrapper {
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
    .vc-upload-wrapper::before {
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
    .vc-upload-card {
      width: 100%;
      max-width: 980px;
      border-radius: var(--radius-lg);
      padding: 0;
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid var(--color-border);
      box-shadow: 0 28px 64px var(--color-shadow), 0 0 0 1px rgba(67, 97, 255, 0.05);
      animation: vc-appear .4s ease-out;
      z-index: 1;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden;
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Buttons */
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
      position: relative;
      overflow: hidden;
    }

    /* Base for gradient buttons (Compute, Store, Connect MetaMask) */
    .vc-btn.gradient-effect {
      background: linear-gradient(90deg, var(--initial-color-light) 0%, var(--initial-color-dark) 50%, var(--initial-color-light) 100%);
      background-size: 200% auto;
      color: var(--gradient-text-color, #fff);
      box-shadow: 0 4px 12px var(--shadow-color);
      transition: all 0.3s ease-out;
    }

    .vc-btn.gradient-effect:hover {
      background-position: right center; /* Slide the gradient */
      transform: translateY(-2px);
      box-shadow: 0 6px 16px var(--shadow-color);
    }

    /* Primary button (Compute SHA-256) */
    .vc-btn.primary {
      --initial-color-light: var(--color-brand-hover);
      --initial-color-dark: var(--color-brand);
      --shadow-color: rgba(79, 70, 229, 0.2);
    }

    .vc-btn.primary:hover {
      --shadow-color: rgba(79, 70, 229, 0.3);
    }

    /* Success button (Store on Blockchain) */
    .vc-btn.success-gradient {
      --initial-color-light: #34d399; /* Lighter green */
      --initial-color-dark: var(--color-success);
      --shadow-color: var(--color-success-glow);
      --gradient-text-color: #003622; /* Darker text for green */
    }

    .vc-btn.success-gradient:hover {
      --shadow-color: var(--color-success-glow);
    }

    /* Connect MetaMask button */
    .vc-btn.connect-metamask {
      --initial-color-light: #f59e0b; /* Orange-yellow for MetaMask */
      --initial-color-dark: #d97706;
      --shadow-color: rgba(217, 119, 6, 0.2);
      --gradient-text-color: #3f2000; /* Darker text for orange */
    }
    .vc-btn.connect-metamask:hover {
      --shadow-color: rgba(217, 119, 6, 0.3);
    }

    /* Secondary button (Clear, Copy Hash) */
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

    /* --- Shine Effect for Gradient Buttons --- */
    .vc-btn.gradient-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transform: skewX(-30deg);
      transition: all 0.5s ease;
    }
    .vc-btn.gradient-effect:hover::before {
      left: 150%;
      transition: all 0.4s ease-out;
    }
    /* --- End Shine Effect --- */


    .vc-btn[disabled] {
      opacity: 0.5;
      background: var(--color-text-tertiary) !important; /* Force disabled color */
      color: var(--color-bg-deep) !important;
      cursor: not-allowed;
      transform: none !important; /* Override hover transform */
      box-shadow: none !important; /* Override hover shadow */
      /* Also disable the shine effect for disabled buttons */
      &::before {
        display: none;
      }
    }

    /* File Dropzone */
    .vc-dropzone {
      border: 2px dotted var(--color-border); /* Changed from dashed for cleaner rendering */
      border-radius: var(--radius-md);
      padding: 1.5rem; /* Adjusted padding */
      text-align: center;
      background: rgba(0,0,0,0.1);
      cursor: pointer;
      transition: var(--transition-slow);
      display: flex; /* Added */
      flex-direction: column; /* Added */
      align-items: center; /* Added */
      justify-content: center; /* Added */
      min-height: 160px; /* Added */
    }
    .vc-dropzone:hover {
      border-color: var(--color-brand);
      background: rgba(79, 70, 229, 0.05);
    }
    .vc-dropzone-idle {
      /* display: flex;
      flex-direction: column;
      align-items: center;
      */ /* Removed, parent .vc-dropzone handles this */
      gap: 0.5rem;
      color: var(--color-text-secondary);
    }
    .vc-dropzone-selected {
      /* display: flex;
      flex-direction: column;
      align-items: center;
      */ /* Removed, parent .vc-dropzone handles this */
      gap: 0.75rem;
      color: var(--color-success-text);
    }
    .vc-dropzone-filename {
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 1rem;
      word-break: break-all;
    }

    /* Wallet Input */
    .vc-wallet-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: rgba(0,0,0,0.2);
      color: var(--color-text-primary);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 0.9rem;
      transition: var(--transition-fast);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) inset;
    }
    .vc-wallet-input:focus {
      outline: none;
      border-color: var(--color-brand);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
    }

    /* Hash Result Display */
    .vc-hash-display {
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
      min-height: 5em;
    }
    .vc-hash-display.ready,
    .vc-hash-display.stored {
      border-color: var(--color-success);
      color: var(--color-success-text);
      box-shadow: 0 0 0 3px var(--color-success-glow);
    }
    .vc-hash-display.error {
      border-color: var(--color-error);
      color: var(--color-error-text);
      box-shadow: 0 0 0 3px var(--color-error-glow);
    }

    /* Action Notification */
    .vc-action-note {
      min-height: 1.5em;
      margin-top: 1rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      transition: var(--transition-slow);
      opacity: 0;
      transform: translateY(5px);
    }
    .vc-action-note.show {
      opacity: 1;
      transform: translateY(0);
    }
    .vc-action-note.error {
      color: var(--color-error-text);
    }

    /* --- Hashing Core Visual --- */
    .vc-hashing-core {
      width: 100%;
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 50%;
      background: radial-gradient(circle, var(--color-idle-bg) 0%, transparent 70%);
      transition: var(--transition-slow);
    }
    .vc-core-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid var(--color-idle-glow);
      transition: var(--transition-slow);
    }
    .vc-ring-1 {
      width: 220px; height: 220px;
      border-style: dashed;
      animation: vc-spin 60s linear infinite reverse;
    }
    .vc-ring-2 {
      width: 180px; height: 180px;
      border-style: solid;
      animation: vc-spin 40s linear infinite;
    }
    .vc-ring-3 {
      width: 140px; height: 140px;
      border-style: dashed;
      animation: vc-spin 20s linear infinite reverse;
    }

    .vc-core-center {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px 5px var(--color-idle-glow) inset;
      transition: var(--transition-slow);
    }

    .vc-core-icon {
      font-size: 2.5rem;
      color: var(--color-idle);
      transition: var(--transition-slow);
    }
    .vc-core-icon .vc-spinner { width: 40px; height: 40px; }

    .vc-core-status-text {
      position: absolute;
      bottom: 20px;
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-idle);
      transition: var(--transition-slow);
    }

    /* Hashing Core: Computing State */
    .vc-hashing-core.computing {
      background: radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%);
    }
    .vc-hashing-core.computing .vc-core-ring {
      border-color: var(--color-brand);
      animation-duration: 2s; /* Speed up spin */
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    .vc-hashing-core.computing .vc-ring-1 { animation-duration: 2.5s; }
    .vc-hashing-core.computing .vc-ring-2 { animation-duration: 1.5s; }
    .vc-hashing-core.computing .vc-ring-3 { animation-duration: 2.2s; }

    .vc-hashing-core.computing .vc-core-center {
      box-shadow: 0 0 30px 10px var(--color-brand-glow) inset;
      animation: vc-pulse-glow-brand 1.2s infinite ease-in-out;
    }
    .vc-hashing-core.computing .vc-core-icon {
      color: var(--color-brand);
    }
    .vc-hashing-core.computing .vc-core-status-text {
      color: var(--color-brand);
    }

    /* Hashing Core: Ready/Stored State */
    .vc-hashing-core.ready,
    .vc-hashing-core.stored {
      background: radial-gradient(circle, var(--color-success-glow) 0%, transparent 70%);
    }
    .vc-hashing-core.ready .vc-core-ring,
    .vc-hashing-core.stored .vc-core-ring {
      border-color: var(--color-success);
    }
    .vc-hashing-core.ready .vc-core-center,
    .vc-hashing-core.stored .vc-core-center {
      box-shadow: 0 0 30px 10px var(--color-success-glow) inset;
      animation: vc-pulse-glow-success 1.8s infinite ease-in-out;
    }
    .vc-hashing-core.ready .vc-core-icon,
    .vc-hashing-core.stored .vc-core-icon {
      font-size: 3rem;
      color: var(--color-success);
    }
    .vc-hashing-core.ready .vc-core-status-text,
    .vc-hashing-core.stored .vc-core-status-text {
      color: var(--color-success);
    }

    /* Hashing Core: Error State */
    .vc-hashing-core.error {
      background: radial-gradient(circle, var(--color-error-glow) 0%, transparent 70%);
    }
    .vc-hashing-core.error .vc-core-ring {
      border-color: var(--color-error);
      animation-play-state: paused; /* Stop spinning */
    }
    .vc-hashing-core.error .vc-core-center {
      box-shadow: 0 0 30px 10px var(--color-error-glow) inset;
      animation: vc-pulse-glow-error 1s infinite ease-in-out;
    }
    .vc-hashing-core.error .vc-core-icon {
      font-size: 3rem;
      color: var(--color-error);
    }
    .vc-hashing-core.error .vc-core-status-text {
      color: var(--color-error);
    }

    /* Animations */
    @keyframes vc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes vc-pulse-glow-brand {
      0% { box-shadow: 0 0 20px 5px var(--color-brand-glow) inset; }
      50% { box-shadow: 0 0 40px 15px var(--color-brand-glow) inset; }
      100% { box-shadow: 0 0 20px 5px var(--color-brand-glow) inset; }
    }
    @keyframes vc-pulse-glow-success {
      0% { box-shadow: 0 0 20px 5px var(--color-success-glow) inset; }
      50% { box-shadow: 0 0 40px 15px var(--color-success-glow) inset; }
      100% { box-shadow: 0 0 20px 5px var(--color-success-glow) inset; }
    }
    @keyframes vc-pulse-glow-error {
      0% { box-shadow: 0 0 20px 5px var(--color-error-glow) inset; }
      50% { box-shadow: 0 0 40px 15px var(--color-error-glow) inset; }
      100% { box-shadow: 0 0 20px 5px var(--color-error-glow) inset; }
    }

    /* Spinner animation */
    .vc-spinner {
      animation: vc-spin 1.2s linear infinite;
    }
  `;

  return (
    <div className="vc-upload-wrapper">
      <style>{embeddedCSS}</style>
      <div className="vc-upload-card">

        <div className="vc-card-header">
          <IconUploadCloud />
          <div>
            <div className="vc-title">Upload & Store Document</div>
            <div className="vc-sub">Compute hash and store proof on-chain</div>
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

            {/* --- Left Column: Inputs & Actions --- */}
            <div>
              <div className="vc-block">
                <div className="vc-block-title">Step 1: Select Document</div>
                <label className="vc-dropzone" htmlFor="file-upload">
                  {file ? (
                    <div className="vc-dropzone-selected">
                      <IconCheckCircle />
                      <span className="vc-dropzone-filename">{file.name}</span>
                      <span style={{color: "var(--color-text-secondary)", fontSize: "0.9rem"}}>Click to change</span>
                    </div>
                  ) : (
                    <div className="vc-dropzone-idle">
                      <IconFile />
                      <span style={{fontWeight: 600}}>Click to browse or drag & drop</span>
                      <span style={{fontSize: "0.9rem"}}>SHA-256 computed locally</span>
                    </div>
                  )}
                  <input id="file-upload" ref={fileRef} type="file" onChange={onChoose} style={{display: "none"}} />
                </label>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Step 2: Wallet & Actions</div>
                <input
                  className="vc-wallet-input"
                  placeholder="Wallet address (e.g., 0x...)"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  aria-label="wallet-address"
                />
                <button
                  className="vc-btn connect-metamask gradient-effect" /* Added gradient-effect class */
                  onClick={connectWallet}
                  style={{width: "100%", marginTop: "0.75rem"}}
                >
                  Connect MetaMask
                </button>

                <div style={{borderTop: "1px solid var(--color-border)", margin: "1.5rem 0"}} />

                <div style={{display: "flex", gap: "0.75rem", flexWrap: "wrap"}}>
                  <button
                    className="vc-btn primary gradient-effect" /* Added gradient-effect class */
                    onClick={computeHash}
                    disabled={status === "computing" || !file}
                    aria-busy={status === "computing"}
                    style={{flex: 1}}
                  >
                    {status === "computing" ? <IconSpinner /> : null}
                    {status === "computing" ? "Computing..." : "Compute SHA-256"}
                  </button>
                  <button
                    className="vc-btn secondary"
                    onClick={clearFile}
                  >
                    <IconClear />
                  </button>
                </div>

                <button
                  className="vc-btn success-gradient gradient-effect" /* Added gradient-effect class */
                  onClick={handleStore}
                  disabled={!hash || status === "computing" || isStoring}
                  aria-busy={isStoring}
                  style={{width: "100%", marginTop: "0.75rem"}}
                >
                  {isStoring ? <IconSpinner /> : null}
                  {isStoring ? "Storing..." : "Store on Blockchain"}
                </button>
              </div>
            </div>

            {/* --- Right Column: Hashing Visual & Result --- */}
            <div>
              <div className="vc-block">
                <div className="vc-block-title" style={{justifyContent: "center"}}>Hashing Core</div>
                <HashingVisual status={status} />
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Result</div>
                <div className={`vc-hash-display ${status}`}>
                  {hash || "Hash will appear here..."}
                </div>
                <button
                  className="vc-btn secondary"
                  onClick={handleCopy}
                  disabled={!hash}
                  style={{width: "100%", marginTop: "1rem"}}
                >
                  <IconCopy /> Copy Hash
                </button>

                <div className={`vc-action-note ${actionMessage ? 'show' : ''} ${status === 'error' ? 'error' : ''}`}>
                  {actionMessage || "..."}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="vc-card-footer">
          VeriChain — Secure Upload Interface
        </div>
      </div>
    </div>
  );
}
