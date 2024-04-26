const cron = require("node-cron");
const axios = require("axios");

const task = cron.schedule("1-10 * * * *", async () => {
	try {
		const response = await axios.post(process.env.WEBHOK_URI);
		console.log(`POST reqest sent: ${response.data}`);
	} catch (err) {
		console.error(err);
	}
});

module.exports = task;
