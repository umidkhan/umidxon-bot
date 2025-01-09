const { Scenes } = require("telegraf");

const senderScene = new Scenes.BaseScene("senderScene");
senderScene.enter((ctx) =>
  ctx.reply(
    `Matnli xabar yuboring\nXabar kim tomonidan yuborilgani @umidxon_polatxonov'ga ko'rinadi ⚠️`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Bekor qilish ❌", callback_data: "cencel" }],
        ],
      },
    }
  )
);

senderScene.on("text", (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  } else {
    ctx.reply(
      `<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
      { parse_mode: "HTML" }
    );
    setTimeout(() => {
      ctx.telegram
        .sendMessage(
          5511267540,
          `📨 <b>Sizda yangi xabar bor</b>\n\n👤 Ism: <a href="tg://user?id=${
            ctx.from.id
          }">${ctx.chat.first_name}</a>\n🆔 Chat ID: <code>${
            ctx.from.id
          }</code>\n🔗 Username: ${
            ctx.from.username === undefined
              ? "Username not set"
              : "@" + ctx.from.username
          }\n💬 Xabar 👉 \n<i>${ctx.msg.text}</i>`,
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
          ctx.telegram.sendMessage(
            -1002069272637,
            `Xatolik yuzaga keldi:\n${err.response}\n\n#error`
          );
          return ctx.scene.leave();
        });
    }, 100);
    return ctx.scene.leave();
  }
});

senderScene.on("message", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  }
  await ctx.copyMessage(5511267540, ctx.msg.message_id).then(() => {
    ctx.reply("<b> Xabaringiz muvaffaqiyatli yuborildi </b> ✅", {
      parse_mode: "HTML",
    });
  });
  ctx.telegram
    .sendMessage(
      5511267540,
      `📨 <b>Sizda yangi xabar bor</b> 👆\n\n👤 Ism: <a href="tg://user?id=${
        ctx.from.id
      }">${ctx.chat.first_name}</a>\n🆔 Chat ID: <code>${
        ctx.from.id
      }</code>\n🔗 Username: ${
        ctx.from.username === undefined
          ? "Username not set"
          : "@" + ctx.from.username
      }`,
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
      -1002069272637,
        `<a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a> foydalanuvchi bilan xatolik yuz berdi: \n${err.message}`,
        { parse_mode: "HTML" };
      console.error(err);
    });

  return ctx.scene.leave();
});

/* senderScene.on("message", (ctx) => {
  ctx.reply("Iltimos faqat matnli xabar yuboring!");
}); */

module.exports = senderScene;
