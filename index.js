const express = require("express");
const ical = require("ical-generator");
const dotenv = require("dotenv").config();
const { getCampusEvents } = require("./events.js");
const { campuses, cursuses } = require("./config.js");
const { getCampusTigs } = require("./tig.js");
const { getCampusExams } = require("./exam.js");

let calendars = {};

for (const campus of campuses) {
	function withCampusPrefix(title) {
		return `Intra ${campus.name} | ${title}`;
	}

	calendars[campus.id] = {};

	if (campus.calendars.tig) {
		calendars[campus.id]["tig"] = ical({ name: withCampusPrefix("TIG") });
	}
	if (campus.calendars.exam)
		calendars[campus.id]["exam"] = ical({
			name: withCampusPrefix("Exams"),
		});
	for (const cursus of campus.calendars.cursuses) {
		calendars[campus.id][cursus] = ical({
			name: withCampusPrefix(cursuses.get(cursus)),
		});
	}
}

const UPDATE_TIMEOUT = 10 * 60 * 1000;

campuses.forEach((campus, index) => {
	campus.calendars.cursuses.forEach((cursus, index) => {
		setTimeout(() => {
			const cursusDetails = { id: cursus, name: cursuses.get(cursus) };
			getCampusEvents(
				calendars[campus.id][cursus],
				campus,
				cursusDetails
			);
			setInterval(
				getCampusEvents,
				UPDATE_TIMEOUT,
				calendars[campus.id][cursus],
				campus,
				cursusDetails
			);
		}, 500 * index);
	});

	// setTimeout(() => {
	// 	getCampusExams(calendars[campus.id]["exam"], campus);
	// 	setInterval(
	// 		getCampusExams,
	// 		UPDATE_TIMEOUT,
	// 		calendars[campus.id]["exam"],
	// 		campus
	// 	);
	// }, 500 * (index + 1));
	// setTimeout(() => {
	// 	getCampusTigs(calendars[campus.id]["tig"], campus);
	// 	setInterval(
	// 		getCampusTigs,
	// 		UPDATE_TIMEOUT,
	// 		calendars[campus.id]["tig"],
	// 		campus
	// 	);
	// }, 500 * (index + 2));
});

const app = express();

app.get("/", async (req, res) => {
	return res.status(200).send("42cal");
});

const router = express.Router();

console.log(process.env.URL_SECRET);
router.use((req, res, next) => {
	if (req.query.secret !== process.env.URL_SECRET) return res.status(403);
	next();
});

router.get("/campus/:campus_id/tig", async (req, res) => {
	if (
		!calendars.hasOwnProperty(req.params.campus_id) ||
		!calendars[req.params.campus_id].hasOwnProperty("tig")
	)
		return res.status(404).send("Calendar does not exist");
	return calendars[req.params.campus_id]["tig"].serve(res);
});

router.get("/campus/:campus_id/exams", async (req, res) => {
	if (
		!calendars.hasOwnProperty(req.params.campus_id) ||
		!calendars[req.params.campus_id].hasOwnProperty("exam")
	)
		return res.status(404).send("Calendar does not exist");
	return calendars[req.params.campus_id]["exam"].serve(res);
});

router.get("/campus/:campus_id/cursus/:cursus_id", async (req, res) => {
	if (
		!calendars.hasOwnProperty(req.params.campus_id) ||
		!calendars[req.params.campus_id].hasOwnProperty(req.params.cursus_id)
	)
		return res.status(404).send("Calendar does not exist");
	return calendars[req.params.campus_id][req.params.cursus_id].serve(res);
});

app.use("/", router);

app.listen(3000, () => {
	console.log("Running on http://localhost:3000");
});
