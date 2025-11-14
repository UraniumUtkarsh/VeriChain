from brownie import VeriChain, accounts

def main():
    # Use the first account from Brownie's local network
    acct = accounts[0]
    print(f"Deploying VeriChain contract from {acct}")
    
    # Deploy contract
    contract = VeriChain.deploy({"from": acct})
    
    print(f"Contract deployed at: {contract.address}")
    return contract
