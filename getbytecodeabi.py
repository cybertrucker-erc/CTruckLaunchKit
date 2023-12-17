import sys
import requests
import json

import os
from dotenv import load_dotenv

load_dotenv()

ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY')

def get_first_transaction_hash(contract_address):
    url = 'https://api-goerli.etherscan.io/api'
    params = {
        'module': 'account',
        'action': 'txlist',
        'address': contract_address,
        'sort': 'asc',
        'page': 1,
        'offset': 1,
        'apikey': ETHERSCAN_API_KEY
    }

    response = requests.get(url, params=params)
    transactions = response.json().get('result', [])
    
    if transactions:
        return transactions[0].get('hash', '')
    else:
        print(f"No transactions found for the contract address: {contract_address}")
        return None

def get_input_data(transaction_hash):
    url = 'https://api-goerli.etherscan.io/api'
    params = {
        'module': 'proxy',
        'action': 'eth_getTransactionByHash',
        'txhash': transaction_hash,
        'apikey': ETHERSCAN_API_KEY
    }

    response = requests.get(url, params=params)
    try:
        transaction_data = response.json().get('result', {})
        return transaction_data.get('input', '')
    except AttributeError:
        print(f"Invalid response from the API: {response.text}")
        return None

def get_verified_abi(contract_address):
    #api?module=contract&action=getabi&address=
    url = 'https://api-goerli.etherscan.io/api'
    params = {
        'module': 'contract',
        'action': 'getabi',
        'address': contract_address,
        'apikey': ETHERSCAN_API_KEY
    }

    response = requests.get(url, params=params)
    try:
        transaction_data = response.json().get('result', {})
        return transaction_data
    except AttributeError:
        print(f"Invalid response from the API: {response.text}")
        return None


def save_abi_to_file(abi, output_path):
    with open(output_path, 'w') as output_file:
        json.dump({"abi": abi}, output_file, indent=4, sort_keys=True)

def save_bytecode_to_file(bytecode, output_path):
    with open(output_path, 'w') as output_file:
        json.dump({"bytecode": bytecode}, output_file, indent=4, sort_keys=True)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python getbytecodeabi.py <contract_address>")
        sys.exit(1)

    contract_address = sys.argv[1]

    # Get the first transaction hash for the specified contract address
    # uncomment if you already have hash
    # transaction_hash = somehash
    transaction_hash = get_first_transaction_hash(contract_address)

    

    if transaction_hash:
        # Get the input data from the specified transaction hash
        input_data = get_input_data(transaction_hash)

        if input_data:
            print("Input Data:", input_data)
            save_bytecode_to_file(input_data, "./bytecode.json")
        else:
            print("Input data not found for the contract.")

        abi = get_verified_abi(contract_address)
        if abi:
            print("ABI:", abi)
            save_abi_to_file(abi, "./contractabi.json")
        else:
            print("no abi found for the contract")
    else:
        print("No transactions found for the contract address.")


