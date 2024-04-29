import { api } from "./api.js";

function getCampusEvents(calendar, campus, cursus) {
	console.log(
		`${new Date().toTimeString()} Fetching events of the ${
			campus.name
		} campus, ${cursus.name} cursus...`
	);
	api.get(`/campus/${campus.id}/cursus/${cursus.id}/events`)
		.then((r) => r.json())
		.then((r) => {
			calendar.clear();
			for (const event of r) {
				calendar.createEvent({
					start: new Date(event.begin_at),
					end: new Date(event.end_at),
					summary: event.name,
					description: event.description,
					location: event.location,
				});
			}
		})
		.catch((error) => {
			console.error(error);
			return error;
		});
	console.log("Done");
}

export { getCampusEvents };
