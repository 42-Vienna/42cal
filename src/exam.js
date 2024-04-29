import { api } from "./api.js";

function getCampusExams(calendar, campus) {
	console.log(`Fetching exams of the ${campus.name} campus...`);
	api.get(`/exams?filter[campus_id]=${campus.id}`)
		.then((r) => r.json())
		.then((r) => {
			calendar.clear();
			for (const exam of r) {
				let description = "";

				for (const project of exam.projects) {
					description += project.name;
					description += "\n";
				}

				calendar.createEvent({
					start: exam.begin_at,
					end: exam.end_at,
					summary: exam.name,
					description: description,
					location: exam.location,
				});
			}
		})
		.catch((error) => {
			console.error(error);
			return error;
		});
	console.log("Done");
}

export { getCampusExams };
