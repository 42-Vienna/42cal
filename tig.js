const { api } = require("./api");

async function fetchTigs(campus_id) {
	return api.get(`community_services?filter[campus_id]=${campus_id}`);
}

function getCampusTigs(calendar, campus) {
	console.log(`Fetching tigs of the ${campus.name} campus...`);
	fetchTigs(campus.id)
		.then((result) => {
			calendar.clear();
			for (const tig of result.data) {
				const start = new Date(tig.schedule_at);
				const description = `<b>Reason</b>

${tig.close.reason}

<b>Occupation</b>

${tig.occupation || "null"}

<b>State</b>

${tig.state}

<b>Kind</b>

${tig.close.kind}`;

				calendar.createEvent({
					start: start,
					end: new Date(start.valueOf() + tig.duration),
					summary: `TIG: ${tig.close.user}`,
					description: description,
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

module.exports = { getCampusTigs };
