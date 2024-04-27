const cron = require("node-cron");
const axios = require("axios");

const task = cron.schedule("* * * * *", async () => {
	try {
		const response = await axios.post(
			"https://umidxon-bot.onrender.com/telegram"
		);
		console.log(`POST reqest sent: ${response.data}`);
	} catch (err) {
		console.error(err);
	}
});

module.exports = task;
