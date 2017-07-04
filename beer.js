const Botkit = require('botkit');
const request = require('request');
const cheerio = require('cheerio');

const controller = Botkit.slackbot();

const instance = controller.spawn({
  token: process.env.SLACK_TOKEN,
});

instance.startRTM((err) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  } else {
    console.log('connected');
  }
});

controller.hears(
  'ddc',
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    const options = {
      url: 'http://dieuduciel.com',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36',
      },
    };
    request(options, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html);
        const beers = [];
        $('.brouepub-montreal .load-product-sheet a').each((index, beer) => {
          beers.push(`- ${$(beer).text().replace(/\s+/g, ' ').trim()}`);
        });
        bot.reply(message, `:beer:*Beers at DDC*:beer::\n${beers.join('\n')}`);
      } else {
        bot.reply(message, `Error: ${error}`);
      }
    });
  },
);
