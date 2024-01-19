const axios = require('axios');
const cheerio = require('cheerio');
const sleep = require('util').promisify(setTimeout);

const dateFormat = (dateString)=>{
    var parts = dateString.split(/[\s,]+/);
    var time = parts[0] + " " + parts[1];
    var month = parts[3];
    var day = parseInt(parts[4]);
    var year = parseInt(parts[5]);
    var formattedDate = `${month} ${day}, ${year} ${time}`;
    var dateObject = new Date(formattedDate);
    return dateObject;
}

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
                const targetElements = $('.ResponsiveTable');
                let data = [];
                targetElements.each((i, element)=>{
                    let date = $(element).find('.Table__Title').text().trim();
                    const innerElements = $(element).find('.Table__TR--sm');
                    innerElements.each(async (i, el)=>{
                        let $row = $(el);
                        let team1 = $row.find('.events__col .Table__Team.away').text().trim();
                        let team2 = $row.find('.colspan__col .Table__Team').text().trim();
                        let time = $row.find('.date__col a').text().trim();
                        let venue = $row.find('.venue__col div').text().trim();
                        if(time==="" || time===null){
                            time = "2:00 PM";
                        }
                        const matchTime = dateFormat(time+" "+date);
                        data.push({team1,team2,matchTime,venue});
                        console.log(`- ${team1} v ${team2}`);
                        console.log(`- Time: ${matchTime}`);
                        console.log(`- Venue: ${venue}`);
                        console.log('');
                    });
                });
                return data;
            } else {
                // ... (rest of the error handling code)
            }
        } catch (error) {
            // ... (rest of the error handling code)
        }
    }

    return null;
}

module.exports = {
    scrapeContentByClass,
};