const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "6368983170:AAH8SjnlmHRclpqr9ZEfu0zWmwxTDbglcT0";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, " назви число ");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "відгадуй, курва!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "привіт" },
    { command: "/info", description: "твоя інфа" },
    { command: "/game", description: "грай мене" },
  ]);

  bot.on("message", async (msq) => {
    const text = msq.text;
    const chatId = msq.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `https://i.pinimg.com/564x/85/3e/a7/853ea7f20dc65349b3d2f220a53e9dd9.jpg`
      );
      // await bot.sendMessage(chatId, `hello`);
    }
    if (text === "/info") {
      await bot.sendMessage(chatId, `${chatId}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "ти шо москаль ?");
  });
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (Number(data) === Number(chats[chatId])) {
      return bot.sendMessage(
        chatId,
        `як ти вгадав курва ? що я загадав ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `МІМО, я загадав ${chats[chatId]}, ${data}`,
        againOptions
      );
    }
    bot.sendMessage(chatId, `твоя цифра ${data}`);
    console.log(msg);
  });
};
start();
