
/* global ethers task */
require('@nomiclabs/hardhat-waffle');
require('hardhat-contract-sizer');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */


require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
const { API_URL, API_KEY, PRIVATE_KEY, CONTRACT_ADDRESS, ETHERSCAN_API_KEY} = process.env;

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    hardhat: {
    },
    goerli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mainnet: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: '0.8.11',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}


