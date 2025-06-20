const { Scenes } = require("telegraf");

const adminReplyScene = new Scenes.BaseScene("adminReplyScene");

adminReplyScene.enter((ctx) => {
  ctx.reply(
    "Istalgan turdagi xabar yuborishingiz mumkin (Sticker, GIF, video va hkz) ✅",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Bekor qilish ❌", callback_data: "cancel" }],
        ],
      },
    }
  );
});

adminReplyScene.on("text", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply(`Kechirasiz, bot buyruqlarini yuborish imkonsiz`);
  } else {
    try {
      await ctx.telegram
        .sendMessage(
          ctx.session.userId,
          `📨 <b>Sizga <a href="https://t.me/umidxon_polatxonov">Umidxon</a>dan yangi xabar: </b>\n\n<i>${ctx.msg.text}</i>\n\nℹ️ Javob berish uchun pastdagi 2 usuldan birini tanlang 👇`,
          {
            parse_mode: "HTML",
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "🛡 Anonim ⏩", callback_data: "anonim" },
                  { text: "👀 Anonim emas ⏩", callback_data: "simple" },
                ],
              ],
              resize_keyboard: true,
            },
          }
        )
        .then(async () => {
          ctx.reply(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
            parse_mode: "HTML",
          });
          // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msg.message_id - 1);
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
  }
  return ctx.scene.leave();
});

adminReplyScene.on("message", async (ctx) => {
  setTimeout(async () => {
    await ctx.telegram.sendMessage(
      ctx.session.userId,
      `📨 <b>Sizga <a href="https://t.me/umidxon_polatxonov">Umidxon</a>dan yangi xabar 👆</b>\n\nℹ️ Javob berish uchun pastdagi 2 usuldan birini tanlang 👇`,
      {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🛡 Anonim", callback_data: "anonim" },
              { text: "👀 Anonim emas", callback_data: "simple" },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );
  }, 600);

  await ctx.telegram
    .copyMessage(ctx.session.userId, 5511267540, ctx.msg.message_id)
    .then(async () => {
      ctx.reply(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
        parse_mode: "HTML",
      });
      // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msg.message_id - 1);
    });
});

module.exports = adminReplyScene;
