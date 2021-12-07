const ABI = require('../../config/abis.json')['heroes']
const ADDRESS = require('../../config/contracts.json')['heroes']
const ADDRESS_ZERO = require('../../config/global.json')['address-zero']

const { Contract } = require('../contract')
const contract = Contract(ADDRESS, ABI)

module.exports = {
    async getHero(heroId) {
        return await contract.functions.getHero(heroId)[0]
    },
    async isOnAQuest(heroId) {
        const res = await contract.functions.getHero(heroId)
        return res[0]['state']['currentQuest'] != ADDRESS_ZERO
    },
    async getUserHeroes(address) {
        const heroes = await contract.functions.getUserHeroes(address)
        if (heroes instanceof Array) {
            return heroes[0].map(it => it.toString())
        } else {
            return [heroes.toString()]
        }
    },
}