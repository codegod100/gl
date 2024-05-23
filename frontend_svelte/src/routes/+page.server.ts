import { getAllUsers, insertUser, getUser } from "$lib/db";
import jsSHA from "jssha";
import { error, fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import * as jose from "jose";

const secretTxt = env.AUTH_SECRET;
const secret = new TextEncoder().encode(secretTxt);
export async function load({ cookies }) {
	const jwt = cookies.get("token") as string;
	if (!jwt) {
		return {};
	}
	const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
	console.log({ payload });
	const users = await getAllUsers();
	return {
		user: { name: payload.user },
	};
}

function generateHash(password: string) {
	const hash = new jsSHA("SHA-512", "TEXT", {
		encoding: "UTF8",
	})
		.update(password)
		.getHash("HEX");
	console.log(hash);
	return hash;
}

export const actions = {
	default: async ({ cookies, request }) => {
		const alg = "HS256";
		const data = await request.formData();
		const username = data.get("username") as string;
		const password = data.get("password") as string;
		if (data.get("logout") === "true") {
			cookies.delete("token", { path: "/" });
			return { message: "logged out" };
		}
		const hash = generateHash(password);
		if (!username || !password) {
			return fail(400, { error: "Missing username or password" });
		}

		const user = await getUser(username);
		if (user.isOk) {
			if (user.value.hash === hash) {
				const jwt = await new jose.SignJWT({ user: username })
					.setProtectedHeader({ alg })
					.sign(secret);
				console.log("jwt", jwt);
				cookies.set("token", jwt, { path: "/" });
				return { message: "logged in" };
			}
			return fail(400, { error: "Invalid password" });
		}
		await insertUser({
			username,
			hash,
		});
		return { error: "" };
	},
};
