import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { initCetusSDK } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { BN } from 'bn.js'
import { SuiKit, swap } from "./src";
import { readJson, saveDataToFile, saveNewFile, sleep } from "./utils";
import { NETWORK, POOL_ID, PRIVATE_KEY, RPC_ENDPOINT, MAX_TOKEN_AMOUNT, MIN_TOKEN_AMOUNT, RPC_WEBSOCKET_ENDPOINT, SELL_INTERVAL, SELL_INTERVAL_RANDOM } from "./constants";
import { getCoinDecimal } from "./src/getCoinDecimal";

const main = async () => {
  const client = new SuiClient({ url: RPC_ENDPOINT })
  const mainSui = new SuiKit({ secretKey: PRIVATE_KEY, fullnodeUrls: [RPC_ENDPOINT] })
  const balance = await mainSui.getBalance('0x2::sui::SUI')

  console.log(`Volume bot is running`)
  console.log(`Wallet address: ${mainSui.getAddress()}`)
  console.log(`Pool ID: ${POOL_ID}`)
  console.log(`Wallet SOL balance: ${(Number(balance.totalBalance) / 10 ** 9).toFixed(3)}SUI`)
  console.log(`Max sell token amount: ${MAX_TOKEN_AMOUNT}SUI`)
  console.log(`Min sell token amount: ${MIN_TOKEN_AMOUNT}SUI`)
  console.log(`Sell interval: ${SELL_INTERVAL}s`)


  const sdk = initCetusSDK({ network: NETWORK, fullNodeUrl: RPC_ENDPOINT })
  const pool = await sdk.Pool.getPool(POOL_ID)

  const coin = pool.coinTypeA == '0x2::sui::SUI' ? pool.coinTypeB : pool.coinTypeA

  const coins = await client.getBalance({ owner: mainSui.getAddress(), coinType: coin })
  const coinBalance = new BN(coins.totalBalance)

  const decimal = await getCoinDecimal(client, coin)
  if (!decimal) {
    console.log("Error fetching decimal of the token")
    return
  }



  const sellAction = async () => {
    try {
      const destSui = new SuiKit({ fullnodeUrls: [RPC_ENDPOINT] })
      // here saved the keypair into data.json file
      const mainBal = Number((await mainSui.getBalance('0x2::sui::SUI')).totalBalance) / 10 ** 9

      // SUI balance check
      if (mainBal < 0.1) {
        console.log("Not enough SUI in main wallet to make volume action")
        return
      }

      const simulationAccount = destSui.getAddress()
      sdk.senderAddress = simulationAccount;

      // calculate coin amount to transfer
      const coinUiAmount = Number(coinBalance.div(new BN(10 ** decimal)))

      const swapCoinUiAmount = Math.random() * (MAX_TOKEN_AMOUNT - MIN_TOKEN_AMOUNT) + MIN_TOKEN_AMOUNT
      const swapAmount = Math.round(swapCoinUiAmount * 10 ** decimal)


      if (coinUiAmount < swapCoinUiAmount) {
        console.log("Insufficient coin balance")
        return
      }

      saveDataToFile([{ privateKey: destSui.getKeypair().getSecretKey(), pubkey: destSui.getAddress() }])

      const transferSuiResp = await mainSui.transferSui(destSui.getAddress(), 5 * 10 ** 7)
      await client.waitForTransaction({ digest: transferSuiResp.digest })
      await sleep(1000)

      const transferCoinResp = await mainSui.transferCoin(destSui.getAddress(), swapAmount, coin)
      await client.waitForTransaction({ digest: transferCoinResp.digest })
      await sleep(1000)


      // sell part
      // kept as private part

      let transferBackDigest: string | null = null
      try {
        const tx = new Transaction()
        tx.transferObjects([tx.gas], mainSui.getAddress())

        if (tx) {
          /**
           * Transfer SUI back to main wallet part
           */
        }
      } catch (error) {
        console.log("Error while transferring back to main wallet")
        return
      }

      console.log("\n-----------------------------------New round ------------------------------------")
      console.log(`New wallet address :                 https://suiscan.xyz/mainnet/account/${destSui.getAddress()}`)
      console.log(swapCoinUiAmount.toFixed(3), "coin and 0.05SUI transferred to the new wallet")
      console.log(`Transfer Coin signature :            https://suiscan.xyz/mainnet/tx/${transferCoinResp.digest}`)
      console.log(`Transfer SUI signature :             https://suiscan.xyz/mainnet/tx/${transferSuiResp.digest}`)
      if (sellDigest)
        console.log(`Sell coin signature :              https://suiscan.xyz/mainnet/tx/${sellDigest}`)
      if (transferBackDigest)
        console.log(`Transfer SUI back to main wallet signature : https://suiscan.xyz/mainnet/tx/${transferBackDigest}`)
      console.log("----------------------------------------------------------------------------------\n")
    } catch (error) {
      console.log("Error in one of the sell process")
    }
  }

  for (; ;) {

    let sellInterval = SELL_INTERVAL * 1000
    if (SELL_INTERVAL_RANDOM)
      sellInterval = (0.9 + 0.2 * Math.random()) * sellInterval
    sellAction()
    await sleep(sellInterval)
  }

}

main()
