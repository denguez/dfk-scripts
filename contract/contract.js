const ethers = require('ethers');
const config = require('../config/global.json');
const { sleep } = require('../scripts/util')

const provider = new ethers.providers.JsonRpcProvider(config['harmony-rpc']);
const wallet = new ethers.Wallet(require('../config/private.json')['private-key'], provider)

module.exports = {
    utils: ethers.utils,
    Contract(address, abi) {
        const contract = new ethers.Contract(address, abi, wallet)
        contract.callFunction = async (fn, ...args) => {
            try {
                const contractFunction = contract.functions[fn]
                const tx = await contractFunction(...args)
                const receipt = await tx.wait()
                if (receipt.status == 1) {
                    console.log(`✅ Tx completed ⛽ ${receipt.gasUsed.toString()} | https://explorer.harmony.one/tx/${receipt.transactionHash}`)
                } else {
                    console.log("❌ Tx failed", receipt)
                }
            } catch (ex) {
                console.log("❌ Tx exception", ex)
            }
        }

        const callFunctionRetry = async (attempt, fn, ...args) => {
            const retry = async (ex) => {
                if (attempt >= config["max-tries"]) {
                    console.log(`❌ Tx failed: MAX_TRIES ${attempt}`, ex)
                } else {
                    console.log("❌ Tx failed, retrying...", ex)
                    await sleep(3)
                    await callFunctionRetry(attempt + 1, fn, ...args)
                }
            }
            try {
                console.log(`▶️ Sending Tx ${fn}: Attempt ${attempt}`)
                const contractFunction = contract.functions[fn]
                const tx = await contractFunction(...args)
                const receipt = await tx.wait()
                if (receipt.status == 1) {
                    console.log(`✅ Tx completed ⛽ ${receipt.gasUsed.toString()} | https://explorer.harmony.one/tx/${receipt.transactionHash}`)
                } else {
                    await retry(receipt)
                }
            } catch (ex) {
                await retry(ex)
            }
        }

        contract.callFunctionRetry = async (fn, ...args) => {
            await callFunctionRetry(1, fn, ...args)
        }
        return contract
    },
}