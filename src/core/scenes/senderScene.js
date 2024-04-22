const { Scenes } = require("telegraf");

const senderScene = new Scenes.BaseScene("senderScene");
senderScene.enter(ctx =>
	ctx.reply(
		`Matnli xabar yuboring\nXabar kim tomonidan yuborilgani @umidxon_polatxonov'ga ko'rinadi ⚠️`,
		{ parse_mode: "HTML" }
	)
);

senderScene.on("text", ctx => {
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
});

senderScene.on("message", ctx => {
	ctx.reply("Iltimos faqat matnli xabar yuboring!");
});

senderScene.leave(ctx => {
	ctx.reply(
		`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
		{ parse_mode: "HTML" }
	);
});

module.exports = senderScene;
