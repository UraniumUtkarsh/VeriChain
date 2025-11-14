import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from web3 import Web3
from config import w3, contract

app = Flask(__name__)
CORS(app)  # allow frontend requests


# -------------------------
# Helper: Compute SHA-256 hash
# -------------------------
def compute_hash(file_bytes):
    sha256 = hashlib.sha256()
    sha256.update(file_bytes)
    return sha256.hexdigest()


# -------------------------
# Upload a file + store on blockchain
# -------------------------
@app.post("/upload")
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    wallet = request.form.get("wallet")
    cid = request.form.get("cid", "")   # optional, only if IPFS is used

    if not wallet:
        return jsonify({"error": "Wallet address required"}), 400

    file_bytes = file.read()
    file_hash = compute_hash(file_bytes)
    file_name = file.filename

    tx = contract.functions.storeDocument(file_hash, file_name, cid).transact({"from": Web3.to_checksum_address(wallet)})
    receipt = w3.eth.wait_for_transaction_receipt(tx)

    return jsonify({
        "message": "Document stored",
        "hash": file_hash,
        "name": file_name,
        "cid": cid,
        "tx_hash": receipt.transactionHash.hex()
    })


# -------------------------
# Store when hash already computed client-side
# -------------------------
@app.post("/store")
def store():
    data = request.json
    wallet = data.get("wallet")
    file_hash = data.get("hash")
    file_name = data.get("name")
    cid = data.get("cid", "")

    if not wallet or not file_hash or not file_name:
        return jsonify({"error": "wallet, hash, name required"}), 400

    tx = contract.functions.storeDocument(file_hash, file_name, cid).transact({"from": Web3.to_checksum_address(wallet)})
    receipt = w3.eth.wait_for_transaction_receipt(tx)

    return jsonify({"message": "stored", "tx_hash": receipt.transactionHash.hex()})


# -------------------------
# Retrieve documents of a wallet
# -------------------------
@app.post("/retrieve")
def retrieve():
    wallet = request.json.get("wallet")
    if not wallet:
        return jsonify({"error": "wallet required"}), 400

    docs = contract.functions.getDocumentsByOwner(Web3.to_checksum_address(wallet)).call()

    formatted = [
        {"hash": d[0], "name": d[1], "timestamp": d[2], "cid": d[3]}
        for d in docs
    ]

    return jsonify({"documents": formatted})


# -------------------------
# Verify by hash (public verifier)
# -------------------------
@app.get("/verify")
def verify():
    file_hash = request.args.get("hash")
    if not file_hash:
        return jsonify({"error": "hash required"}), 400

    exists, owner, ts, name, cid, revoked = contract.functions.verifyByHash(file_hash).call()

    return jsonify({
        "exists": exists,
        "owner": owner if exists else None,
        "timestamp": ts,
        "name": name,
        "cid": cid,
        "revoked": revoked
    })


# -------------------------
# Revoke document (only owner can)
# -------------------------
@app.post("/revoke")
def revoke():
    wallet = request.json.get("wallet")
    file_hash = request.json.get("hash")

    if not wallet or not file_hash:
        return jsonify({"error": "wallet and hash required"}), 400

    tx = contract.functions.revokeDocument(file_hash).transact({"from": Web3.to_checksum_address(wallet)})
    receipt = w3.eth.wait_for_transaction_receipt(tx)

    return jsonify({"message": "revoked", "tx_hash": receipt.transactionHash.hex()})


if __name__ == "__main__":
    app.run(debug=True)
