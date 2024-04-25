const cron = require("node-cron");
const axios = require("axios");

const task = cron.schedule("* * * * *", async () => {
	try {
		const response = await axios.post(process.env.WEBHOK_URI);
		console.log(`POST reqest sent: ${response.data}`);
	} catch (err) {
		console.error(`~ERROR: ${err}`);
	}
});

module.exports = task;
