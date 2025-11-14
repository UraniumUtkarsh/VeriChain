import os
import json
from pathlib import Path
from dotenv import load_dotenv
from web3 import Web3

# Load .env
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)

# Blockchain provider (Ganache or Brownie local chain)
WEB3_PROVIDER = os.getenv("WEB3_PROVIDER", "http://127.0.0.1:8545")
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))

if not w3.is_connected():
    raise RuntimeError(f"❌ Web3 connection failed → {WEB3_PROVIDER}")

# Contract address from deploy output
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
if not CONTRACT_ADDRESS:
    raise RuntimeError("❌ CONTRACT_ADDRESS not found in .env")

CONTRACT_ADDRESS = Web3.to_checksum_address(CONTRACT_ADDRESS)

# Load ABI from copied JSON in backend/contracts/
ABI_PATH = BASE_DIR / "contracts" / "VeriChain.json"
if not ABI_PATH.exists():
    raise FileNotFoundError(f"❌ ABI file missing: {ABI_PATH} (copy from brownie build)")

with open(ABI_PATH, "r", encoding="utf-8") as f:
    contract_json = json.load(f)
    contract_abi = contract_json["abi"]

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

# Default sender (for emergency / testing only)
DEFAULT_SENDER = os.getenv("DEFAULT_SENDER")
if not DEFAULT_SENDER:
    # fallback to Ganache first account
    if not w3.eth.accounts:
        raise RuntimeError("❌ No unlocked accounts found. Make sure Brownie/Ganache is running.")
    DEFAULT_SENDER = w3.eth.accounts[0]

DEFAULT_SENDER = Web3.to_checksum_address(DEFAULT_SENDER)

print("✅ Blockchain Connected")
print("→ Provider:", WEB3_PROVIDER)
print("→ Contract:", CONTRACT_ADDRESS)
print("→ Default Sender (fallback only):", DEFAULT_SENDER)
