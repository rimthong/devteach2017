const Botkit = require('botkit');

const controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
});

const instance = controller.spawn({});
controller.setupWebserver(8888, () => {
  controller.createWebhookEndpoints(controller.webserver, instance, () => {
    console.log('Connected');
  });
});

controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.hears(['hello'], 'message_received', (bot, message) => {
  bot.reply(message, 'Hey there.');
});

controller.hears(['cookies'], 'message_received', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.say('Did someone say cookies!?!!');
    convo.ask('What is your favorite type of cookie?', (
      response,
      convo,
    ) => {
      convo.say(`Golly, I love ${response.text} too!!!`);
      convo.next();
    });
  });
});
