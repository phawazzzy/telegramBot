const TelegramBot = require("node-telegram-bot-api");
const ogs = require("open-graph-scraper");
const firebase = require("firebase");

const token = "1193431766:AAGskBczVxJxrm1VRXrY0rJr-esWMzjkOxM";
const bot = new TelegramBot(token, {polling: true});

// bot.on('message', (msg) => {
//     bot.sendMessage(msg.chat.id, 'this is fawas here for');
// });

var firebaseConfig = {
    apiKey: "AIzaSyApKcNIPSRSIT5d_61S4MAYlh0Nnbkj5i4",
    authDomain: "phawazzzybot.firebaseapp.com",
    databaseURL: "https://phawazzzybot.firebaseio.com",
    projectId: "phawazzzybot",
    storageBucket: "phawazzzybot.appspot.com",
    messagingSenderId: "941261449076",
    appId: "1:941261449076:web:edfed54cbed1573bc76e21",
    measurementId: "G-JQMTZT2XL2"
  };

  firebase.initializeApp(firebaseConfig);

  const ref = firebase.database().ref();
  const siteRef = ref.child("sites");

  let siteUrls;

  bot.onText(/\/bookmark (.+)/, (msg, match) => {
      siteUrls = match[1];

      bot.sendMessage(msg.chat.id, 'Got it, in which category?', {
          reply_markup: {
              inline_keyboard: [[
                  {
                      text: 'Development',
                      callback_data: 'development'
                  }, 
                  {
                      text: 'Music',
                      callback_data: 'music'
                  },
                  {
                      text: 'Cute monkeys',
                      callback_data: 'Cute-monkeys'
                  }
              ]]
          }
      })
  });

  bot.on('callback_query', (callbackQuery) => {
      const message = callbackQuery.message;

      ogs({url: siteUrls}, (error, results) => {
          if(results.success) {
              console.log(results)
              siteRef.push().set({
                // name: results.data.ogSiteName,
                title: results.ogTitle,
                description: results.ogDescription,
                url: siteUrls,
                thumbnail: results.ogImage.url,
                category: callbackQuery.data
              });

              bot.sendMessage(message.chat.id, `Added \'${results.ogTitle}\' to category ${callbackQuery.data}!`)
          }
          else {
              siteRef.push().set({
                  url: siteUrls
              });
              bot.sendMessage(message.chat.id, 'Added new website, but there was no OG data!');
          }
          if(error) {
              console.log(error)
          }
      }).catch(e => {
          console.log(e);
      })
  });

