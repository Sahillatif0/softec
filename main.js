const axios = require('axios');
const cheerio = require('cheerio');
const sleep = require('util').promisify(setTimeout);

async function scrapeContentByClass() {
    const url = 'https://www.espn.in/football/fixtures?league=afc.asian.cup';

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    };

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const targetElements = $('.Table__TR--sm');

                targetElements.each((i, element) => {
                    const $row = $(element);

                    const team1 = $row.find('.events__col .Table__Team.away').text().trim();
                    const team2 = $row.find('.colspan__col .Table__Team').text().trim();
                    const matchTime = $row.find('.date__col a').text().trim();
                    const venue = $row.find('.venue__col div').text().trim();

                    console.log(`- ${team1} v ${team2}`);
                    console.log(`- Time: ${matchTime}`);
                    console.log(`- Venue: ${venue}`);
                    console.log('');
                });

                return;
            } else {
                // ... (rest of the error handling code)
            }
        } catch (error) {
            // ... (rest of the error handling code)
        }
    }

    return null;
}

// Example usage
(async () => {
    const result = await scrapeContentByClass();

    if (result) {
        // No further processing needed; content has already been printed
    }
})();
