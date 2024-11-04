const { Scenes } = require("telegraf");

const adminReplyScene = new Scenes.BaseScene("adminReplyScene");

adminReplyScene.enter((ctx) => {
  ctx.reply("Matnli xabar yuboring", {
    reply_markup: {
      inline_keyboard: [[{ text: "Bekor qilish ❌", callback_data: "cencel" }]],
    },
  });
});

adminReplyScene.on("text", async (ctx) => {
  if (!ctx.msg.text.startsWith("/")) {
    await ctx.telegram
      .sendMessage(
        ctx.session.userId,
        `📨 <b>Sizga Umidxondan yangi xabar: </b>\n\n<i>${ctx.msg.text}</i>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🛡 Anonim javob berish", callback_data: "anonim" },
                { text: "👀 Anonim emas", callback_data: "simple" },
              ],
            ],
            resize_keyboard: true,
          },
        }
      )
      .catch((err) => {
        ctx.reply("Xabaringizni yuborishda muammo yuzaga keldi!");
        console.error(err);
      });
    ctx.reply(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
      parse_mode: "HTML",
    });
  } else {
    ctx.reply(`Kechirasiz, bot buyruqlarini yuborish imkonsiz`);
  }
  return ctx.scene.leave();
});

module.exports = adminReplyScene;
