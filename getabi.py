#!/usr/bin/python
import argparse
import requests
import json


ABI_ENDPOINT = 'https://api.etherscan.io/api?module=contract&action=getabi&address='


def get_contract_abi(contract_address):
    response = requests.get(f'{ABI_ENDPOINT}{contract_address}')
    response_json = response.json()

    if response_json['status'] == '1':
        return json.loads(response_json['result'])
    else:
        raise ValueError(f"Failed to retrieve ABI. Etherscan API returned error: {response_json['message']}")


def save_abi_to_file(abi, output_path):
    with open(output_path, 'w') as output_file:
        json.dump({"abi": abi}, output_file, indent=4, sort_keys=True)


def main():
    parser = argparse.ArgumentParser(description='Export Ethereum contract ABI in JSON')
    parser.add_argument('addr', type=str, help='Contract address')
    parser.add_argument('-o', '--output', type=str, help="Path to the output JSON file", required=True)

    args = parser.parse_args()

    try:
        contract_abi = get_contract_abi(args.addr)
        save_abi_to_file(contract_abi, args.output)
        print(f"ABI successfully retrieved and saved to {args.output}")
    except ValueError as e:
        print(f"Error: {e}")


if __name__ == '__main__':
    main()
