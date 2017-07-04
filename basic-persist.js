const Botkit = require('botkit');
const sqlite3 = require('sqlite3').verbose();

const controller = Botkit.slackbot();

const instance = controller.spawn({
  token: process.env.SLACK_TOKEN,
});

const db = new sqlite3.Database('vacations.db');

instance.startRTM((err) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  } else {
    console.log('connected');
  }
});

controller.hears(
  [/^add vacation (\w+?) (\d{4}\/\d{2}\/\d{2})? (\d{4}\/\d{2}\/\d{2})?$/],
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    const name = message.match[1];
    const dateStart = new Date(message.match[2]);
    const dateEnd = new Date(message.match[3]);

    db.run('INSERT into devbot_vacations VALUES ($name, $start, $end)', {
      $name: name,
      $start: dateStart,
      $end: dateEnd,
    });
    bot.reply(message, 'Adding vacation time.');
  },
);

controller.hears(
  'vacations',
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    const vacations = [];
    db.each(
      'SELECT name, start, end FROM devbot_vacations',
      (err, row) => {
        vacations.push(`${row.name} ${row.start}-${row.end}`);
      },
      () => {
        bot.reply(message, `Vacations are:\n ${vacations.join('\n')}`);
      },
    );
  },
);
