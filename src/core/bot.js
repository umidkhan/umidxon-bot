const { Telegraf, session, Scenes } = require("telegraf");
const { anonimScene, senderScene, adminReplyScene } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

const stage = new Scenes.Stage([anonimScene, senderScene, adminReplyScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply(
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
  ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
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
  ctx.editMessageReplyMarkup();
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

bot.launch(() => {
  console.log(`Bot started!`);
});

module.exports = bot;
