const ABI = require('../../config/abis.json')['wishing-well']
const ADDRESS = require('../../config/contracts.json')['wishing-well']

const { Contract } = require('../contract')
const contract = Contract(ADDRESS, ABI)

module.exports = {
    STAMINA_COST: 5,
    async getCurrentStamina(heroId) {
        return (await contract.functions.getCurrentStamina(heroId)).toString()
    },
    async startQuest(heroId, attemtps) {
        console.log(`▶️ Hero #${heroId}: Start wishing well quest -> Attempts: ${attemtps}`)
        await contract.callFunction('startQuest', heroId, attemtps)
    },
    async completeQuest(heroId) {
        console.log(`▶️ Hero #${heroId}: Complete wishing well quest`)
        await contract.callFunction('completeQuest', heroId)
    },
    async completeQuestRetry(heroId) {
        console.log(`▶️ Hero #${heroId}: Complete wishing well quest`)
        await contract.callFunctionRetry('completeQuest', heroId)
    },
}