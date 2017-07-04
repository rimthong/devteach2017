const Botkit = require('botkit');

const controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
});

const instance = controller.spawn({});

controller.setupWebserver(8888, () => {
  controller.createWebhookEndpoints(controller.webserver, instance, () => {
    console.log('This bot is online!!!');
  });
});

controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.hears(['rate presentation'], 'message_received', (
  bot,
  message,
) => {
  const attachment = {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: 'Rating this presentation',
          subtitle: 'How are you enjoying my presentation so far?',
          buttons: [
            {
              type: 'postback',
              title: 'Awesome',
              payload: 'awesome',
            },
            {
              type: 'postback',
              title: 'Meh',
              payload: 'meh',
            },
            {
              type: 'postback',
              title: 'Literally garbage filth',
              payload: 'notsogreat',
            },
          ],
        },
      ],
    },
  };
  bot.reply(message, {
    attachment,
  });
});

controller.on('facebook_postback', (bot, message) => {
  switch (message.payload) {
    case 'awesome':
      bot.reply(message, ':D');
      break;
    case 'meh':
      bot.reply(message, ':|');
      break;
    case 'notsogreat':
      bot.reply(message, ':(');
      break;
    default:
      bot.reply(message, "I didn't quite catch that.");
      break;
  }
});
