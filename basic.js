const Botkit = require('botkit');

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
  'hello',
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    bot.reply(message, 'Hello yourself.');
  }
);
