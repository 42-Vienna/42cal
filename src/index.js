import express from "express";
import { router } from "./router.js";
import { initCalendars, updateCalendars } from "./calendars.js";

function main() {
	initCalendars();
	updateCalendars();

	const app = express();

	app.get("/", async (req, res) => {
		return res.status(200).send("42cal");
	});

	app.use("/", router);

	app.listen(3000, () => {
		console.log("Running on http://localhost:3000");
	});
}

main();
