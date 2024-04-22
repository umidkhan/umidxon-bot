const { Telegraf, session, Scenes } = require("telegraf");
const { anonimScene, senderScene } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

const stage = new Scenes.Stage([anonimScene, senderScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
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

bot.command("new_message", ctx => {
	ctx.reply("Qaysi turda xabar yubormoqchisiz? 👇", {
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

bot.action("anonim", ctx => {
	ctx.scene.enter("anonimScene");
	ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
	setTimeout(() => {
		ctx.telegram.deleteMessage(ctx.chat.id, ctx.msgId);
	}, 300);
});
bot.action("simple", ctx => {
	ctx.scene.enter("senderScene");
	ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
	setTimeout(() => {
		ctx.telegram.deleteMessage(ctx.chat.id, ctx.msgId);
	}, 300);
});

bot.hears("daily Umidxon", ctx => {
	const channelId = -1001897939296;
	const userId = ctx.from.id;
	bot.telegram
		.getChatMember(channelId, userId)
		.then(member => {
			if (
				member.status == "creator" ||
				member.status == "administrator" ||
				member.status == "member"
			) {
				ctx.reply(
					`<b>Daily | Umidxon</b> kanaliga qo'shilish uchun havola:\n👉 https://t.me/+--6VdTGW8cxlYjdi`,
					{ parse_mode: "HTML", protect_content: true }
				);
			} else {
				ctx.reply(
					"Afsuski siz @Umidxon_blog kanaliga obuna bo'lmagan ekansiz. Avval kanalga obuna bo'ling!"
				);
			}
		})
		.catch(err => ctx.reply("Noma'lum xatolik yuzaga keldi, qayta urining"));
});

bot.on("text", ctx => {
	ctx.reply(
		"Menimcha noto'g'ri buyruq yubordingiz 🤷‍♂️, tekshirib qaytadan urining"
	);
});

bot.launch(() => {
	console.log(`Bot started!`);
});

module.exports = bot;
