# CTruckLaunchKit

## How to set up a development environment

Setting up a development environment to interact with smart contracts on Ethereum:

1. Create API keys on Alchemy - [https://dashboard.alchemy.com/apps](https://dashboard.alchemy.com/apps)

2. Clone the starterKit/launchKit:
   ```bash
   git clone CTruckStarterKit
   ```

3. Go to the directory:
   ```bash
   cd CTruckStarterKit
   ```

4. Install Hardhat with the following command:
   ```bash
   npm install --save-dev hardhat
   ```

5. Install remaining dependencies:
   ```bash
   npm install
   ```

6. Create a file named `.env` in the root with the following content:
   ```env
   API_URL = "https://eth-sepolia.g.alchemy.com/v2/your-api-key"
   API_KEY = "your-alchemy-api-key"
   PRIVATE_KEY = "your-metamask-private-key"
   CONTRACT_ADDRESS = "target-contract-address"
   ```
