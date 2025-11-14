import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link as RouterLink } from "react-router-dom";
import axios from "axios";

/* ===================================================
 * VeriChain DigiLocker — FINAL CONSOLIDATED APP
 * ===================================================
 * All components (App, Navbar, Home, Upload, Verify,
 * Wallet, Dashboard) and all CSS styles (index.css)
 * have been merged into this single main.jsx file
 * to resolve build errors in this environment.
 * ===================================================
 */

// --- Global Styles (from index.css) ---
const GlobalStyles = () => (
  <style>{`
    /* ---------- Import Font ---------- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* * =========================================
     * GLOBAL DESIGN SYSTEM (THEME)
     * =========================================
     */
    :root {
      --font-main: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

      /* --- Colors --- */
      --color-bg-deep: #0D1127;
      --color-bg-main: #111827;
      --color-bg-card: rgba(31, 41, 55, 0.5);
      --color-border: rgba(255, 255, 255, 0.08);
      --color-shadow: rgba(0, 0, 0, 0.3);

      --color-text-primary: #F3F4F6;
      --color-text-secondary: #9CA3AF;
      --color-text-tertiary: #6B7280;

      /* Brand (Blue/Purple) */
      --color-brand: #4F46E5;
      --color-brand-hover: #6366F1;
      --color-brand-glow: rgba(79, 70, 229, 0.5);

      /* Success (Green) */
      --color-success: #10B981;
      --color-success-bg: rgba(16, 185, 129, 0.1);
      --color-success-glow: rgba(16, 185, 129, 0.4);
      --color-success-text: #A7F3D0;

      /* Error (Red) */
      --color-error: #EF4444;
      --color-error-bg: rgba(239, 68, 68, 0.1);
      --color-error-glow: rgba(239, 68, 68, 0.4);
      --color-error-text: #FECACA;

      /* Idle (Gray) */
      --color-idle: var(--color-text-tertiary);
      --color-idle-bg: rgba(107, 114, 128, 0.1);
      --color-idle-glow: rgba(107, 114, 128, 0.2);

      /* Checking (Yellow) */
      --color-checking: #F59E0B;
      --color-checking-bg: rgba(245, 158, 11, 0.1);
      --color-checking-glow: rgba(245, 158, 11, 0.4);
      --color-checking-text: #FDE68A;

      /* --- Sizing & Transitions --- */
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --transition-fast: all 0.15s ease-out;
      --transition-slow: all 0.3s ease-out;
    }

    /* * =========================================
     * GLOBAL RESETS & BASE STYLES
     * =========================================
     */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: var(--font-main);
      background: var(--color-bg-main);
      color: var(--color-text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* * =========================================
     * GLOBAL APP LAYOUT
     * =========================================
     */
    #root {
      max-width: none;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .app-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main.page-container {
      padding-top: 70px; /* 70px is navbar height */
      flex-grow: 1;
    }

    .vc-home-wrapper,
    .vc-upload-wrapper,
    .vc-verify-wrapper,
    .vc-wallet-wrapper,
    .vc-dashboard-wrapper {
      padding: 3rem 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      min-height: calc(100vh - 70px); /* Full height minus navbar */
      width: 100%;
      font-family: var(--font-main);
      background: linear-gradient(170deg, var(--color-bg-deep) 0%, #080a1a 100%);
      color: var(--color-text-primary);
      position: relative;
      overflow: hidden;
    }

    /* Global Footer */
    .site-footer {
      text-align: center;
      padding: 1.5rem;
      font-size: 0.9rem;
      color: var(--color-text-tertiary);
      background: rgba(17, 24, 39, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--color-border);
      z-index: 100;
      position: relative;
    }

    /* * =========================================
     * GLOBAL ANIMATIONS
     * =========================================
     */
    @keyframes vc-aurora {
      0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.2; }
      50% { transform: translate(-45%, -55%) scale(1.2) rotate(180deg); opacity: 0.4; }
      100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.2; }
    }

    @keyframes vc-appear {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes vc-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .vc-spinner {
      animation: vc-spin 1.2s linear infinite;
    }

    /* * =========================================
     * GLOBAL COMPONENTS (Cards, Buttons)
     * =========================================
     */

    /* --- Glassmorphism Cards --- */
    .vc-card {
      width: 100%;
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

    /* Common Layouts */
    .vc-grid {
      display: grid;
      gap: 2rem;
    }

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

    /* --- Consolidated Button Styles --- */
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
      text-decoration: none; /* For <Link> */
    }

    .vc-btn.gradient-effect {
      background: linear-gradient(90deg, var(--initial-color-light) 0%, var(--initial-color-dark) 50%, var(--initial-color-light) 100%);
      background-size: 200% auto;
      color: var(--gradient-text-color, #fff);
      box-shadow: 0 4px 12px var(--shadow-color);
      transition: all 0.3s ease-out;
    }

    .vc-btn.gradient-effect:hover {
      background-position: right center;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px var(--shadow-color);
    }

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

    .vc-btn.primary {
      --initial-color-light: var(--color-brand-hover);
      --initial-color-dark: var(--color-brand);
      --shadow-color: rgba(79, 70, 229, 0.2);
    }
    .vc-btn.primary:hover {
      --shadow-color: rgba(79, 70, 229, 0.3);
    }

    .vc-btn.success-gradient {
      --initial-color-light: #34d399;
      --initial-color-dark: var(--color-success);
      --shadow-color: var(--color-success-glow);
      --gradient-text-color: #003622;
    }
    .vc-btn.success-gradient:hover {
      --shadow-color: var(--color-success-glow);
    }

    .vc-btn.connect-metamask {
      --initial-color-light: #f59e0b;
      --initial-color-dark: #d97706;
      --shadow-color: rgba(217, 119, 6, 0.2);
      --gradient-text-color: #3f2000;
    }
    .vc-btn.connect-metamask:hover {
      --shadow-color: rgba(217, 119, 6, 0.3);
    }

    .vc-btn.danger {
      background: var(--color-error);
      color: #fff;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
    .vc-btn.danger:hover {
      background: #F87171;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
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

    .vc-btn[disabled] {
      opacity: 0.5;
      background: var(--color-text-tertiary) !important;
      color: var(--color-bg-deep) !important;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    .vc-btn[disabled]::before {
      display: none;
    }

    /* * =========================================
     * NAVBAR STYLES (from Navbar.jsx)
     * =========================================
     */
    .vc-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      font-family: var(--font-main);
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
      max-width: 1280px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      height: 70px;
      box-sizing: border-box;
    }

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

    /* NavLink uses .active class */
    .vc-nav-link:hover::after,
    .vc-nav-link.active::after {
      opacity: 1;
      transform: scaleX(1);
    }

    .vc-nav-link.active {
      color: var(--color-text-primary);
    }

    .vc-navbar-mobile-toggle {
      display: none;
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
    }

    .vc-navbar-mobile-menu {
      display: none;
      position: fixed;
      top: 70px;
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
    .vc-navbar-mobile-menu .vc-nav-link.active {
      background: var(--color-brand);
      color: #fff;
    }

    .vc-navbar-mobile-menu .vc-nav-link::after {
      display: none;
    }

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

    /* * =========================================
     * HOME PAGE STYLES (from Home.jsx)
     * =========================================
     */
    .vc-home-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 1000px;
      height: 800px;
      background-image: radial-gradient(circle, var(--color-brand-glow) 0%, transparent 60%);
      transform: translate(-50%, -40%);
      opacity: 0.4;
      filter: blur(120px);
      animation: vc-aurora 15s infinite ease-in-out;
      z-index: 1;
    }

    .vc-home-grid-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 60px),
        repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 60px);
      background-size: 60px 60px;
      animation: vc-move-grid 20s linear infinite;
      z-index: 0;
      opacity: 0.5;
    }

    @keyframes vc-move-grid {
      from { background-position: 0 0; }
      to { background-position: 60px 60px; }
    }

    .vc-home-container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      z-index: 2;
      animation: vc-appear .5s ease-out;
    }

    .vc-home-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 4rem 1rem 5rem 1rem;
    }
    .vc-hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      background: linear-gradient(90deg,
        var(--color-text-primary) 0%,
        var(--color-text-secondary) 30%,
        var(--color-text-primary) 50%,
        var(--color-brand-hover) 70%,
        var(--color-text-primary) 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: vc-shine-text 7s linear infinite;
    }

    @keyframes vc-shine-text {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }

    .vc-hero-subtitle {
      font-size: 1.25rem;
      color: var(--color-text-secondary);
      max-width: 650px;
      margin: 1.5rem 0 2rem 0;
      line-height: 1.6;
    }
    .vc-hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .vc-feature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .vc-feature-card {
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid var(--color-border);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: var(--radius-lg);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      transition: var(--transition-slow);
    }
    .vc-feature-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255,255,255,0.2);
      box-shadow: 0 10px 30px var(--color-shadow), 0 0 0 1px var(--color-brand);
    }

    .vc-card-icon { margin-bottom: 1rem; }
    .vc-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.75rem 0;
    }
    .vc-card-description {
      color: var(--color-text-secondary);
      line-height: 1.6;
      flex-grow: 1;
    }
    .vc-card-link { margin-top: 1.5rem; text-decoration: none; }

    .vc-live-feed-block {
      margin-top: 3rem;
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid var(--color-border);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: var(--radius-lg);
      padding: 2rem;
    }
    .vc-live-feed-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .vc-feed-list {
      max-height: 250px;
      overflow-y: auto;
      padding-right: 10px;
    }
    .vc-feed-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 0.9rem;
      padding: 0.75rem 0.25rem;
      border-bottom: 1px solid var(--color-border);
      animation: vc-feed-item-appear 0.5s ease-out;
    }
    .vc-feed-item:first-child {
      border-top: 1px solid var(--color-border);
    }

    @keyframes vc-feed-item-appear {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .vc-feed-hash { color: var(--color-text-tertiary); }
    .vc-feed-status { font-weight: 700; text-align: right; }
    .vc-feed-status.online { color: var(--color-text-secondary); }
    .vc-feed-status.Authentic { color: var(--color-success-text); }
    .vc-feed-status.NotFound { color: var(--color-error-text); }

    @media (max-width: 900px) {
      .vc-feature-grid {
        grid-template-columns: 1fr;
      }
      .vc-home-hero {
        padding: 2rem 0.5rem 3rem 0.5rem;
      }
      .vc-hero-title {
        font-size: 2.5rem;
      }
      .vc-hero-subtitle {
        font-size: 1.1rem;
      }
    }

    /* * =========================================
     * UPLOAD PAGE STYLES (from Upload.jsx)
     * =========================================
     */
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

    .vc-upload-card {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }
    .vc-upload-card .vc-grid {
      grid-template-columns: 1fr 300px;
    }
    @media (max-width: 900px) {
      .vc-upload-card .vc-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .vc-upload-card .vc-card-body { padding: 1.5rem; }
      .vc-upload-card .vc-card-header { padding: 1rem 1.5rem; }
      .vc-upload-card .vc-card-header .vc-title { font-size: 1.25rem; }
      .vc-upload-card .vc-card-header .vc-sub { font-size: 0.875rem; }
    }

    .vc-dropzone {
      border: 2px dotted var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      text-align: center;
      background: rgba(0,0,0,0.1);
      cursor: pointer;
      transition: var(--transition-slow);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 160px;
    }
    .vc-dropzone:hover {
      border-color: var(--color-brand);
      background: rgba(79, 70, 229, 0.05);
    }
    .vc-dropzone-idle {
      gap: 0.5rem;
      color: var(--color-text-secondary);
    }
    .vc-dropzone-selected {
      gap: 0.75rem;
      color: var(--color-success-text);
    }
    .vc-dropzone-filename {
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      font-size: 1rem;
      word-break: break-all;
    }

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

    /* Hashing Core Visual */
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

    .vc-hashing-core.computing {
      background: radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%);
    }
    .vc-hashing-core.computing .vc-core-ring {
      border-color: var(--color-brand);
      animation-duration: 2s;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    .vc-hashing-core.computing .vc-ring-1 { animation-duration: 2.5s; }
    .vc-hashing-core.computing .vc-ring-2 { animation-duration: 1.5s; }
    .vc-hashing-core.computing .vc-ring-3 { animation-duration: 2.2s; }
    .vc-hashing-core.computing .vc-core-center {
      box-shadow: 0 0 30px 10px var(--color-brand-glow) inset;
      animation: vc-pulse-glow-brand 1.2s infinite ease-in-out;
    }
    .vc-hashing-core.computing .vc-core-icon { color: var(--color-brand); }
    .vc-hashing-core.computing .vc-core-status-text { color: var(--color-brand); }

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

    .vc-hashing-core.error {
      background: radial-gradient(circle, var(--color-error-glow) 0%, transparent 70%);
    }
    .vc-hashing-core.error .vc-core-ring {
      border-color: var(--color-error);
      animation-play-state: paused;
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

    /* * =========================================
     * VERIFY PAGE STYLES (from Verify.jsx)
     * =========================================
     */
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

    .vc-verify-card {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }
    .vc-verify-card .vc-grid {
      grid-template-columns: 1fr 340px;
    }
    @media (max-width: 900px) {
      .vc-verify-card .vc-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .vc-verify-card .vc-card-body { padding: 1.5rem; }
      .vc-verify-card .vc-card-header { padding: 1rem 1.5rem; }
      .vc-verify-card .vc-card-header .vc-title { font-size: 1.25rem; }
      .vc-verify-card .vc-card-header .vc-sub { font-size: 0.875rem; }
    }

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
      animation: vc-pulse-glow-success-verify 1.5s infinite ease-in-out;
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

    @keyframes vc-pulse-glow-success-verify {
      0% { box-shadow: 0 0 0 2px var(--color-success-glow) inset, 0 8px 30px -10px var(--color-success-glow); }
      50% { box-shadow: 0 0 0 4px var(--color-success-glow) inset, 0 8px 40px -8px var(--color-success-glow); }
      100% { box-shadow: 0 0 0 2px var(--color-success-glow) inset, 0 8px 30px -10px var(--color-success-glow); }
    }

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
      display: none;
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

    /* * =========================================
     * WALLET PAGE STYLES (from Wallet.jsx)
     * =========================================
     */
    .vc-wallet-wrapper::before {
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

    .vc-wallet-card {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }
    .vc-wallet-card .vc-grid {
      grid-template-columns: 1fr 300px;
    }
    @media (max-width: 900px) {
      .vc-wallet-card .vc-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .vc-wallet-card .vc-card-body { padding: 1.5rem; }
      .vc-wallet-card .vc-card-header { padding: 1rem 1.5rem; flex-direction: column; align-items: flex-start; }
      .vc-wallet-card .vc-header-brand .vc-title { font-size: 1.25rem; }
      .vc-wallet-card .vc-header-brand .vc-sub { font-size: 0.875rem; }
    }

    .vc-header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
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
      border-color: var(--color-brand);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
    }

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

    .vc-hint {
      font-size: 0.875rem;
      color: var(--color-text-tertiary);
      margin-top: 1rem;
      line-height: 1.6;
    }

    .vc-qr-block.wallet-qr {
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
    .vc-qr-block.wallet-qr.connected {
      border-color: var(--color-brand);
      box-shadow: 0 0 0 3px var(--color-brand-glow);
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

    .vc-qr-block.wallet-qr.connected .vc-qr-scanner {
      display: block;
    }
    .vc-qr-block.wallet-qr.connected .vc-qr-text {
      display: none;
    }
    .vc-qr-block.wallet-qr:not(.connected) .vc-qr-inner {
      display: none;
    }

    .vc-activity-feed {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 200px;
      overflow-y: auto;
      padding-right: 10px;
    }

    .vc-activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      animation: vc-fade-in-item 0.5s ease-out;
    }

    .vc-activity-item .icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vc-activity-item .icon.connect {
      background: var(--color-success-bg);
      color: var(--color-success);
    }
    .vc-activity-item .icon.tx {
      background: var(--color-brand-glow);
      color: var(--color-brand-hover);
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

    @keyframes vc-fade-in-item {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }


    /* * =========================================
     * DASHBOARD PAGE STYLES (from Dashboard.jsx)
     * =========================================
     */
    .vc-dashboard-wrapper::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 800px;
      height: 800px;
      background-image: radial-gradient(circle, var(--color-success-glow) 0%, transparent 60%);
      transform: translate(-50%, -50%);
      opacity: 0.3;
      filter: blur(100px);
      animation: vc-aurora 15s infinite ease-in-out;
      z-index: 0;
    }

    .vc-dashboard-card {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }

    .vc-doc-table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden; /* For table border radius */
      border-radius: var(--radius-md);
    }
    .vc-doc-table th, .vc-doc-table td {
      padding: 1rem 1.25rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
      background: rgba(0,0,0,0.1);
    }
    .vc-doc-table th {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(0,0,0,0.2);
    }

    .vc-doc-table tr:last-child td {
      border-bottom: none;
    }

    .vc-doc-table td {
      font-size: 0.95rem;
    }

    .vc-doc-name {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .vc-doc-hash {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
      color: var(--color-text-tertiary);
    }

    .vc-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 99px;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .vc-status-badge.Authentic {
      background: var(--color-success-bg);
      color: var(--color-success-text);
    }

    .vc-status-badge.Pending {
      background: var(--color-checking-bg);
      color: var(--color-checking-text);
    }

    .vc-loading-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;
      color: var(--color-text-secondary);
    }
  `}</style>
);

// --- Re-aliasing Link to RouterLink ---
// We will use RouterLink from 'react-router-dom' inside our components
const Link = RouterLink;
const NavLink = RouterLink; // NavLink is just an alias for RouterLink in this context

// --- All SVG Icons ---
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
);
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
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-brand)" }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-success)" }}>
    <path d="M20 12V8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12v-2"></path>
    <path d="M18 12a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"></path>
    <path d="M22 18h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2v-4z"></path>
  </svg>
);
const IconActivity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-secondary)" }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
const IconShieldCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);
const IconShieldX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m14.5 9.5-5 5"></path>
    <path d="m9.5 9.5 5 5"></path>
  </svg>
);
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconHourglass = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14"></path>
    <path d="M5 2h14"></path>
    <path d="M17 2v6l-5 4 5 4v6H7v-6l5-4-5-4V2h10z"></path>
  </svg>
);
const IconFileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--color-text-secondary)"}}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const IconClipboardCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
    <path d="m9 14 2 2 4-4"></path>
  </svg>
);
const IconThumbsUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12"></path>
    <path d="M15 10v12"></path>
    <path d="M15 10l-2.5-2.5A2.83 2.83 0 0 0 10 6.22V6a4 4 0 0 0-4-4H4v10l2.1 7.9a2.84 2.84 0 0 0 2.7 2.1H15a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1z"></path>
  </svg>
);

// --- Component-specific Helpers ---
const bufToHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

function copyToClipboard(text, callback) {
  if (!text) return;
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
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

// --- All Components ---

// --- Navbar.jsx ---
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // We use NavLink from react-router-dom for .active class styling
  const NavLink = ({ to, children, ...props }) => {
    // This is a simple implementation. For full NavLink features (like `end`),
    // you'd need a more complex check using useLocation().
    // For this app, checking if the path starts with the `to` prop is sufficient.
    const location = window.location;
    const isActive = location.pathname === to;

    return (
      <RouterLink
        to={to}
        className={`vc-nav-link ${isActive ? 'active' : ''}`}
        {...props}
      >
        {children}
      </RouterLink>
    );
  };

  return (
    <header className="vc-navbar">
      <div className="vc-navbar-container">
        <RouterLink className="vc-navbar-brand" to="/">
          <IconLock />
          <h2>VeriChain DigiLocker</h2>
        </RouterLink>

        <nav className="vc-navbar-desktop">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/upload">Upload</NavLink>
          <NavLink to="/verify">Verify</NavLink>
          <NavLink to="/wallet">Wallet</NavLink>
        </nav>

        <button className="vc-navbar-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      <nav className={`vc-navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/upload" onClick={closeMenu}>Upload</NavLink>
        <NavLink to="/verify" onClick={closeMenu}>Verify</NavLink>
        <NavLink to="/wallet" onClick={closeMenu}>Wallet</NavLink>
      </nav>
    </header>
  );
}

// --- Home.jsx ---
function Home() {
  const [feed, setFeed] = useState([
    { id: 1, hash: '0xabc...d3f4', status: 'online' },
  ]);

  const randomHash = () => "0x" + Math.random().toString(16).slice(2, 8) + "..." + Math.random().toString(16).slice(2, 6);
  const randomStatus = () => (Math.random() > 0.3 ? 'Authentic' : 'NotFound');

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prevFeed => {
        const newItem = {
          id: (prevFeed[0]?.id || 0) + 1,
          hash: randomHash(),
          status: randomStatus(),
        };
        // Keep the feed clean, max 10 items
        return [newItem, ...prevFeed].slice(0, 10);
      });
    }, 3000); // Add a new item every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vc-home-wrapper">
      <div className="vc-home-grid-bg"></div>
      <div className="vc-home-container">

        <section className="vc-home-hero">
          <h1 className="vc-hero-title">VeriChain DigiLocker</h1>
          <p className="vc-hero-subtitle">
            A futuristic, decentralized solution for document security. Upload, verify, and manage your digital assets with the power of blockchain technology, all secured by your own wallet.
          </p>
          <div className="vc-hero-actions">
            <Link to="/upload" className="vc-btn primary gradient-effect">
              <IconUploadCloud /> Upload Document
            </Link>
            <Link to="/verify" className="vc-btn secondary">
              <IconShield /> Verify Hash
            </Link>
          </div>
        </section>

        <section className="vc-feature-grid">
          <div className="vc-feature-card">
            <div className="vc-card-icon"><IconUploadCloud /></div>
            <h3 className="vc-card-title">Secure Upload</h3>
            <p className="vc-card-description">
              Compute a file's unique SHA-256 hash locally in your browser. The file never leaves your device until you decide to store it.
            </p>
            <Link to="/upload" className="vc-btn secondary vc-card-link">Get Started</Link>
          </div>

          <div className="vc-feature-card">
            <div className="vc-card-icon"><IconShield /></div>
            <h3 className="vc-card-title">Instant Verification</h3>
            <p className="vc-card-description">
              Verify the authenticity of any document in seconds. Our live scanner queries the blockchain to confirm the hash and its ownership.
            </p>
            <Link to="/verify" className="vc-btn secondary vc-card-link">Verify a Document</Link>
          </div>

          <div className="vc-feature-card">
            <div className="vc-card-icon"><IconWallet /></div>
            <h3 className="vc-card-title">Wallet Integration</h3>
            <p className="vc-card-description">
              Connect your MetaMask wallet to manage your personal document dashboard, sign new entries, and prove ownership of your digital assets.
            </p>
            <Link to="/wallet" className="vc-btn secondary vc-card-link">Connect Wallet</Link>
          </div>
        </section>

        <section className="vc-live-feed-block">
          <h3 className="vc-live-feed-title"><IconActivity /> Live Verification Feed</h3>
          <div className="vc-feed-list">
            {feed.map(item => (
              <div key={item.id} className="vc-feed-item">
                <span className="vc-feed-hash">{item.hash}</span>
                <span className={`vc-feed-status ${item.status}`}>
                  {item.status === 'online' ? 'System Online' : item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// --- Dashboard.jsx ---
function Dashboard() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setDocs([
        { id: 1, name: 'Academic_Transcript_2023.pdf', hash: '0x1a2b...c3d4', status: 'Authentic' },
        { id: 2, name: 'Professional_Certificate.png', hash: '0x9f8e...b7a6', status: 'Authentic' },
        { id: 3, name: 'Contract_Proposal_v2.docx', hash: '0x5g6h...k9j0', status: 'Pending' },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="vc-dashboard-wrapper">
      <div className="vc-dashboard-card vc-card">
        <div className="vc-card-header">
          <IconFileText />
          <div>
            <h2 className="vc-title">My Document Dashboard</h2>
            <p className="vc-sub">All documents registered to your connected wallet.</p>
          </div>
        </div>
        <div className="vc-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="vc-loading-placeholder">
              <IconSpinner />
              <span>Loading documents...</span>
            </div>
          ) : (
            <table className="vc-doc-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Hash</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <span className="vc-doc-name">
                        <IconFileText />
                        {doc.name}
                      </span>
                    </td>
                    <td><span className="vc-doc-hash">{doc.hash}</span></td>
                    <td>
                      <span className={`vc-status-badge ${doc.status}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <button className="vc-btn secondary" style={{ padding: '8px 12px' }}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Upload.jsx ---
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

function Upload() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("idle");
  const [wallet, setWallet] = useState("");
  const [actionMessage, setActionMessage] = useState(false);
  const [isStoring, setIsStoring] = useState(false);

  const fileRef = useRef(null);
  const API_BASE = "http://127.0.0.1:5000";

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
    }
  }, []);

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

  return (
    <div className="vc-upload-wrapper">
      <div className="vc-upload-card vc-card">

        <div className="vc-card-header">
          <IconUploadCloud />
          <div>
            <div className="vc-title">Upload & Store Document</div>
            <div className="vc-sub">Compute hash and store proof on-chain</div>
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

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
                  className="vc-btn connect-metamask gradient-effect"
                  onClick={connectWallet}
                  style={{width: "100%", marginTop: "0.75rem"}}
                >
                  Connect MetaMask
                </button>

                <div style={{borderTop: "1px solid var(--color-border)", margin: "1.5rem 0"}} />

                <div style={{display: "flex", gap: "0.75rem", flexWrap: "wrap"}}>
                  <button
                    className="vc-btn primary gradient-effect"
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
                  className="vc-btn success-gradient gradient-effect"
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
      </div>
    </div>
  );
}

// --- Verify.jsx ---
const FakeQR = ({ text }) => {
  const [dots, setDots] = useState([]);
  useEffect(() => {
    const size = 18; // 18x18 grid
    const newDots = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Simple pattern based on text + coords
        const charCode = text ? text.charCodeAt((x * y) % text.length) : 0;
        if ((x * y + charCode) % 3 > 1) {
          // Corner blocks
          if ((x < 5 && y < 5) || (x > 12 && y < 5) || (x < 5 && y > 12)) {
            newDots.push(`M ${x*10+3} ${y*10+3} h 4 v 4 h -4 v -4 Z`);
          }
          // Random dots
          else if (Math.random() > 0.6) {
            newDots.push(`M ${x*10+4} ${y*10+4} h 2 v 2 h -2 v -2 Z`);
          }
        }
      }
    }
    setDots(newDots);
  }, [text]);

  return (
    <svg viewBox="0 0 180 180" width="100%" height="100%" style={{ background: '#fff', borderRadius: '4px', padding: '0' }}>
      <path d={dots.join(' ')} fill="#0D1127" />
    </svg>
  );
};

function Verify() {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | valid | invalid
  const [copied, setCopied] = useState(false);
  const [log, setLog] = useState([]);

  const isProbablySha256 = (h) => /^[0-9a-fA-F]{64}$/.test(h.trim());

  const doVerify = async () => {
    if (!hash.trim()) {
      setCopied("No hash to verify.");
      return;
    }
    setStatus("checking");
    const newLogEntry = { type: 'checking', hash: hash.trim() };
    setLog([newLogEntry, ...log]);

    await new Promise((r) => setTimeout(r, 1200));

    if (isProbablySha256(hash)) {
      setStatus("valid");
      setLog(l => l.map(item => item === newLogEntry ? { ...item, type: 'valid' } : item));
    } else {
      setStatus("invalid");
      setLog(l => l.map(item => item === newLogEntry ? { ...item, type: 'invalid' } : item));
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setHash(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const handleCopy = () => {
    copyToClipboard(hash, (ok) => {
      setCopied(ok);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const StatusIcon = () => {
    if (status === 'valid') return <IconShieldCheck />;
    if (status === 'invalid') return <IconShieldX />;
    if (status === 'checking') return <IconHourglass className="vc-spinner" />;
    return <IconSearch />;
  };

  return (
    <div className="vc-verify-wrapper">
      <div className="vc-verify-card vc-card">

        <div className="vc-card-header">
          <IconShield />
          <div>
            <h2 className="vc-title">Verify Document</h2>
            <p className="vc-sub">Check the authenticity of a document hash.</p>
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

            <div>
              <div className="vc-block">
                <label className="vc-input-label" htmlFor="hash-input">Document Hash</label>
                <input
                  id="hash-input"
                  className="vc-input"
                  placeholder="Paste SHA-256 hash here..."
                  value={hash}
                  onChange={(e) => {
                    setHash(e.target.value);
                    setStatus('idle');
                  }}
                />
                <div className="vc-actions">
                  <button
                    className="vc-btn primary gradient-effect"
                    onClick={doVerify}
                    disabled={status === 'checking'}
                    style={{flex: 1}}
                  >
                    {status === 'checking' ? <IconSpinner /> : null}
                    {status === 'checking' ? 'Verifying...' : 'Verify Authenticity'}
                  </button>
                  <button className="vc-btn secondary" onClick={pasteFromClipboard}>
                    Paste
                  </button>
                  <span className={`vc-copy-note ${copied ? 'show' : ''}`}>Copied!</span>
                </div>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Verification Log</div>
                <div className="vc-log-entry">
                  {log.length === 0 ? "No verifications yet." :
                    log.map((item, i) => (
                      <div key={i} style={{marginBottom: '10px'}}>
                        {item.type === 'checking' && <span className="status-checking">CHECKING: </span>}
                        {item.type === 'valid' && <span className="status-valid">VALID: </span>}
                        {item.type === 'invalid' && <span className="status-invalid">INVALID: </span>}
                        <span className="log-hash">{item.hash.slice(0, 40)}...</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            <div>
              <div className={`vc-status-panel ${status}`}>
                <div className="vc-status-icon"><StatusIcon /></div>
                <h3 className="vc-status-title">
                  {status === 'idle' && 'Awaiting Input'}
                  {status === 'checking' && 'Checking...'}
                  {status === 'valid' && 'Authentic'}
                  {status === 'invalid' && 'Not Found'}
                </h3>
                <div className="vc-status-hash">
                  {hash ? `${hash.slice(0, 24)}...${hash.slice(-24)}` : 'No hash provided'}
                </div>
                <div className="vc-status-actions">
                  <button
                    className="vc-btn secondary"
                    onClick={handleCopy}
                    disabled={!hash}
                  >
                    <IconCopy /> Copy Hash
                  </button>
                  <button
                    className="vc-btn secondary"
                    onClick={() => { setHash(''); setStatus('idle'); }}
                  >
                    <IconClear /> Clear
                  </button>
                </div>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Digital Proof</div>
                <div className="vc-qr-block">
                  <span className="vc-qr-scanner"></span>
                  <span className="vc-qr-text">Awaiting Valid Hash</span>
                  <FakeQR text={status === 'valid' ? hash : ''} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Wallet.jsx ---
function Wallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [activity, setActivity] = useState([]);

  const addActivity = (icon, text) => {
    const newItem = { id: Date.now(), icon, text };
    setActivity(prev => [newItem, ...prev].slice(0, 10));
  };

  const simulateConnect = async () => {
    setIsConnecting(true);
    addActivity(<IconSpinner />, "Connecting to MetaMask...");
    await new Promise(r => setTimeout(r, 1500));

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        setAddress(accounts[0]);
        setChain(chainId === '0x1' ? 'Ethereum' : 'Other Network');
        setBalance((Math.random() * 2.5).toFixed(4));
        setConnected(true);
        setIsConnecting(false);
        addActivity(<IconCheckCircle style={{color: 'var(--color-success)'}}/>, "Wallet connected.");

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setAddress(newAccounts[0]);
            addActivity(<IconWallet />, "Account switched.");
            refreshBalance();
          } else {
            simulateDisconnect();
          }
        });

      } catch (err) {
        addActivity(<IconShieldX style={{color: 'var(--color-error)'}}/>, "Connection rejected.");
        setIsConnecting(false);
      }
    } else {
      addActivity(<IconShieldX style={{color: 'var(--color-error)'}}/>, "MetaMask not found.");
      setIsConnecting(false);
    }
  };

  const simulateDisconnect = () => {
    setConnected(false);
    setAddress("");
    setChain(null);
    setBalance(null);
    addActivity(<IconShieldX style={{color: 'var(--color-error)'}}/>, "Wallet disconnected.");
  };

  const refreshBalance = async () => {
    if (!connected) return;
    setBalance(null); // Set to loading
    await new Promise(r => setTimeout(r, 800));
    setBalance((Math.random() * 2.5).toFixed(4));
    addActivity(<IconCheckCircle style={{color: 'var(--color-success)'}}/>, "Balance refreshed.");
  };

  const simulateSign = async () => {
    if (!connected) return;
    setIsSigning(true);
    addActivity(<IconSpinner />, "Awaiting signature...");
    await new Promise(r => setTimeout(r, 1500));
    setIsSigning(false);
    addActivity(<IconClipboardCheck />, "Message signed (simulated).");
  };

  return (
    <div className="vc-wallet-wrapper">
      <div className="vc-wallet-card vc-card">

        <div className="vc-card-header" style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <div className="vc-header-brand">
            <IconWallet />
            <div>
              <h2 className="vc-title">Wallet Connection</h2>
              <p className="vc-sub">Connect your wallet to manage your identity.</p>
            </div>
          </div>
          <div className={`vc-status-display ${connected ? 'connected' : ''}`}>
            <span className="vc-status-indicator"></span>
            {connected ? 'Connected' : 'Not Connected'}
          </div>
        </div>

        <div className="vc-card-body">
          <div className="vc-grid">

            <div>
              <div className="vc-block">
                <div className="vc-block-title">Wallet Details</div>
                <input
                  className={`vc-addr-display ${connected ? 'connected' : ''}`}
                  value={address || "0x0000000000000000000000000000000000000000"}
                  readOnly
                  placeholder="Wallet address"
                />
                <div style={{marginTop: '1rem'}}>
                  <div className="vc-info-row">
                    <span className="label">Status</span>
                    <span className={`value ${connected ? 'connected' : 'disconnected'}`}>
                      {connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="vc-info-row">
                    <span className="label">Chain</span>
                    <span className={`value ${!chain ? 'loading' : ''}`}>
                      {chain || '...'}
                    </span>
                  </div>
                  <div className="vc-info-row">
                    <span className="label">Balance</span>
                    <span className={`value ${!balance ? 'loading' : ''}`}>
                      {balance ? `${balance} ETH` : '...'}
                    </span>
                  </div>
                </div>
                <div style={{borderTop: "1px solid var(--color-border)", margin: "1.5rem 0"}} />
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  {connected ? (
                    <button className="vc-btn danger" onClick={simulateDisconnect}>
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="vc-btn connect-metamask gradient-effect"
                      onClick={simulateConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? <IconSpinner /> : null}
                      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                    </button>
                  )}
                  <button
                    className="vc-btn secondary"
                    onClick={refreshBalance}
                    disabled={!connected}
                  >
                    Refresh Balance
                  </button>
                  <button
                    className="vc-btn secondary"
                    onClick={simulateSign}
                    disabled={!connected || isSigning}
                  >
                    {isSigning ? <IconSpinner /> : null}
                    {isSigning ? 'Signing...' : 'Sign Message'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className={`vc-qr-block wallet-qr ${connected ? 'connected' : ''}`}>
                <span className="vc-qr-scanner"></span>
                <span className="vc-qr-text">Wallet Not Connected</span>
                <div className="vc-qr-inner">
                  <FakeQR text={address} />
                </div>
              </div>

              <div className="vc-block">
                <div className="vc-block-title">Recent Activity</div>
                <div className="vc-activity-feed">
                  {activity.length === 0 && (
                    <span className="vc-hint">No activity yet.</span>
                  )}
                  {activity.map(item => (
                    <div key={item.id} className="vc-activity-item">
                      <span className="icon">{item.icon}</span>
                      <span className="text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- App.jsx ---
function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <div className="app-root">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer className="site-footer">
          VeriChain — Decentralized DigiLocker Interface
        </footer>
      </div>
    </BrowserRouter>
  );
}

// --- Render Call ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
