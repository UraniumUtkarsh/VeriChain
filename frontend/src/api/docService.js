// frontend/src/api/docService.js
// Small API client for the VeriChain backend
// Exports: storeDocument, retrieveDocuments, revokeDocument, verifyHash

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

/**
 * storeDocument
 * payload: { wallet, hash, name }
 * returns backend response (tx_hash or message)
 */
export async function storeDocument(payload) {
  if (!payload) throw new Error("storeDocument: payload required");
  const res = await client.post("/store", payload);
  return res.data;
}

/**
 * retrieveDocuments
 * payload: { wallet } OR can be empty (depends on backend)
 * returns array/object depending on backend; we return res.data
 */
export async function retrieveDocuments(payload = {}) {
  // backend may expect POST { wallet } or GET; try POST first
  try {
    const res = await client.post("/retrieve", payload);
    return res.data;
  } catch (err) {
    // if backend supports GET /retrieve (no body), fallback
    if (err.response && err.response.status === 404) {
      const res2 = await client.get("/retrieve");
      return res2.data;
    }
    throw err;
  }
}

/**
 * revokeDocument
 * payload: { wallet, hash } or { wallet, tx_hash } depending on backend
 */
export async function revokeDocument(payload) {
  if (!payload) throw new Error("revokeDocument: payload required");
  const res = await client.post("/revoke", payload);
  return res.data;
}

/**
 * verifyHash
 * payload: { hash } or { wallet, hash } depending on backend
 * returns verification result object
 */
/* It used POST method so changing to GET method, matching backend
export async function verifyHash(payload) {
  if (!payload) throw new Error("verifyHash: payload required");
  const res = await client.post("/verify", payload);
  return res.data;
}
*/
export async function verifyHash(payload) {
  if (!payload || !payload.hash)
    throw new Error("verifyHash: { hash } required");

  const res = await client.get("/verify", {
    params: { hash: payload.hash }
  });

  return res.data;
}


/* Optional: named default export with all functions */
export default {
  storeDocument,
  retrieveDocuments,
  revokeDocument,
  verifyHash,
};
