const { Scenes } = require("telegraf");

const senderScene = new Scenes.BaseScene("senderScene");
senderScene.enter(ctx =>
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

senderScene.on("text", ctx => {
	if (ctx.msg.text.startsWith("/")) {
		ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
	} else {
		ctx.reply(
			`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
			{ parse_mode: "HTML" }
		);
		ctx.telegram
			.sendMessage(
				5511267540,
				`📨 <b>Sizda yangi xabar bor</b>\n\n👤 Ism: <a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a>\n🆔 Chat ID: <code>${ctx.from.id}</code>\n💬 Xabar 👉 <i>${ctx.msg.text}</i>`,
				{ parse_mode: "HTML" }
			)
			.catch(err =>
				ctx.reply(
					"Xabar yuborishda xatolik yuzaga keldi ❌\nIltimos qayta urining"
				)
			);
		return ctx.scene.leave();
	}
});

senderScene.on("message", ctx => {
	ctx.reply("Iltimos faqat matnli xabar yuboring!");
});

module.exports = senderScene;
