const express = require("express");
const ical = require("ical-generator");
const dotenv = require("dotenv").config();
const { ClientCredentials } = require("simple-oauth2");
const { getCampusCalendar } = require("./calendar.js");
const { campuses, cursuses } = require("./config.js");

const config = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
	},
	auth: {
		tokenHost: "https://api.intra.42.fr",
		tokenPath: "/oauth/token",
		authorizePath: "/oauth/authorize",
	},
};
const client = new ClientCredentials(config);

let calendars = {};

for (const campus of campuses) {
	calendars[campus.id] = {};
	for (const cursus of cursuses) {
		calendars[campus.id][cursus.id] = ical({
			name: `Intra ${campus.name} | ${cursus.name}`,
		});
	}
}

campuses.forEach((campus, index) => {
	cursuses.forEach((cursus, index) => {
		setTimeout(() => {
			getCampusCalendar(
				client,
				calendars[campus.id][cursus.id],
				campus,
				cursus
			);
			setInterval(
				getCampusCalendar,
				10 * 60 * 1000,
				client,
				calendars[campus.id][cursus.id],
				campus,
				cursus
			);
		}, 500 * index);
	});
});

const app = express();

app.get("/", async (req, res) => {
	return res.status(200).send("42cal");
});

app.get("/campus/:campus_id/cursus/:cursus_id", async (req, res) => {
	if (
		!calendars.hasOwnProperty(req.params.campus_id) ||
		!calendars[req.params.campus_id].hasOwnProperty(req.params.cursus_id)
	)
		return res.status(404).send("Calendar does not exist...");
	return calendars[req.params.campus_id][req.params.cursus_id].serve(res);
});

app.listen(3000, () => {
	console.log("Running on http://localhost:3000");
});
