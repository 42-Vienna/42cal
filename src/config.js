const UPDATE_TIMEOUT = 10 * 60 * 1000; // every 10 minutes

const campuses = [
	{
		id: 53,
		name: "Vienna",
		calendars: {
			cursuses: [3, 9, 21],
			exam: true,
			tig: true,
		},
	},
];

const cursuses = new Map();

cursuses.set(3, "Discovery Piscine");
cursuses.set(9, "C Piscine");
cursuses.set(21, "42cursus");

export { UPDATE_TIMEOUT, campuses, cursuses };
