const ABI = require('../../config/abis.json')['profession-quest']
const ADDRESS_CORE = require('../../config/contracts.json')['quest-core']
const ADDRESS_FORAGING = require('../../config/contracts.json')['foraging-quest']
const ADDRESS_FISHING = require('../../config/contracts.json')['fishing-quest']

const { Contract } = require('../contract')
const contract = Contract(ADDRESS_CORE, ABI)

const professionAddress = {
    foraging: ADDRESS_FORAGING,
    fishing: ADDRESS_FISHING
}

module.exports = {
    STAMINA_COST: 5,
    async getCurrentStamina(heroId) {
        return (await contract.functions.getCurrentStamina(heroId)).toString()
    },
    async startQuest(heroIds, profession, attemtps) {
        console.log(`▶️ Heroes #${heroIds}: Start ${profession} quest -> Attempts: ${attemtps}`)
        await contract.callFunction('startQuest', heroIds, professionAddress[profession], attemtps)
    },
    async completeQuest(heroId) {
        console.log(`▶️ Hero #${heroId}: Complete profession quest`)
        await contract.callFunction('completeQuest', heroId)
    },
    async completeQuestRetry(heroId) {
        console.log(`▶️ Hero #${heroId}: Complete profession quest`)
        await contract.callFunctionRetry('completeQuest', heroId)
    },
    calculateQuestTime(numberOfHeroes, questAttempts) {
        const baseTime = 20
        const increasePerHero = 10
        const increasePerAttempt = 10
        const totalSeconds =
            numberOfHeroes * questAttempts * baseTime +
            increasePerHero * (questAttempts - 1) * numberOfHeroes +
            increasePerAttempt * (numberOfHeroes - 1) * questAttempts
        return totalSeconds
    }
}