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
    try {
      await ctx.telegram.sendMessage(
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
      );
      ctx.reply(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
        parse_mode: "HTML",
      });
    } catch (err) {
      console.error(err.response);
      if (err.response.error_code === 403) {
        ctx.reply(`Kechirasiz, ushbu foydalanuvchi botni bloklagan! 🚫`);
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      } else {
        ctx.reply("Xabaringizni yuborishda muammo yuzaga keldi!");
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      }
    }
  } else {
    ctx.reply(`Kechirasiz, bot buyruqlarini yuborish imkonsiz`);
  }
  return ctx.scene.leave();
});

module.exports = adminReplyScene;
