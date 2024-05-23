import { getUser } from "$lib/db";
export async function load({ cookies }) {
	// const user = cookies.get("user");
	const user = await getUser();
	return { user: { name: user.username } };
}
