const ABI = require('../../config/abis.json')['sale-auctions']
const ADDRESS = require('../../config/contracts.json')['sale-auctions']
const ADDRESS_ZERO = require('../../config/global.json')['address-zero']

const { Contract, utils } = require('../contract')
const contract = Contract(ADDRESS, ABI)

module.exports = {
    async getAuction(heroId) {
        return await contract.functions.getAuction(heroId)
    },
    async cancelAuction(heroId) {
        console.log(`▶️ Hero ${heroId}: Cancel auction`)
        await contract.callFunction('cancelAuction', heroId)
    },
    async createPublicAuction(heroId, price) {
        const duration = 8 * 60 * 60 * 1000
        //const price = utils.parseUnits(jewelPrice.toString(), 18).toString()
        console.log(`▶️ Hero ${heroId}: Create public auction -> Price: ${price}, Duration: ${duration}`)
        await contract.callFunction('createAuction', heroId, price, price, duration, ADDRESS_ZERO)
    },
    async isOnAuction(heroId) {
        try {
            await contract.functions.getAuction(heroId)
            return true
        } catch (ex) {
            return false
        }
    }
}