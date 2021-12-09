# dfk-scripts
A collection of DeFi Kingdoms scripts.

# Features
- Contract functions
- API interaction
- "Tasks" which include quest runners and data polling
- More to come soon™

# Setup
- Instal Nodejs, Yarn and Git
- Clone the repository
```
git clone https://github.com/denguez/dfk-scripts.git
```
- Navigate to the project folder and install dependencies
```
cd dfk-scripts
yarn install
```
- Create a file called "private.json" inside "config" folder where you put your private key and a list of heroes you own. See [example](config/private.example.json).
- Everything should be good to go, but first you need an entry point to be able to run the scripts!

# index.js examples
### Run wishing well quest every 8 hours
```
const cron = require('node-schedule')
const runWishingWellQuest = require('./tasks/wishing-well')
const myHeroes = require('./config/private.json')['heroes']

cron.scheduleJob("* * */8 * * *", () => runWishingWellQuest(myHeroes))
```
