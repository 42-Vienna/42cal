const { api } = require("./api");

async function fetchExams(campus_id) {
	return api.get(`community_services?filter[campus_id]=${campus_id}`);
}

function getCampusExams(calendar, campus) {
	console.log(`Fetching exams of the ${campus.name} campus...`);
	fetchExams(campus.id)
		.then((result) => {
			calendar.clear();
			for (const exam of result.data) {
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
			return result;
		})
		.catch((error) => {
			console.error(error);
			return error;
		});
	console.log("Done");
}

module.exports = { getCampusExams };
