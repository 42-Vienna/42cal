import Fast42 from "@codam/fast42";
import dotenv from "dotenv";
dotenv.config();

const api = await new Fast42([
	{
		client_id: process.env["CLIENT_ID"],
		client_secret: process.env["CLIENT_SECRET"],
	},
]).init();

export { api };
