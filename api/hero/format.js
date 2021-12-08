function formatHeroRarity(n) {
    switch (n) {
        case 0: return "Common"
        case 1: return "Uncommon🟢"
        case 2: return "Rare🔷"
        case 3: return "Legendary🟥"
        case 4: return "Mythic⚜️"
    }
}

function formatHero(hero) {
    return {
        price: utils.formatUnits(hero.saleAuction.startingPrice, 18),
        id: hero.id,
        gen: hero.generation,
        sum: hero.generation == 0 ? "∞" : hero.maxSummons - hero.summons,
        class: hero.mainClass,
        subClass: hero.subClass,
        profession: hero.profession,
        rarity: formatHeroRarity(hero.rarity),
        boost: `${hero.statBoost1} + ${hero.statBoost2}`,
    }
}

module.exports = {
    formatHero,
    formatHeroRarity,
}