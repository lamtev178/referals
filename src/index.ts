import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { dataBase } from "./db/index";
import referals from "./models/referal";
import { refRouter } from "./routes/refRouter";
const TOKEN =
  process.env.TOKEN || "5860284401:AAEEumk54nwbeTIIPebhewnqZYQxDN00X6A";
const PORT = process.env.PORT || "8080";
const app = express();
app.use(express.json());

dataBase
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use("/ref", refRouter);

const refBot = new TelegramBot(TOKEN, { polling: true });

refBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  refBot.sendMessage(chatId, "Hello", {
    reply_markup: {
      keyboard: [
        [{ text: "Create Ref Link", request_location: false }],
        [{ text: "Get my refs", request_location: false }],
      ],
    },
  });
});
refBot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from!.id;
  if (msg.text === "Get my refs") {
    try {
      refBot.sendMessage(
        chatId,
        JSON.stringify(await referals.getMyReferrals(user))
      );
    } catch (err: any) {
      refBot.sendMessage(chatId, err.message);
    }
  }
  if (msg.text === "Create Ref Link") {
    try {
      refBot.sendMessage(
        chatId,
        "t.me/ref_aa_bot?link=" +
          JSON.stringify(await referals.createLink(user))
      );
    } catch (err: any) {
      refBot.sendMessage(chatId, err.message);
    }
  }
});

app.listen(PORT, () => console.log("Server started on port", PORT));
