const { sleep } = require('../scripts/util')
const Hero = require('../contract/hero/hero')
const Sales = require('../contract/auctions/sale-auction')
const WishingWell = require('../contract/quest/wishing-well')
const config = require('../config/global.json')['wishing-well']

module.exports = async (heroes) => {
    const heroesOnQuest = []

    for (let i = 0; i < heroes.length; i++) {
        const heroId = heroes[i]
        if (await Hero.isOnAQuest(heroId)) {
            console.log(`⚠️ Hero #${heroId} is on a quest`)
            heroesOnQuest.push({ id: heroId })
        } else {
            const stamina = await WishingWell.getCurrentStamina(heroId)
            if (stamina < WishingWell.STAMINA_COST) {
                console.log(`⚠️ Hero #${heroId} not enough stamina: ${stamina}`)
            } else {
                const attemtps = Math.floor(stamina / WishingWell.STAMINA_COST)
                if (await Sales.isOnAuction(heroId)) {
                    console.log(`⚠️ Hero #${heroId} is on auction`)
                    const auction = await Sales.getAuction(heroId)
                    await Sales.cancelAuction(heroId)

                    await WishingWell.startQuest(heroId, attemtps)
                    heroesOnQuest.push({ id: heroId, price: auction.startingPrice.toString() })
                } else {
                    await WishingWell.startQuest(heroId, attemtps)
                    heroesOnQuest.push({ id: heroId })
                }
            }
        }
    }

    if (heroesOnQuest.length == 0) {
        console.log("⚠️ No heroes on quest")
        return
    }

    await sleep(config['wait-interval'])

    for (let i = 0; i < heroesOnQuest.length; i++) {
        const hero = heroesOnQuest[i]
        await WishingWell.completeQuestRetry(hero.id)
        if (hero.price) {
            await Sales.createPublicAuction(hero.id, hero.price)
        }
    }
}