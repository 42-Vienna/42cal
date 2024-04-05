const { ClientCredentials } = require("simple-oauth2");

const config = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
	},
	auth: {
		tokenHost: "https://api.intra.42.fr",
		tokenPath: "/oauth/token",
		authorizePath: "/oauth/authorize",
	},
};

const client = new ClientCredentials(config);

async function getAccessToken() {
	let access_token;
	try {
		const { token } = await client.getToken({
			scope: "public",
		});
		access_token = client.createToken(token);
	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
	return access_token.token.access_token;
}

module.exports = { getAccessToken };
