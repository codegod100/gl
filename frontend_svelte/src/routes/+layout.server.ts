import { getUser } from "$lib/db";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
const secretTxt = env.AUTH_SECRET;
const secret = new TextEncoder().encode(secretTxt);
import * as jose from "jose";
export async function load({ cookies }) {
	const jwt = cookies.get("token") as string;
	if (!jwt) {
		// will render login component
		return { error: "" };
	}
	const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
	console.log({ payload });
	console.log("loading");
	// const username = cookies.get("user");

	const user_result = await getUser(payload.user as string);
	if (user_result.isErr) {
		// will render login component
		return { error: user_result.error.message };
	}
	const user = user_result.value;
	return { user: { name: user.username } };
}
