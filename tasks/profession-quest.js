const { sleep } = require('../scripts/util')
const Profession = require('../contract/quest/profession')
const Sales = require('../contract/auctions/sale-auction')
const Hero = require('../contract/hero/hero')
const HeroAPI = require('../api/hero/hero')

async function startQuestMaxAttempts(heroes, profession) {
    const minStamina = Math.min(...heroes.map(it => it.stamina))
    const maxAttempts = Math.floor(minStamina / Profession.STAMINA_COST)
    await Profession.startQuest(heroes.map(it => it.id), profession, maxAttempts)
    return Profession.calculateQuestTime(heroes.length, maxAttempts)
}

module.exports = async (heroes) => {
    const heroesOnQuest = []
    const heroesOnAuction = []
    const questMap = { "foraging": [], "fishing": [] }

    for (let i = 0; i < heroes.length; i++) {
        const stamina = await Profession.getCurrentStamina(heroes[i])
        if (stamina < Profession.STAMINA_COST) {
            console.log(`⚠️ Hero #${heroes[i]} not enough stamina: ${stamina}`)
        } else {
            if (await Sales.isOnAuction(heroes[i])) {
                console.log(`⚠️ Hero #${heroId} is on auction`)
                const auction = await Sales.getAuction(heroId)
                await Sales.cancelAuction(heroId)
                heroesOnAuction.push({
                    id: heroes[i],
                    price: auction.startingPrice.toString()
                })
            }
            if (await Hero.isOnAQuest(heroes[i])) {
                console.log(`⚠️ Hero #${heroes[i]} is on a quest`)
                heroesOnQuest.push(heroes[i])
            } else {
                const hero = await HeroAPI.getHeroById(heroes[i])
                questMap[hero.profession].push({
                    id: hero.id,
                    stamina: stamina,
                })
            }
        }
    }

    let foragingTime = 0
    const foragers = questMap["foraging"]

    let fishingTime = 0
    const fishers = questMap["fishing"]

    if (foragers.length == 0 && fishers.length == 0) {
        console.log("⚠️ No heroes to start quest")
    } else {
        if (foragers.length > 0) {
            foragingTime = await startQuestMaxAttempts(foragers, "foraging")
            heroesOnQuest.push(...foragers.map(it => it.id))
        }
        if (fishers.length > 0) {
            fishingTime = await startQuestMaxAttempts(fishers, "fishing")
            heroesOnQuest.push(...fishers.map(it => it.id))
        }
    }

    if (heroesOnQuest.length == 0) {
        console.log("⚠️ No heroes on quest")
        return
    }

    await sleep(Math.max(foragingTime, fishingTime) + 10)

    for (let i = 0; i < heroesOnQuest.length; i++) {
        await Profession.completeQuestRetry(heroesOnQuest[i])
    }
    for (let i = 0; i < heroesOnAuction.length; i++) {
        const hero = heroesOnAuction[i]
        await Sales.createPublicAuction(hero.id, hero.price)
    }
}