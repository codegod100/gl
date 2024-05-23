import { error, fail, redirect } from "@sveltejs/kit";

export async function load({ cookies, request, url }) {
	const jwt = cookies.get("token") as string;
	if (!jwt) {
		console.log(url.pathname);
		if (url.pathname !== "/") {
			return redirect(301, "/");
		}
	}
}
