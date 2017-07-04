const Botkit = require('botkit');
const controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
});

const apiai = require('botkit-middleware-apiai')({
  token: process.env.APIAI_DEV_TOKEN,
  skip_bot: true,
});

controller.middleware.receive.use(apiai.receive);
const instance = controller.spawn({});

controller.setupWebserver(8888, () => {
  controller.createWebhookEndpoints(controller.webserver, instance, () => {
    console.log('Connected');
  });
});

controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.hears(
  ['burn.directives'],
  'message_received',
  apiai.action,
  (bot, message) => {
    const instructions = `
      - Hold burned skin under cool (not cold) running water or immerse in cool water until pain subsides.
      - Use compresses if running water isn’t available.
      - Cover with sterile, non-adhesive bandage or clean cloth.
      - Do not apply butter or ointments, which can cause infection.
    `;
    bot.reply(message, `Ouch! In case of burn, please do the following:\n${instructions}`);
  }
);

controller.hears(
  ['stroke.directives'],
  'message_received',
  apiai.action,
  (bot, message) => {
    const instructions = `
      - *F* face dropping: Does one side of the face droop or is it numb?
      - *A* arm weakness: Is one arm weak or numb?
      - *S* speech difficulty: Is speech slurred? 
      - *T* time to call 911.
    `;
    bot.reply(message, `In case of stroke, remember FAST:\n${instructions}`);
  }
);

controller.hears(
  ['sprain.directives'],
  'message_received',
  apiai.action,
  (bot, message) => {
    const instructions = `
      - *R* Rest the injured limb
      - *I* Ice the area
      - *C* Compress the area with a bandage
      - *E* Elevate above your heart
    `;
    bot.reply(
      message,
      `Sorry to hear that, in case of sprain, it is recommended to:\n${instructions}`
    );
  }
);
