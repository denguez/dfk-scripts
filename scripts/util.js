module.exports = {
    sleep(seconds) {
        return new Promise(resolve => {
            console.log(`▶️ Sleeping ${seconds} seconds...`)
            return setTimeout(resolve, seconds * 1000)
        });
    },
}