import TelegramBot from "node-telegram-bot-api";
import referals from "../models/referal";

const TOKEN =
  process.env.TOKEN || "5866217606:AAHrbp9-bNrf9tgxplO5srSKEVnaOcgB0Ww";

export function createBotConnection() {
  const refBot = new TelegramBot(TOKEN, { polling: true });

  refBot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const startParams = msg.text?.split(" ")[1];
    if (startParams && msg.from?.id) {
      try {
        await referals.startReferral(startParams, msg.from.id);
      } catch (err: any) {
        refBot.sendMessage(chatId, err.message);
      }
    }

    refBot.sendMessage(chatId, "Hello", {
      reply_markup: {
        keyboard: [
          [{ text: "Create Ref Link", request_location: false }],
          [{ text: "Get my refs", request_location: false }],
          [{ text: "Make a purchase", request_location: false }],
        ],
      },
    });
  });

  refBot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from!.id;
    try {
      if (msg.text === "Make a purchase") {
        refBot.sendMessage(
          chatId,
          "Your sale = " + JSON.stringify(await referals.payReferrer(user))
        );
      }
      if (msg.text === "Get my refs") {
        const refs = await referals.getMyReferrals(user);
        refBot.sendMessage(
          chatId,
          JSON.stringify(
            Object.entries(refs).map(([key, val]) => {
              return {
                ["Link: t.me/refs_AA_bot?start=" + key]: val
                  .map((user) =>
                    Object.values(user)
                      .map((id) => "user: " + id)
                      .join(", ")
                  )
                  .join(", "),
              };
            })
          )
        );
      }
      if (msg.text === "Create Ref Link") {
        refBot.sendMessage(
          chatId,
          "t.me/refs_AA_bot?start=" +
            JSON.stringify(await referals.createLink(user))
        );
      }
    } catch (err: any) {
      refBot.sendMessage(chatId, err.message);
    }
  });
}
