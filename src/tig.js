import { api } from "./api.js";

function getCampusTigs(calendar, campus) {
	console.log(`Fetching tigs of the ${campus.name} campus...`);
	api.get(`/community_services?filter[campus_id]=${campus.id}`)
		.then((r) => r.json())
		.then((r) => {
			calendar.clear();
			for (const tig of r) {
				const start = new Date(tig.schedule_at);
				const description = `Reason: ${tig.close.reason}

Closed by <a href="https://profile.intra.42.fr/users/${
					tig.close.closer.login
				}">${tig.close.closer.login}</a>

Occupation: ${tig.occupation || "(null)"}

State: ${tig.state}

Kind: ${tig.close.kind}`;
				calendar.createEvent({
					start: start,
					end: new Date(start.valueOf() + tig.duration * 1000),
					summary: `TIG: ${tig.close.user.login}`,
					description: description,
				});
			}
		})
		.catch((error) => {
			console.error(error);
			return error;
		});
	console.log("Done");
}

export { getCampusTigs };
