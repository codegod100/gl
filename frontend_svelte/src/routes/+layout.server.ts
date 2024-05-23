import { error, fail, redirect } from "@sveltejs/kit";
import jsSHA from "jssha";
import { env } from "$env/dynamic/private";
import * as jose from "jose";
import { getAllUsers, insertUser, getUser } from "$lib/db";

const secretTxt = env.AUTH_SECRET;
const secret = new TextEncoder().encode(secretTxt);
export async function load({ cookies, request, url }) {
	const jwt = cookies.get("token") as string;
	if (!jwt) {
		console.log(url.pathname);
		if (url.pathname !== "/") {
			return redirect(301, "/");
		}
		return {};
	}
	try {
		const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
		console.log({ payload });
		const user_result = await getUser(payload.user as string);
		// if (user_result.isErr) {
		// 	return;
		// }
		return {
			user: { name: payload.user, birthday: user_result.unwrap().birthday },
		};
	} catch (e) {
		return error(500, "corrupted token");
	}
}
