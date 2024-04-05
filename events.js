const axios = require("axios");
const { getAccessToken } = require("./api");

async function fetchEvents(campus_id, cursus_id) {
	const access_token = await getAccessToken();
	return axios.get(
		`https://api.intra.42.fr/v2/campus/${campus_id}/cursus/${cursus_id}/events`,
		{
			headers: {
				Authentication: `Bearer ${access_token}`,
			},
		}
	);
}

function getCampusEvents(calendar, campus, cursus) {
	console.log(
		`Fetching events of the ${campus.name} campus, ${cursus.name} cursus...`
	);
	fetchEvents(campus.id, cursus.id)
		.then((result) => {
			calendar.clear();
			for (const event of result.data) {
				calendar.createEvent({
					start: new Date(event.begin_at),
					end: new Date(event.end_at),
					summary: event.name,
					description: event.description,
					location: event.location,
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

module.exports = { getCampusEvents };
