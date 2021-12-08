const heroQuery = (parameters) => {
    return `{
        heros(${parameters}) {
          id
          rarity
          generation
          mainClass
          subClass
          profession
          summons
          maxSummons
          statBoost1
          statBoost2
          saleAuction {
            startingPrice
          }
        }
    }`
}

module.exports = {
    heroQuery,
    heroById: `query heroById($id: String) ${heroQuery("where: { id: $id }")}`,
    heroesOnSale: `query heroesOnSale(
        $maxPrice: Int, 
        $maxGeneration: Int,
        $minRarity: Int,
    ) ${heroQuery(`
        orderBy: salePrice, 
        where: {
            salePrice_not: null, 
            salePrice_lte: $maxPrice,
            generation_lte: $maxGeneration,
            rarity_gte: $minRarity,
        }`
    )}`,
    heroesOnSaleByProfession: `query heroesOnSaleByProfession(
        $maxPrice: Int, 
        $maxGeneration: Int,
        $minRarity: Int,
        $profession: String,
        $mainClass: [String!],
    ) ${heroQuery(`
        orderBy: salePrice, 
        where: {
            salePrice_not: null, 
            salePrice_lte: $maxPrice,
            generation_lte: $maxGeneration,
            rarity_gte: $minRarity,
            profession: $profession,
            mainClass_in: $mainClass
        }`
    )}`
}
