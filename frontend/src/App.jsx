import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// [NOTE] Keeping your original imports commented out, as they are in your file.
// I will wait for you to send me these files (Navbar.jsx, Home.jsx, etc.)
// so I can upgrade them one by one.
// import Navbar from "./components/Navbar/Navbar";
// import Home from "./components/Home/Home";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Upload from "./components/Upload/Upload";
// import Verify from "./components/Verify/Verify";
// import Wallet from "./components/Wallet/Wallet";

/**
 * [UPGRADED] - App.jsx
 * This file is the main "shell" of your application.
 * - The routing structure with react-router-dom is kept exactly as you had it.
 * - The <GlobalStyles /> component has been UPGRADED to inject the
 * J.A.R.V.I.S./holographic theme across the ENTIRE application.
 * - All CSS variables from your screenshots are included.
 * - Added global animated backgrounds, circuit patterns, and scrollbar styles.
 * - Added global utility classes (like .glowing-card, .glowing-btn)
 * that all other components (Home, Upload, etc.) will use for a consistent feel.
 * - Kept your placeholder components to prevent errors until you send the real files.
 */

// --- Placeholder Components ---
// These are temporary, just as you had them, to make the app runnable.
// I am ready for you to send the real component files (Navbar.jsx, Home.jsx, etc.)

const Navbar = () => (
  <header style={{...styles.fixedHeader, ...styles.glass}}>
    <div style={styles.container}>
      <span style={styles.logo}>VeriChain DigiLocker</span>
      <nav style={styles.nav}>
        <span>Dashboard</span>
        <span>Upload</span>
        <span>Verify</span>
        <span>Wallet</span>
      </nav>
    </div>
  </header>
);
const Home = () => <div style={styles.pageContent}><h1>Home Page</h1><p>Ready for <strong>Home.jsx</strong>. This component will render here.</p></div>;
const Dashboard = () => <div style={styles.pageContent}><h1>Dashboard</h1><p>Ready for <strong>Dashboard.jsx</strong>. This component will render here.</p></div>;
const Upload = () => <div style={styles.pageContent}><h1>Upload</h1><p>Ready for <strong>Upload.jsx</strong>. This component will render here.</p></div>;
const Verify = () => <div style={styles.pageContent}><h1>Verify</h1><p>Ready for <strong>Verify.jsx</strong>. This component will render here.</p></div>;
const Wallet = () => <div style={styles.pageContent}><h1>Wallet</h1><p>Ready for <strong>Wallet.jsx</strong>. This component will render here.</p></div>;

// Simple styles for placeholder components
const styles = {
  fixedHeader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--color-border)',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.5rem',
    fontFamily: "var(--font-main)",
  },
  glass: {
    background: 'rgba(10, 15, 31, 0.7)',
    backdropFilter: 'blur(20px)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    color: 'var(--color-text-primary)',
  },
  logo: {
    fontWeight: 700,
    fontSize: '1.25rem',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
  },
  pageContent: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'var(--color-text-primary)',
    fontFamily: "var(--font-main)",
  }
};
// --- End Placeholder Components ---


const GlobalStyles = () => (
  <style>{`
    /* Import Font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    /* [UPGRADED] Global Design System Variables */
    :root {
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

      /* Dark Holographic Colors */
      --color-bg-dark: #0A0F1F;
      --color-bg-medium: #101832;
      --color-bg-light: #1A2342;
      --color-bg-card: rgba(26, 35, 66, 0.7);

      --color-border: rgba(136, 163, 255, 0.2);
      --color-border-heavy: rgba(136, 163, 255, 0.4);

      --color-text-primary: #F0F4FF;
      --color-text-secondary: #A8BFFF;
      --color-text-muted: #6A7C9E;

      /* Brand/Neon Colors */
      --color-brand-purple: #7C3AED;
      --color-brand-blue: #3B82F6;
      --color-brand-cyan: #06B6D4;

      --color-brand-glow-purple: rgba(124, 58, 237, 0.5);
      --color-brand-glow-blue: rgba(59, 130, 246, 0.5);
      --color-brand-glow-cyan: rgba(6, 182, 212, 0.5);

      /* Status Colors */
      --color-success: #10B981;
      --color-success-light: rgba(16, 185, 129, 0.1);
      --color-success-glow: rgba(16, 185, 129, 0.4);

      --color-warning: #F59E0B;
      --color-warning-light: rgba(245, 158, 11, 0.1);
      --color-warning-glow: rgba(245, 158, 11, 0.4);

      --color-error: #EF4444;
      --color-error-light: rgba(239, 68, 68, 0.1);
      --color-error-glow: rgba(239, 68, 68, 0.4);

      --color-idle: var(--color-text-muted);
      --color-idle-bg: rgba(106, 124, 158, 0.1);
      --color-idle-glow: rgba(106, 124, 158, 0.2);

      /* Sizing */
      --radius-md: 12px;
      --radius-lg: 16px;
      --nav-height: 70px;

      /* Transitions */
      --transition-fast: all 0.2s ease-in-out;
      --transition-slow: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Global Resets & Body Styling */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body, html {
      font-family: var(--font-main);
      background-color: var(--color-bg-dark);
      color: var(--color-text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    /* [UPGRADED] Futuristic Background Effects */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100vw;
      height: 100vh;
      background-image:
        radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.15) 0px, transparent 50%),
        radial-gradient(at 95% 10%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 90%, rgba(59, 130, 246, 0.1) 0px, transparent 50%);
      background-attachment: fixed;
      z-index: -2;
      animation: subtleGlow 15s ease-in-out infinite;
    }

    @keyframes subtleGlow {
      0%   { opacity: 0.8; }
      50%  { opacity: 1; }
      100% { opacity: 0.8; }
    }

    /* [UPGRADED] Global Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--color-bg-dark);
    }
    ::-webkit-scrollbar-thumb {
      background-color: var(--color-brand-blue);
      border-radius: 20px;
      border: 2px solid var(--color-bg-dark);
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-brand-cyan);
    }

    .app-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
      z-index: 1;
    }

    /* [UPGRADED] Circuit Background */
    .app-root::after {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100vw;
      height: 100vh;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-41c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm63 52c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zM34 1c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm58 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zM10 80c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm69-50c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' stroke-width='1' stroke='%233B82F6' fill='none'/%3E%3Cpath d='M11 18v28M4 11h14M59 43v28M52 36h14M16 2v28M9 -5h14M79 54v28M72 47h14M34 1v28M27-6h14M92 19v28M85 12h14M10 80v28M3 73h14M79 30v28M72 23h14' stroke-width='1' stroke='%237C3AED' fill='none'/%3E%3C/svg%3E");
      z-index: -1;
      animation: bgScroll 30s linear infinite;
    }

    @keyframes bgScroll {
      0% { background-position: 0 0; }
      100% { background-position: -200px -200px; }
    }

    /* Page Container - CRITICAL LAYOUT FIX */
    main.page-container {
      padding-top: var(--nav-height); /* 70px */
      flex-grow: 1;
      width: 100%;
    }

    /* Global Page Wrapper for content */
    .page-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      animation: pageFadeIn 0.6s var(--transition-slow);
    }

    @keyframes pageFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* [UPGRADED] Global Utility Classes (for other components) */

    .glowing-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: var(--transition-slow);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .glowing-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.1), transparent 40%);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: 0;
    }

    .glowing-card:hover::before {
      opacity: 1;
    }

    .glowing-card:hover {
      border-color: var(--color-border-heavy);
      box-shadow: 0 0 40px rgba(124, 58, 237, 0.1), 0 15px 40px rgba(0,0,0,0.4);
      transform: translateY(-5px);
    }

    .glowing-card > * {
      position: relative;
      z-index: 1;
    }

    .glowing-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      z-index: 1;
      transition: var(--transition-fast);
      transform: translateZ(0);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      color: #ffffff;
    }

    .glowing-btn::before {
      content: '';
      position: absolute;
      z-index: -1;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(120deg, var(--color-brand-cyan), var(--color-brand-blue), var(--color-brand-purple));
      opacity: 0.9;
      transition: var(--transition-fast);
    }

    .glowing-btn::after {
      content: '';
      position: absolute;
      z-index: -2;
      top: -5px; left: -5px; right: -5px; bottom: -5px;
      background: linear-gradient(120deg, var(--color-brand-cyan), var(--color-brand-blue), var(--color-brand-purple));
      filter: blur(20px);
      opacity: 0.6;
      transition: var(--transition-fast);
      transform: scale(0.95);
    }

    .glowing-btn:hover::before { opacity: 1; }
    .glowing-btn:hover::after { opacity: 0.8; transform: scale(1); }
    .glowing-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }

    .glowing-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    .glowing-btn:disabled::before, .glowing-btn:disabled::after { display: none; }

    .glowing-btn.secondary {
      background: var(--color-bg-light);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
      box-shadow: none;
    }
    .glowing-btn.secondary::before, .glowing-btn.secondary::after { display: none; }
    .glowing-btn.secondary:hover {
      background: var(--color-bg-card);
      border-color: var(--color-border-heavy);
      box-shadow: 0 0 15px var(--color-brand-glow-blue);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(10, 15, 31, 0.7);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: 1rem;
      font-family: var(--font-main);
      transition: var(--transition-fast);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) inset;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--color-brand-blue);
      box-shadow: 0 0 15px var(--color-brand-glow-blue);
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spinner {
      animation: spin 1s linear infinite;
    }

    /* Upgraded Footer */
    .site-footer {
      text-align: center;
      padding: 1.5rem;
      font-size: 0.9rem;
      color: var(--color-text-tertiary);

      /* Glassmorphism effect to match navbar */
      background: rgba(10, 15, 31, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--color-border);
      z-index: 100;
      position: relative;
    }
  `}</style>
);

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles /> {/* <-- All global styles are injected here */}
      <div className="app-root">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/wallet" element={<Wallet />} />
            {/* fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer className="site-footer">
          VeriChain DigiLocker — The Future of Decentralized Trust
        </footer>
      </div>
    </BrowserRouter>
  );
}
