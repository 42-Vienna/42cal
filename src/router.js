import express from "express";
import { calendars } from "./calendars.js";

const router = express.Router();

// router.use((req, res, next) => {
// 	if (req.query.secret !== process.env.URL_SECRET) return res.status(403);
// 	next();
// });

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

export { router };
