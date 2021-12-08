const { utils } = require('ethers')

const api = require('../api')
const queries = require('./queries')
const format = require('./format')

async function queryHeroes(query, filters) {
    // Parse human readable number
    if (filters.maxPrice) {
        filters.maxPrice = utils.parseUnits(`${filters.maxPrice}`, 18).toString()
    }

    let { heros } = await api.query(query, filters)

    // Filter statBoost
    if (filters.statBoostList) {
        heros = heros.filter(hero => {
            return filters.statBoostList.includes(hero.statBoost1)
                || filters.statBoostList.includes(hero.statBoost2)
        })
    }

    // Filter #summons
    if (filters.summons) {
        heros = heros.filter(hero => {
            if (hero.generation == 0) return true
            return hero.maxSummons - hero.summons >= filters.summons
        })
    }

    return heros
}

module.exports = {
    ...format,
    ...queries,
    queryHeroes,
    async getHeroById(heroId) {
        return (await queryHeroes(queries.heroById, { id: heroId }))[0]
    },
    async getHeroesOnSale(filters) {
        return await queryHeroes(queries.heroesOnSale, filters)
    },
    async getHeroesOnSaleByProfession(filters) {
        return await queryHeroes(queries.heroesOnSaleByProfession, filters)
    },
}