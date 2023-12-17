/* global ethers */
/* eslint prefer-const: "off" */

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;


async function deploy () {
  const Ctrucker = await ethers.getContractFactory('CyberTrucker')
  const ctrucker = await Ctrucker.deploy()
  await ctrucker.deployed()
  console.log('TestTrucker deployed:', ctrucker.address)

}

async function checkGas() {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  const provider = new ethers.providers.JsonRpcProvider(API_URL);

  const feeData = await provider.getFeeData();
  console.log(feeData)

  let gasPrice = feeData.gasPrice;
  let maxFeePerGas = feeData.maxFeePerGas;
  let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

  // Convert the gas price from Wei to Gwei for better readability

  const gasPriceInEth = ethers.utils.formatUnits(gasPrice, 'ether');
  const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
  const gasPriceInWei = ethers.utils.formatUnits(gasPrice, 'wei');
  console.log('eth', gasPriceInEth)
  console.log('gwei', gasPriceInGwei)
  console.log('wei', gasPriceInWei)

}

/*
let parameter = {
    from: account,
    gas: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
}
*/


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deploy()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deploy = deploy
