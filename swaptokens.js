const cadetails = require("./artifacts/contracts/CyberTrucker.sol/CyberTrucker.json");
const routerdetails = require("./routerabi.json");
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY2;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

const { ChainId, Token, CurrencyAmount, TradeType, WETH9, Percent } = require('@uniswap/sdk-core')
const { Pair, Trade, Route } = require("@uniswap/v2-sdk");
//
const { getAddress } = require("ethers/lib/utils");

const CHAIN_ID = ChainId.GOERLI;

async function swapTokensForEth(tokenB, isPrivate = false, slippage = "50", otherTokenAmount = "1000000000000000000") {
    try {
	  const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL); 

	  if(isPrivate) {
		provider = ethers.getDefaultProvider('http://localhost:8545')
	  } else {
		provider = alchemyProvider
	  }
		myWallet = new ethers.Wallet(PRIVATE_KEY, provider)

	  const truckcontract = new ethers.Contract(CONTRACT_ADDRESS, cadetails.abi, myWallet);
	  const uniswapcontract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerdetails.abi, myWallet);
	  myAddress = await myWallet.getAddress()

	
	  const tokenA = WETH9[CHAIN_ID]
	  //const tokenB = new Token(CHAIN_ID, CONTRACT_ADDRESS, 18)
	  const pairAddress = Pair.getAddress(tokenA, tokenB)

	  //const provider = new ethers.providers.InfuraProvider(CHAIN_ID, '<MY INFURA KEY>')
	  const contract = new ethers.Contract(pairAddress, [
	    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
	    'function token0() external view returns (address)',
	    'function token1() external view returns (address)'
	  ], provider)
	  const reserves = await contract.getReserves()
	  const token0Address = await contract.token0()
	  const token1Address = await contract.token1()
	  const token0 = [tokenA, tokenB].find(token => token.address === token0Address)
	  const token1 = [tokenA, tokenB].find(token => token.address === token1Address)
	  const pair = new Pair(
	    CurrencyAmount.fromRawAmount(token0, reserves.reserve0.toString()),
	    CurrencyAmount.fromRawAmount(token1, reserves.reserve1.toString())
	  )

	  const route = new Route([pair], tokenB, tokenA)
	  const tokenAmount = CurrencyAmount.fromRawAmount(tokenB, otherTokenAmount)
	  const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT)
	  //console.log('execution price', trade.executionPrice)
	  console.log('execution price', trade.executionPrice.toSignificant(18))

	  const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
	  //console.log(slippageTolerance)
	  console.log('worst execution price', trade.worstExecutionPrice(slippageTolerance).toSignificant(18))

	  let amountInMax = otherTokenAmount; 

	  const amountOut = trade.minimumAmountOut(slippageTolerance).toExact(); // needs to be converted to e.g. hex
      amountOutWei=ethers.utils.parseUnits(amountOut.toString(), 18);
      console.log(amountOutWei);
      const amountOutHex = ethers.BigNumber.from(amountOutWei).toHexString();

	  const path = [tokenB.address, tokenA.address]; //An array of token addresses
      const to = myAddress; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

      //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
      const rawTxn = await uniswapcontract.populateTransaction.swapTokensForExactTokens(amountOutHex, amountInMax, path, to, deadline)
      console.log(rawTxn)


      if(isPrivate){
			signed_tx = await myWallet.signTransaction(raw_tx)
			console.log("signed tx ", signed_tx)

			// Signer
		    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
		    myMainAddress = await signer.getAddress()
		    console.log("main address:", myMainAddress)

			//maxBlockNumber = 5
			maxBlockNumber = await alchemyProvider.getBlockNumber()
			maxBlockNumber += 5
			console.log(maxBlockNumber)
			ret = await alchemyProvider.send("eth_sendPrivateTransaction", [
			    {
			      "tx": signed_tx,
			      "maxBlockNumber": ethers.utils.hexlify(maxBlockNumber),
			      "preferences": {
			        "fast": true,
			        "privacy": {
			          "hints": ["calldata", "transaction_hash"],
			          "builders": ["default"]
			        },
			        "validity": {
			          "refund": [{"address": myAddress, "percent": 50}]
			        }
			      }
			    }
			  ]);

			console.log(ret)

		} else {
			
    
	        //Returns a Promise which resolves to the transaction.
	        let sendTxn = (await myWallet).sendTransaction(rawTxn)
	        

	        //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
	        let reciept = (await sendTxn).wait()

	        //Logs the information about the transaction it has been mined.
	        
	        if (reciept) {
	            console.log(" - Transaction is mined - " + '\n' 
	            + "Transaction Hash:", (await sendTxn).hash
	            + '\n' + "Block Number: " 
	            + (await reciept).blockNumber + '\n' 
	            + "Navigate to https://goerli.etherscan.io/txn/" 
	            + (await sendTxn).hash, "to see your transaction")
	        } else {
	            console.log("Error submitting transaction")
	        }
	        

		}

      

    } catch(e) {
        console.log(e)
    }


}

async function swapEthForTokens(tokenB, isPrivate = false, slippage = "50", ethTokenAmount = "1000000000000000000") {
  try {
	  const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL); 

	  if(isPrivate) {
		provider = ethers.getDefaultProvider('http://localhost:8545')
	  } else {
		provider = alchemyProvider
	  }
		myWallet = new ethers.Wallet(PRIVATE_KEY, provider)

	  const truckcontract = new ethers.Contract(CONTRACT_ADDRESS, cadetails.abi, myWallet);
	  const uniswapcontract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerdetails.abi, myWallet);
	  myAddress = await myWallet.getAddress()

	
	  //const ctAddress = CONTRACT_ADDRESS
	  const tokenA = WETH9[CHAIN_ID]
	  //const tokenB = new Token(CHAIN_ID, CONTRACT_ADDRESS, 18)
	  const pairAddress = Pair.getAddress(tokenA, tokenB)

	  //const provider = new ethers.providers.InfuraProvider(CHAIN_ID, '<MY INFURA KEY>')
	  const contract = new ethers.Contract(pairAddress, [
	    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
	    'function token0() external view returns (address)',
	    'function token1() external view returns (address)'
	  ], provider)
	  const reserves = await contract.getReserves()
	  const token0Address = await contract.token0()
	  const token1Address = await contract.token1()
	  const token0 = [tokenA, tokenB].find(token => token.address === token0Address)
	  const token1 = [tokenA, tokenB].find(token => token.address === token1Address)
	  const pair = new Pair(
	    CurrencyAmount.fromRawAmount(token0, reserves.reserve0.toString()),
	    CurrencyAmount.fromRawAmount(token1, reserves.reserve1.toString())
	  )

	  const route = new Route([pair], tokenA, tokenB)
	  const tokenAmount = CurrencyAmount.fromRawAmount(tokenA, ethTokenAmount)
	  const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT)
	  //console.log('execution price', trade.executionPrice)
	  console.log('execution price', trade.executionPrice.toSignificant(18))

	  const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
	  //console.log(slippageTolerance)
	  console.log('worst execution price', trade.worstExecutionPrice(slippageTolerance).toSignificant(18))
	  //console.log('worst execution price', trade.worstExecutionPrice(slippageTolerance))
	  const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact(); // needs to be converted to e.g. hex
      //todo: use token.decimals instead of hardcoding 18s
      amountOutMinWei=ethers.utils.parseUnits(amountOutMin.toString(), 18)
      console.log("amountOutMin:", amountOutMinWei)
      const amountOutMinHex = ethers.BigNumber.from(amountOutMinWei).toHexString();
      //const amountOutMinHex = amountOutMin.toHexString();
	  //console.log("amountOutMin:", Math.trunc(amountOutMin))

	  const path = [tokenA.address, tokenB.address]; //An array of token addresses
      const to = myAddress; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      const value = trade.inputAmount.toExact(); // // needs to be converted to e.g. hex
      //console.log("trade.inputAmount:", trade.inputAmount)
      console.log("value:", value)
      const valuewei=ethers.utils.parseUnits(value.toString(), 18)
      const valueHex = await ethers.BigNumber.from(valuewei).toHexString(); //convert to hex string
      console.log("value hex:", valueHex)

      //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
      const rawTxn = await uniswapcontract.populateTransaction.swapExactETHForTokens(amountOutMinHex, path, to, deadline, {
        value: valueHex
      })

      console.log(rawTxn)

      if(isPrivate){
		signed_tx = await myWallet.signTransaction(raw_tx)
		console.log("signed tx ", signed_tx)

		

		// Signer
	    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
	    myMainAddress = await signer.getAddress()
	    console.log("main address:", myMainAddress)

		//maxBlockNumber = 5
		maxBlockNumber = await alchemyProvider.getBlockNumber()
		maxBlockNumber += 5
		console.log(maxBlockNumber)
		ret = await alchemyProvider.send("eth_sendPrivateTransaction", [
		    {
		      "tx": signed_tx,
		      "maxBlockNumber": ethers.utils.hexlify(maxBlockNumber),
		      "preferences": {
		        "fast": true,
		        "privacy": {
		          "hints": ["calldata", "transaction_hash"],
		          "builders": ["default"]
		        },
		        "validity": {
		          "refund": [{"address": myAddress, "percent": 50}]
		        }
		      }
		    }
		  ]);

		console.log(ret)

		} else {
			
    
	        //Returns a Promise which resolves to the transaction.
	        let sendTxn = (await myWallet).sendTransaction(rawTxn)
	        

	        //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
	        let reciept = (await sendTxn).wait()

	        //Logs the information about the transaction it has been mined.
	        
	        if (reciept) {
	            console.log(" - Transaction is mined - " + '\n' 
	            + "Transaction Hash:", (await sendTxn).hash
	            + '\n' + "Block Number: " 
	            + (await reciept).blockNumber + '\n' 
	            + "Navigate to https://goerli.etherscan.io/txn/" 
	            + (await sendTxn).hash, "to see your transaction")
	        } else {
	            console.log("Error submitting transaction")
	        }
	        

		}

     } catch(e) {
        console.log(e)
    }


}

async function main() {
	//tradename=swapeth isPrivate=0 slippage=5000 tamount=100000 npx hardhat run swaptokens.js
	//tradename=swaptok isPrivate=0 slippage=500 tamount=1000000000000000000 npx hardhat run swaptokens.js
	CTRUCK = new Token(CHAIN_ID, CONTRACT_ADDRESS, 18);

	isPrivate = process.env.isPrivate == "0"?0:1; 
	slippage = process.env.slippage; //500 default
	tamount = process.env.tamount; //wei

	if(process.env.tradename == "swapeth") {
		await swapEthForTokens(CTRUCK, isPrivate, slippage, tamount)
	} else if(process.env.tradename == "swaptok") {
		await swapTokensForEth(CTRUCK, isPrivate, slippage, tamount)
	}
	
}




main()
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });