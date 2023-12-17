/* global ethers */
/* eslint prefer-const: "off" */

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const fs = require("fs")
const path = require("path")

async function deploy () {
  

  var abi = [];
  var bytecode = require('./bytecode.json');

  const Contract = await hre.ethers.getContractFactory(abi, bytecode['bytecode']);
  const deployed = await Contract.deploy();

  await deployed.deployed();

  console.log(
    `Contract deployed to ${deployed.address}!`
  );

}



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
