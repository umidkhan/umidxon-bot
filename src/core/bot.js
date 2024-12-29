const { Telegraf, session, Scenes } = require("telegraf");
const axios = require("axios");
const { anonimScene, senderScene, adminReplyScene } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);
const api = process.env.API;

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
    const response = await axios.get(`${api}?chatId=${chatId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

bot.start(async (ctx) => {
  try {
    const user = await getUser(ctx.chat.id);
    if (user.length == 0) {
      axios.post(api, {
        firstName: ctx.from.first_name,
        chatId: ctx.chat.id,
        username: ctx.from.username,
      });
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
    }
  } catch (err) {
    ctx.reply("Noma'lum xatolik yuzaga keldi");
    console.log(err);
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

const getUsers = async () => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

bot.command("broadcast", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const takenUsers = await getUsers();

      const args = ctx.msg.text.split(" ");
      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }

      const postId = args[1];
      const channelId = -1002460351194;

      await takenUsers.map(async (user) => {
        await ctx.telegram.copyMessage(user.chatId, channelId, postId);
      });
      ctx.telegram.sendMessage(
        5511267540,
        `Xabar barcha foydalanuvchilarga muvaffaqiyatli yuborildi`
      );
    } catch (err) {
      console.error(err);
      if (err.response && err.response.error_code === 400) {
        ctx.reply("Post topilmadi");
      } else {
        ctx.reply("Noma'lum xatolik yuzaga keldi");
      }
    }
  } else {
    ctx.reply("Bu buyruq siz uchun emas!");
  }
});

bot.command("forward", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const takenUsers = await getUsers();
      const args = ctx.msg.text.split(" ");
      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }

      const postId = args[1];
      const channelId = -1002460351194;

      takenUsers.map(async (user) => {
        await ctx.telegram.forwardMessage(user.chatId, channelId, postId);
      });
      ctx.telegram.sendMessage(
        5511267540,
        `Xabar barcha foydalanuvchilarga muvaffaqiyatli yuborildi`
      );
    } catch (err) {
      console.error(err);
      ctx.reply("Noma'lum xatolik yuzaga keldi");
    }
  } else {
    ctx.reply("Bu buyruq siz uchun emas!");
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
  ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring", {
    show_alert: true,
  });
  ctx.editMessageReplyMarkup();
});

bot.action("simple", async (ctx) => {
  await ctx.scene.enter("senderScene");
  ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
  ctx.editMessageReplyMarkup();
});

bot.action("cencel", async (ctx) => {
  ctx.reply(
    "<b>Muvaffaqiyatli bekor qilindi</b>\nYangi xabar yuborish uchun <b>/new_message</b> buyrug'idan foydalanishingiz mumkin",
    { parse_mode: "HTML" }
  );
  await ctx.scene.leave();
  ctx.answerCbQuery("Bekor qilindi ✅");
  setTimeout(() => {
    ctx.telegram.deleteMessage(ctx.chat.id, ctx.msg.message_id);
  }, 500);
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
  await ctx.reply("Faqat matnli xabar qabul qilinadi");
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
  }
);

module.exports = bot;
