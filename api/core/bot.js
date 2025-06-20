const { Telegraf, session, Scenes } = require("telegraf");
const axios = require("axios");
const mongoose = require("mongoose");
const Users = require("./models/userModel");
const { anonimScene, senderScene, adminReplyScene } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

const api = process.env.API;
// const api = "http://localhost:3030/api/users/chatId/"

const stage = new Scenes.Stage([anonimScene, senderScene, adminReplyScene]);
bot.use(session());
bot.use(stage.middleware());

bot.use(async (ctx, next) => {
  if (ctx.chat?.type == "group" || ctx.chat?.type == "supergroup") {
    await ctx.reply(
      "Ushbu bot faqat shaxsiyda ishlaydi!\nIltimos shaxsiy chatdan foydalanib qaytadan urinib ko'ring"
    );
    return;
  }
  await next();
});

const getUser = async (chatId) => {
  try {
    const response = await axios.get(`${api}${chatId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

bot.start(async (ctx) => {
  try {
    const isExist = await Users.findOne({ chatId: ctx.chat.id });

    if (!isExist) {
      await Users.create({
        chatId: ctx.from.id,
        firstName: ctx.from.first_name,
        username: ctx.from.username,
      }).then(() => {
        ctx.telegram.sendMessage(
          -1002069272637,
          `Yangi foydalanuvchi ro'yxatdan o'tdi!\n👤 Ism: <a href="tg://user?id=${
            ctx.from.id
          }">${ctx.from.first_name}</a>\n🆔 Chat ID: <code>${
            ctx.from.id
          }</code>\n🔗 Username: ${
            ctx.from.username === undefined
              ? "Username not set"
              : "@" + ctx.from.username
          }`,
          { parse_mode: "HTML" }
        );
      });
    }
  } catch (err) {
    console.error(err);
    ctx.reply("Noma'lum xatolik yuzaga keldi");
  }

  ctx.reply(
    `Assalomu alaykum <b><a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a></b>\n@umidxon_polatxonov'ga xabar yuborish uchun pastdagi istalgan turni tanlang 👇`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🛡 Anonim", callback_data: "anonim" },
            { text: "👀 Anonim emas", callback_data: "simple" },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
});

bot.command("broadcast", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const allUsers = await Users.find({});
      const args = ctx.msg.text.split(" ");
      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }
      const postId = args[1];
      const channelId = -1002460351194;
      await allUsers.forEach(async (user) => {
        await ctx.telegram
          .copyMessage(user.chatId, channelId, postId)
          .catch((err) => {
            if (err.response.error_code == 400) {
              ctx.reply("Post topilmadi");
            } else {
              ctx.reply("Postni uzatishda muammo yuzaga keldi", err.response);
              console.error(err);
            }
          });
      });
      ctx.telegram.sendMessage(
        5511267540,
        `Xabar barcha foydalanuvchilarga muvaffaqiyatli yuborildi ✅`
      );
    } catch (err) {
      console.error(err);
      return ctx.reply(
        "Xabarlarni broadcast qilishda xatolik yuzaga keldi",
        err.response
      );
    }
  } else {
    ctx.reply("Bu buyruq siz uchun emas!");
  }
});

bot.command("forward", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const allUsers = await Users.find({});
      const args = ctx.msg.text.split(" ");

      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }

      const postId = args[1];
      const channelId = -1002460351194;

      allUsers.forEach(async (user) => {
        await ctx.telegram
          .forwardMessage(user.chatId, channelId, postId)
          .catch((err) => {
            if (err.response.error_code == 400) {
              ctx.reply("Post topilmadi");
            } else {
              ctx.reply(
                "Postni uzatishda muammo yuzaga keldi",
                err.response.description
              );
              console.error(err);
            }
          });
      });
      ctx.reply("Post barcha foydalanuvchilarga uzatildi ✅");
    } catch (err) {
      console.log(err);
      return ctx.reply("Xabarni forward qilishda muammo yuzaga keldi");
    }
  }
});

bot.command("new_message", async (ctx) => {
  await ctx.reply("Qaysi turda xabar yubormoqchisiz? 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🛡 Anonim", callback_data: "anonim" },
          { text: "👀 Anonim emas", callback_data: "simple" },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
});

bot.action("anonim", async (ctx) => {
  await ctx.scene.enter("anonimScene");
  ctx.answerCbQuery("Istalgan turdagi xabar yuborishingiz mumkin");
  ctx.editMessageReplyMarkup();
});

bot.action("simple", async (ctx) => {
  await ctx.scene.enter("senderScene");
  ctx.answerCbQuery("Istalgan turdagi xabar yuborishingiz mumkin");
  ctx.editMessageReplyMarkup();
});

bot.action("cancel", async (ctx) => {
  ctx.reply(
    "<b>Muvaffaqiyatli bekor qilindi</b>\nYangi xabar yuborish uchun <b>/new_message</b> buyrug'idan foydalanishingiz mumkin",
    { parse_mode: "HTML" }
  );
  await ctx.scene.leave();
  ctx.answerCbQuery("Bekor qilindi ✅");
  await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msg.message_id - 1);
  ctx.telegram.deleteMessage(ctx.chat.id, ctx.msg.message_id);
});

bot.action(/reply_(\d+)/, async (ctx) => {
  ctx.session.userId = ctx.match[1];
  ctx.scene.enter("adminReplyScene");
  ctx.answerCbQuery();
});

bot.on("text", async (ctx) => {
  await ctx.reply(
    "Menimcha noto'g'ri buyruq yubordingiz 🤷‍♂️, tekshirib qaytadan urining"
  );
});

bot.on("message", async (ctx) => {
  await ctx.replyWithHTML(
    "Buyruqlar ro'yxati: \n/start - Botni ishga tushirish\n/new_message - Yangi xabar yuborish\n\n<b>Iltimos faqat buyruqlarni yuboring ❗️</b>"
  );
});

bot.catch((err, ctx) => {
  console.error(`~! ERROR: \n ${err}`);
  ctx.reply("Noma'lum xatolik yuzaga keldi\nKeyinroq qayta urinib ko'ring");
  ctx.telegram.sendMessage(
    -1002069272637,
    `<a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a> foydalanuvchi bilan xatolik yuz berdi: \n${err.message}`,
    { parse_mode: "HTML" }
  );
});

bot.launch(
  {
    dropPendingUpdates: true,
  },
  () => {
    console.log(`Bot started!`);
    bot.telegram.sendMessage(5511267540, `Bot ishga tushdi\n👉 /start`);
  }
);

module.exports = bot;
