import ical from "ical-generator";

import { UPDATE_TIMEOUT, campuses, cursuses } from "./config.js";
import { getCampusEvents } from "./events.js";
import { getCampusExams } from "./exam.js";
import { getCampusTigs } from "./tig.js";

let calendars = {};

function initCalendars() {
	for (const campus of campuses) {
		function withCampusPrefix(title) {
			return `Intra ${campus.name} | ${title}`;
		}

		calendars[campus.id] = {};

		if (campus.calendars.tig) {
			calendars[campus.id]["tig"] = ical({
				name: withCampusPrefix("TIG"),
			});
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
}

function updateCalendars() {
	campuses.forEach((campus, index) => {
		campus.calendars.cursuses.forEach((cursus, index) => {
			let delay = 0;

			setTimeout(() => {
				const cursusDetails = {
					id: cursus,
					name: cursuses.get(cursus),
				};
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
				delay += 1;
			}, 500 * delay);

			setTimeout(() => {
				getCampusExams(calendars[campus.id]["exam"], campus);
				setInterval(
					getCampusExams,
					UPDATE_TIMEOUT,
					calendars[campus.id]["exam"],
					campus
				);
				delay += 1;
			}, 500 * delay);

			setTimeout(() => {
				getCampusTigs(calendars[campus.id]["tig"], campus);
				setInterval(
					getCampusTigs,
					UPDATE_TIMEOUT,
					calendars[campus.id]["tig"],
					campus
				);
				delay += 1;
			}, 500 * delay);
		});
	});
}

export { calendars, initCalendars, updateCalendars };
