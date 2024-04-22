const { Scenes } = require("telegraf");

const anonimScene = new Scenes.BaseScene("anonimScene");
anonimScene.enter(ctx => {
	ctx.reply("Matnli xabar yuboring");
});

anonimScene.on("text", ctx => {
	ctx.telegram
		.sendMessage(
			5511267540,
			`✉️ <b>Sizda yangi anonim xabar bor:</b>\n\n<i>${ctx.msg.text}</i>`,
			{ parse_mode: "HTML" }
		)
		.catch(err =>
			ctx.reply(
				"Xabar yuborishda xatolik yuzaga keldi ❌\nIltimos qayta urining"
			)
		);
	return ctx.scene.leave();
});

anonimScene.on("message", ctx => {
	ctx.reply("Iltimos faqat matnli xabar yuboring!");
});
anonimScene.leave(ctx =>
	ctx.reply(
		`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
		{ parse_mode: "HTML" }
	)
);

module.exports = anonimScene;
