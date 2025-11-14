import pytest
from brownie import VeriChain, accounts

def test_store_and_retrieve():
    acct = accounts[0]
    # Deploy the contract
    contract = VeriChain.deploy({"from": acct})
    
    # Store some data
    contract.storeData("Hello, VeriChain!", {"from": acct})
    
    # Retrieve the data
    retrieved = contract.retrieveData()
    assert retrieved == "Hello, VeriChain!"

def test_only_owner_can_store():
    acct = accounts[0]
    other = accounts[1]
    contract = VeriChain.deploy({"from": acct})
    
    # Attempt to store from a different account should fail
    with pytest.raises(Exception):
        contract.storeData("Hacker data", {"from": other})
