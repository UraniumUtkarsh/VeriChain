import React, { useState } from "react";
// Import Link instead of NavLink to fix the useLocation() error
import { Link } from "react-router-dom";

/**
 * [UPDATED] - Visually enhanced Navbar UI for VeriChain frontend.
 * - Matches the modern, "blockchain digilocker" aesthetic.
 * - Features a semi-transparent "glassmorphism" effect.
 * - NOTE: Reverted to <Link> from <NavLink> to fix a context error. Active state styling is removed.
 * - Fully responsive: collapses to a hamburger menu on mobile.
 * - All styles are embedded to keep it a single, self-contained file.
 */

// --- SVG Icons ---

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-brand)" }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconClose = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

// --- Main Component ---

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const embeddedCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    :root {
      /* Define colors here in case this is the only component loaded */
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --color-bg-deep: #0D1127;
      --color-bg-main: #111827;
      --color-border: rgba(255, 255, 255, 0.08);
      --color-text-primary: #F3F4F6;
      --color-text-secondary: #9CA3AF;
      --color-brand: #4F46E5;
      --color-brand-hover: #6366F1;
      --radius-md: 10px;
    }

    .vc-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      font-family: var(--font-main);

      /* Glassmorphism effect */
      background: rgba(17, 24, 39, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--color-border);

      animation: vc-fade-down 0.5s ease-out;
    }

    @keyframes vc-fade-down {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .vc-navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1280px; /* Max width for content */
      margin: 0 auto;
      padding: 1rem 1.5rem;
      height: 70px;
      box-sizing: border-box;
    }

    /* Brand/Logo */
    .vc-navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: opacity 0.2s ease-out;
    }
    .vc-navbar-brand:hover {
      opacity: 0.8;
    }
    .vc-navbar-brand h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      line-height: 1;
    }

    /* Desktop Navigation */
    .vc-navbar-desktop {
      display: flex;
      gap: 1rem;
    }

    .vc-nav-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 8px 4px;
      position: relative;
      transition: color 0.2s ease-out;
    }

    .vc-nav-link:hover {
      color: var(--color-text-primary);
    }

    /* Animated underline for hover */
    /* Removed .active state styling as <Link> doesn't support it by default */
    .vc-nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-brand);
      opacity: 0;
      transform: scaleX(0.5);
      transition: all 0.2s ease-out;
    }

    .vc-nav-link:hover::after {
      opacity: 1;
      transform: scaleX(1);
    }

    /* Removed:
    .vc-nav-link.active::after {
      opacity: 1;
      transform: scaleX(1);
    }
    .vc-nav-link.active {
      color: var(--color-text-primary);
    }
    */

    /* Mobile Menu */
    .vc-navbar-mobile-toggle {
      display: none;
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
    }

    .vc-navbar-mobile-menu {
      display: none; /* Toggled by JS */
      position: fixed;
      top: 70px; /* Height of the navbar */
      left: 0;
      right: 0;
      padding: 1rem;
      background: var(--color-bg-main);
      border-bottom: 1px solid var(--color-border);

      flex-direction: column;
      gap: 0.5rem;
      animation: vc-fade-down 0.3s ease-out;
    }

    .vc-navbar-mobile-menu .vc-nav-link {
      display: block;
      padding: 12px 16px;
      border-radius: var(--radius-md);
    }

    /* Removed .active state for mobile */
    .vc-navbar-mobile-menu .vc-nav-link:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    /* .vc-navbar-mobile-menu .vc-nav-link.active {
      background: var(--color-brand);
      color: #fff;
    }
    */

    .vc-navbar-mobile-menu .vc-nav-link::after {
      display: none; /* No underlines on mobile */
    }

    /* Responsive Breakpoint */
    @media (max-width: 768px) {
      .vc-navbar-desktop {
        display: none;
      }
      .vc-navbar-mobile-toggle {
        display: block;
      }
      .vc-navbar-mobile-menu.open {
        display: flex;
      }
    }
  `;

  return (
    <header className="vc-navbar">
      <style>{embeddedCSS}</style>

      <div className="vc-navbar-container">
        {/* Logo/Brand - links to Home */}
        {/* Changed NavLink to Link */}
        <Link className="vc-navbar-brand" to="/">
          <IconLock />
          <h2>VeriChain DigiLocker</h2>
        </Link>

        {/* Desktop Navigation */}
        {/* Changed NavLink to Link */}
        <nav className="vc-navbar-desktop">
          <Link className="vc-nav-link" to="/dashboard">Dashboard</Link>
          <Link className="vc-nav-link" to="/upload">Upload</Link>
          <Link className="vc-nav-link" to="/verify">Verify</Link>
          <Link className="vc-nav-link" to="/wallet">Wallet</Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button className="vc-navbar-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile Nav Menu (Dropdown) */}
      {/* Changed NavLink to Link */}
      <nav className={`vc-navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link className="vc-nav-link" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link className="vc-nav-link" to="/upload" onClick={closeMenu}>Upload</Link>
        <Link className="vc-nav-link" to="/verify" onClick={closeMenu}>Verify</Link>
        <Link className="vc-nav-link" to="/wallet" onClick={closeMenu}>Wallet</Link>
      </nav>

    </header>
  );
}
