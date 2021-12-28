const Web3 = require('web3')
const BeinChainAbi = require('./abi/BeinChain.json')
const PrivateAbi = require('./abi/Private.json')
require('dotenv').config();
const web3 = new Web3(process.env.NETWORK === 'mainnet'? 'https://bsc-dataseed.binance.org/' : 'https://data-seed-prebsc-1-s1.binance.org:8545/')

const privateContractAddress = process.env.PRIVATE_ADDRESS
const bicContract = new web3.eth.Contract(BeinChainAbi, process.env.BIC_ADDRESS)
const privateContract = new web3.eth.Contract(PrivateAbi, privateContractAddress)

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let latestScanBlock;
const main = async () => {
    try {

        await sleep(3000)
        if(!latestScanBlock) {
            latestScanBlock = await web3.eth.getBlockNumber()
            main()
        } else {
            const currentBlock = await web3.eth.getBlockNumber()
            const pastEvents = await bicContract.getPastEvents('Transfer', { fromBlock: latestScanBlock, toBlock: currentBlock })
            for(const eachEvent of pastEvents) {
                if(eachEvent.returnValues.to === privateContractAddress) {
                    console.log(`BIC come: ${eachEvent.returnValues.value} BIC. Lets Goooooooo!`)

                }
            }
            latestScanBlock = currentBlock;
        }
    } catch (e) {
        console.error('Getting error because: ', e.stack)
    }
}

main()
