const { Scenes } = require("telegraf");

const anonimScene = new Scenes.BaseScene("anonimScene");
anonimScene.enter((ctx) => {
  ctx.reply("Matnli xabar yuboring", {
    reply_markup: {
      inline_keyboard: [[{ text: "Bekor qilish ❌", callback_data: "cencel" }]],
    },
  });
});

anonimScene.on("text", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  } else {
    ctx.reply(
      `<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
      { parse_mode: "HTML" }
    );
    await ctx.telegram
      .sendMessage(
        5511267540,
        `✉️ <b>Sizda yangi anonim xabar bor:</b>\n\n<i>${ctx.msg.text}</i>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Javob berish",
                  callback_data: `reply_${ctx.from.id}`,
                },
              ],
            ],
          },
        }
      )
      .catch((err) => {
        ctx.reply(
          "Xabar yuborishda xatolik yuzaga keldi ❌\nIltimos qayta urining"
        );
        console.error(err);
      });
    return ctx.scene.leave();
  }
});

anonimScene.on("message", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  }

  await ctx.copyMessage(5511267540, ctx.msg.message_id).then(() =>
    ctx.reply("<b> Xabaringiz muvaffaqiyatli yuborildi </b> ✅", {
      parse_mode: "HTML",
    })
  );
  ctx.telegram
    .sendMessage(5511267540, `✉️ <b>Sizda yangi anonim xabar bor </b>👆`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Javob berish",
              callback_data: `reply_${ctx.from.id}`,
            },
          ],
        ],
      },
    })
    .catch((err) => {
      ctx.telegram.sendMessage(
        -1002069272637,
        `<a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a> foydalanuvchi bilan xatolik yuz berdi: \n${err.message}`,
        { parse_mode: "HTML" }
      );
      console.error(err);
    });
  return ctx.scene.leave();
});

/* anonimScene.on("message", (ctx) => {
  ctx.reply("Iltimos faqat matnli xabar yuboring!");
}); */

module.exports = anonimScene;
