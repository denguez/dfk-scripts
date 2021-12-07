const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const GRAPH_URL = require('../config/global.json')['dfk-api']

module.exports = {
    async query(query) {
        try {
            const response = await fetch(GRAPH_URL, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
            });
            const { data } = await response.json();
            return data
        } catch (ex) {
            console.log(ex)
        }
    }
}