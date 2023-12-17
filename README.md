## CTruckLaunchKit

### How to set up a development environment
Setting up a development environment to interact with smart contracts on ethereum:
Create api keys on alchemy - https://dashboard.alchemy.com/apps


Clone the starterKit/launchKit:

git clone CTruckStarterKit

Go to the directory

cd CTruckStarterKit


Install hardhat with following command:
npm install --save-dev hardhat


Install remaining:
npm install


Create file named .env in the root with following content:

API_URL = "https://eth-sepolia.g.alchemy.com/v2/your-api-key"
API_KEY = "your-alchemy-api-key"
PRIVATE_KEY = "your-metamask-private-key"
CONTRACT_ADDRESS = "target-contract-address"
