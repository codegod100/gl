import { getAllUsers, insertUser, getUser } from "$lib/db";
import jsSHA from "jssha";
import { error } from "@sveltejs/kit";
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
		users: users.map((u) => {
			return {
				name: u.username,
				birthday: u.birthday,
			};
		}),
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
			return {};
		}
		const hash = generateHash(password);
		// console.log(
		// 	"got form data",
		// 	data.get("username"),
		// 	password,
		// 	generateHash(password),
		// );
		if (!username || !password) {
			return error(400, "Missing username or password");
		}

		const user = await getUser(username);
		if (user.isOk) {
			if (user.value.hash === hash) {
				const jwt = await new jose.SignJWT({ user: username })
					.setProtectedHeader({ alg })
					.sign(secret);
				console.log("jwt", jwt);
				cookies.set("token", jwt, { path: "/" });
			}
			console.log("user already exists");
			return "user already exists";
		}
		await insertUser({
			username,
			hash,
		});
		// cookies.set("user", data.get("username"));
		return {};
	},
};
